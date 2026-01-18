# Hotel Management System

A complete, production-ready Hotel Management System built with Next.js 16, MongoDB, and modern best practices. This system supports Admin Dashboard, Staff Panel, and Customer Portal with role-based access control.

## Features

### 🔐 Authentication & Authorization
- NextAuth.js with JWT-based sessions
- Role-based access control (Admin, Staff, Customer)
- Secure password hashing with bcrypt
- Protected routes with middleware

### 👥 User Roles
- **Admin**: Full system access including user management, settings
- **Staff**: Access to bookings, rooms, payments, and housekeeping
- **Customer**: Room browsing, booking, and profile management

### 🛏️ Room Management
- CRUD operations for rooms
- Room types (Standard, Deluxe, Suite)
- Pricing per night
- Capacity and amenities
- Status management (Available, Occupied, Maintenance)
- Image upload support
- Advanced filtering and search

### 📅 Booking System
- Date range selection
- Availability checking
- Booking status workflow (Pending → Confirmed → Checked-In → Checked-Out)
- Cancellation handling
- Customer and admin booking management

### 💳 Payment Integration
- Stripe payment gateway
- Razorpay payment gateway
- Payment verification via webhooks
- Invoice generation
- Payment history

### 🧹 Housekeeping Module
- Room cleaning status tracking
- Maintenance logs
- Staff assignment
- Issue reporting
- Priority levels

### 📊 Reports & Analytics
- Revenue reports (daily, monthly, yearly)
- Occupancy reports
- Booking trends
- Export capabilities

### 📈 Admin Dashboard
- KPI cards (Total Rooms, Available, Occupied, Revenue, Today's Bookings)
- Revenue charts (monthly)
- Occupancy rate charts
- Recent bookings table

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes + Server Actions
- **Database**: MongoDB + Mongoose
- **Auth**: NextAuth.js (JWT-based)
- **Payments**: Stripe + Razorpay
- **Charts**: Recharts
- **Validation**: Zod
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Stripe account (for payments)
- Razorpay account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hotel-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/hotel-management
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Seed the database:
```bash
npm run seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials

After seeding the database, you can use these credentials:

- **Admin**: admin@hotel.com / admin123
- **Staff**: staff@hotel.com / staff123
- **Customer**: customer@example.com / customer123

## Project Structure

```
app/
├── (auth)/          # Authentication pages
├── admin/           # Admin dashboard and features
├── customer/        # Customer portal
├── api/             # API routes
├── actions/         # Server actions
├── components/      # React components
├── lib/             # Utility functions
├── models/          # Mongoose models
└── middleware.ts    # Route protection
```

## Environment Variables

See `.env.example` for all required environment variables.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Security Features

- Password hashing with bcrypt
- JWT token expiration
- CSRF protection via NextAuth
- Input validation with Zod
- SQL injection prevention (MongoDB)
- XSS protection (React default)
- Role-based access control
- Secure cookie settings

## Performance Optimizations

- Server Components for data fetching
- Suspense boundaries for progressive loading
- Image optimization with next/image
- Database indexes on frequently queried fields
- Efficient MongoDB queries
- Minimal client JavaScript

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the repository.
