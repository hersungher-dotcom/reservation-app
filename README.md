# Reservation App

A modern reservation web app for events and appointments built with Next.js, TypeScript, and Supabase.

## Features

- 📅 Browse upcoming events and appointments
- 🕒 View and book available time slots
- 🔐 Secure authentication with Supabase
- 📋 Manage your reservations
- 🚀 Easy deployment to Vercel
- 💾 Data persistence with Supabase PostgreSQL

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication)
- **State Management**: React hooks with Supabase real-time capabilities
- **Deployment**: Vercel (frontend), Supabase (backend)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key from Settings → API
   - Create a `.env.local` file in the root directory with:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```
   - Run the database migrations:
     - Go to Supabase SQL editor
     - Execute the contents of `supabase/migrations/20261012000001_init_schema.sql`
     - Execute the contents of `supabase/migrations/20261012000002_rls_policies.sql`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app                 # Next.js 13+ app directory
  /api               # API routes (serverless functions)
  /events            # Events pages
  /reservations      # Reservation pages
  /profile           # User profile pages
/components          # Reusable React components
  /ui                # UI primitives (buttons, forms, modals, cards)
  /events            # Event-specific components
  /reservations      # Reservation-specific components
/lib                 # Utility functions
  supabase.ts        # Supabase client initialization
/types               # TypeScript type definitions
/supabase            # Supabase migration files
```

## Key Features

### Authentication
- Email/password authentication via Supabase Auth
- Protected routes for reservation functionality
- User profile management

### Reservation Flow
1. Browse available events on homepage
2. Select an event to see details and time slots
3. Choose an available time slot
4. Enter booking information and confirm reservation
5. View and manage reservations in your profile

### Database Schema
- **events**: Stores event information (title, description, location, etc.)
- **event_slots**: Time slots for each event with capacity limits
- **reservations**: User bookings linking to events and time slots
- **profiles**: Extended user information (extends Supabase auth.users)

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Vercel will automatically build and deploy your app

## Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase project settings under API.

## License

MIT

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Supabase](https://supabase.com)
- UI inspiration from various open-source component libraries