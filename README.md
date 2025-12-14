# Sweet Shop - Premium E-Commerce Platform

A modern, full-stack e-commerce web application for managing and purchasing sweets and chocolates. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

**Author:** Chandan

---

## Project Overview

Sweet Shop is a premium e-commerce platform designed for selling artisan sweets and chocolates online. The application features a sleek dark-tech aesthetic with cyan accents, providing a modern and professional user experience.

### Key Features

- **User Authentication** - Secure registration, login, password reset, and Google OAuth via Supabase Auth
- **Product Catalog** - Browse sweets and chocolates with images, descriptions, pricing, and stock info
- **Admin Dashboard** - Full product management (create, read, update, delete)
- **Responsive Design** - Modern glass-morphism UI optimized for all devices
- **Role-Based Access** - Admin and user roles with protected routes
- **Real-time Updates** - PostgreSQL database with Supabase

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Custom animations |
| **Backend** | Next.js API Routes, Server Actions |
| **Database** | PostgreSQL (Supabase) |
| **Authentication** | Supabase Auth (Email/Password, Google OAuth) |
| **Storage** | Supabase Storage (product images) |

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm, yarn, or bun package manager
- Supabase account ([Sign up here](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sweet-shop.git
cd sweet-shop
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase Dashboard under **Project Settings > API**.

### 4. Set Up Database Tables

Navigate to your Supabase SQL Editor and run the following:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sweets table
CREATE TABLE sweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('candy', 'chocolate', 'cake', 'cupcake')),
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sweet_id UUID REFERENCES sweets(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for simplicity (enable for production with proper policies)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE sweets DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchases DISABLE ROW LEVEL SECURITY;
```

### 5. Configure Supabase Auth Redirect URLs

In Supabase Dashboard > **Authentication > URL Configuration**:

- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** Add `http://localhost:3000/auth/callback`

For Google OAuth (optional), configure in **Authentication > Providers > Google**.

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Authentication Flow

1. **Registration** - Users sign up with email/password or Google OAuth
2. **Email Verification** - Confirmation email sent to verify account
3. **Login** - Authenticate with credentials or Google
4. **Password Reset** - Request password reset link via email
5. **Role-Based Access** - Admins redirected to `/admin`, users to `/dashboard`

---

## Admin Setup

To create an admin account:

1. Navigate to `/admin/setup`
2. Fill in your details (name, email, password)
3. Submit to create admin account
4. Access the admin dashboard at `/admin`

**Note:** The first admin must be created via the setup page. Additional admins can be created by updating the `role` field in the `profiles` table.

---

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard & setup
│   ├── api/             # API routes
│   │   ├── admin/       # Admin API endpoints
│   │   ├── auth/        # Authentication endpoints
│   │   └── sweets/      # Product endpoints
│   ├── auth/            # Auth callback
│   ├── dashboard/       # User dashboard
│   ├── forgot-password/ # Password reset
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── CyberBackground.tsx
│   └── ErrorReporter.tsx
└── lib/
    ├── actions/         # Server actions
    └── supabase/        # Supabase client config
```

---

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables in project settings
4. Deploy

### Production Checklist

- [ ] Enable RLS on Supabase tables with proper policies
- [ ] Configure production redirect URLs in Supabase
- [ ] Set up custom domain
- [ ] Enable HTTPS

---

## License

This project is private and proprietary. All rights reserved by Chandan.

---

## Contact

For questions or support, reach out to the project owner.
