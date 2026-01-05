# Udvasito Pathshala - Book Publication Platform

## Overview

Udvasito Pathshala is a full-stack e-commerce website for a Bangladeshi book publication house. The platform allows customers to browse and purchase books online, view the publisher's portfolio, and contact the business. It includes an admin panel for managing books and portfolio items.

The application is built with React (Vite) on the frontend and Express.js on the backend, using PostgreSQL with Drizzle ORM for data persistence. The design follows an editorial/literary aesthetic with a warm, earth-toned color palette.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Routing**: React Router DOM for client-side navigation with page transitions using Framer Motion
- **State Management**: Zustand with persistence for cart and local data; TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens (sand, charcoal, cream color palette)
- **Typography**: Playfair Display (headings) and Inter (body) fonts

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Design**: RESTful JSON API with routes prefixed `/api/`
- **Database**: PostgreSQL via Neon serverless driver
- **ORM**: Drizzle ORM with Zod schema validation
- **File Uploads**: Multer for handling image uploads to `public/uploads`
- **Development**: Vite dev server integrated with Express via middleware mode

### Data Models
- **Books**: Title, author, price, description, cover image, category, ISBN, pages, published year, stock status, featured flag
- **Portfolio**: Title, description, image, category, author, year

### Key Design Decisions
1. **Monorepo Structure**: Frontend and backend share TypeScript types via `shared/schema.ts`, ensuring type safety across the stack
2. **Serverless Database**: Uses Neon PostgreSQL with WebSocket connections for serverless compatibility
3. **Client-Side Cart**: Cart persisted in localStorage via Zustand, reducing server load for cart operations
4. **Email Integration**: EmailJS for contact forms and order notifications without requiring a mail server
5. **Hidden Admin Access**: Admin panel accessed via secret click pattern on logo (4 rapid clicks)

## External Dependencies

### Database
- **PostgreSQL**: Primary database via Neon serverless (`@neondatabase/serverless`)
- **Drizzle ORM**: Database migrations and queries (`drizzle-orm`, `drizzle-kit`)
- **Connection**: Requires `DATABASE_URL` environment variable

### Third-Party Services
- **EmailJS**: Client-side email sending for contact forms and order confirmations
  - Service ID, Template IDs, and Public Key configured via environment variables
  - Fallback values provided in `src/lib/config.ts`

### Key npm Packages
- **UI**: Full shadcn/ui component set (Radix primitives, Tailwind, class-variance-authority)
- **State**: `zustand`, `@tanstack/react-query`
- **Animation**: `framer-motion`
- **Forms**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **Date**: `date-fns`, `react-day-picker`
- **File Upload**: `multer`

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required)
- `VITE_EMAILJS_SERVICE_ID`: EmailJS service identifier
- `VITE_EMAILJS_TEMPLATE_ID`: EmailJS template for subscriptions
- `VITE_EMAILJS_CONTACT_TEMPLATE_ID`: EmailJS template for contact form
- `VITE_EMAILJS_PUBLIC_KEY`: EmailJS public API key
- `VITE_ADMIN_PASSWORD`: Password for admin panel access (default: `dreampublication.001`)