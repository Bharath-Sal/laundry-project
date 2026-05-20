-- ====================================================================
-- WASHCLUB SUPABASE DATABASE SCHEMA INITIALIZATION
-- ====================================================================
-- This script sets up profiles, addresses, orders, and order items.
-- It establishes Row Level Security (RLS) and automated sign-up triggers.
-- Run this directly in the Supabase SQL Editor.
-- ====================================================================

-- 1. PUBLIC PROFILES TABLE
-- Automatically populated when a user registers via Supabase Auth
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text,
    phone text,
    email text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view their own profile" 
    on public.profiles for select 
    using (auth.uid() = id);

create policy "Users can update their own profile" 
    on public.profiles for update 
    using (auth.uid() = id);

-- 2. ADDRESSES TABLE
create table if not exists public.addresses (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    address_line_1 text not null,
    address_line_2 text,
    landmark text,
    pincode text not null,
    area_name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Addresses
alter table public.addresses enable row level security;

-- Addresses Policies
create policy "Users can view their own addresses" 
    on public.addresses for select 
    using (auth.uid() = profile_id);

create policy "Users can insert their own addresses" 
    on public.addresses for insert 
    with check (auth.uid() = profile_id);

create policy "Users can update their own addresses" 
    on public.addresses for update 
    using (auth.uid() = profile_id);

-- 3. ORDERS TABLE
create table if not exists public.orders (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    address_id uuid references public.addresses(id) on delete set null,
    pickup_date date not null,
    pickup_slot text not null,
    delivery_date date not null,
    delivery_slot text not null,
    is_express boolean default false not null,
    subtotal integer not null,
    discount_amount integer default 0 not null,
    total_amount integer not null,
    status text default 'pending_pickup'::text not null, -- pending_pickup, picked_up, processing, out_for_delivery, delivered
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Orders
alter table public.orders enable row level security;

-- Orders Policies
create policy "Users can view their own orders" 
    on public.orders for select 
    using (auth.uid() = profile_id);

create policy "Users can place their own orders" 
    on public.orders for insert 
    with check (auth.uid() = profile_id);

-- 4. ORDER ITEMS TABLE
create table if not exists public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    item_id text not null,
    item_name text not null,
    price integer not null,
    quantity integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Order Items
alter table public.order_items enable row level security;

-- Order Items Policies
create policy "Users can view their own order items" 
    on public.order_items for select 
    using (
        exists (
            select 1 from public.orders 
            where public.orders.id = public.order_items.order_id 
            and public.orders.profile_id = auth.uid()
        )
    );

create policy "Users can insert their own order items" 
    on public.order_items for insert 
    with check (
        exists (
            select 1 from public.orders 
            where public.orders.id = public.order_items.order_id 
            and public.orders.profile_id = auth.uid()
        )
    );

-- ====================================================================
-- AUTOMATION TRIGGERS FOR PROFILE CREATION
-- ====================================================================

-- Function to handle cloning authenticated users to public profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, name, phone, email)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', 'Valued Customer'),
        new.raw_user_meta_data->>'phone',
        new.email
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute whenever a new auth user is created
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
