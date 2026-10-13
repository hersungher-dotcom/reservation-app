-- Create tables for reservation system

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- Events table
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Event slots table (time slots for events)
create table event_slots (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  max_capacity integer default 1,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Reservations table
create table reservations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events not null,
  event_slot_id uuid references event_slots not null,
  user_id uuid references auth.users not null,
  status text default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable real-time for tables (optional, but useful for subscriptions)
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table event_slots;
alter publication supabase_realtime add table reservations;
alter publication supabase_realtime add table profiles;