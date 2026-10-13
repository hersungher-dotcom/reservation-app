-- Enable Row Level Security (RLS) on all tables
alter table profiles enable row level security;
alter table events enable row level security;
alter table event_slots enable row level security;
alter table reservations enable row level security;

-- Profiles policies
-- Users can view their own profile
create policy "Users can view their own profile"
on profiles for select
using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

-- Events policies
-- Anyone can view events (public read access)
create policy "Anyone can view events"
on events for select
using (true);

-- Only authenticated users can create events (you might want to restrict this further to admins)
create policy "Authenticated users can create events"
on events for insert
with check (auth.role() = 'authenticated');

-- Event slots policies
-- Anyone can view active event slots
create policy "Anyone can view event slots"
on event_slots for select
using (is_active = true);

-- Only authenticated users can create event slots
create policy "Authenticated users can create event slots"
on event_slots for insert
with check (auth.role() = 'authenticated');

-- Reservations policies
-- Users can view their own reservations
create policy "Users can view their own reservations"
on reservations for select
using (auth.uid() = user_id);

-- Users can create reservations
create policy "Users can create reservations"
on reservations for insert
with check (auth.uid() = user_id);

-- Users can update their own reservations (e.g., to cancel)
create policy "Users can update their own reservations"
on reservations for update
using (auth.uid() = user_id);

-- Users can delete their own reservations
create policy "Users can delete their own reservations"
on reservations for delete
using (auth.uid() = user_id);