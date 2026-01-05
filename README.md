# Udvasito Pathshala - Book Publication Platform

## Overview

Udvasito Pathshala is a full-stack e-commerce website for a Bangladeshi book publication house. The platform enables customers to browse and purchase books online, view the publisher's portfolio of published works, and contact the business. The application features a literary/editorial design aesthetic with Bengali typography support and a warm sand/cream color palette.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite with SWC for fast compilation
- **Routing**: React Router DOM for client-side navigation with Framer Motion page transitions
- **State Management**: 
  - Zustand with localStorage persistence for cart data
  - TanStack React Query for server state and API caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens (sand, charcoal, cream color palette)
- **Typography**: Playfair Display for headings, Inter for body text

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Design**: RESTful JSON API with all routes prefixed under `/api/`
- **Development Mode**: Vite dev server integrated with Express via middleware mode for HMR support
- **File Uploads**: Multer handles image uploads, stored in `public/uploads` directory
- **Production Build**: esbuild bundles the server, Vite builds the client

### Database Layer
- **Database**: PostgreSQL via Neon serverless driver with WebSocket connections
- **ORM**: Drizzle ORM for type-safe queries and migrations
- **Schema Location**: `shared/schema.ts` contains all table definitions and Zod validation schemas
- **Migrations**: Run via `npm run db:push` using drizzle-kit

### Data Models
- **Books**: id, title, author, price, description, coverImage, category, featured, isbn, pages, publishedYear, inStock
- **Portfolio**: id, title, description, image, category, author, year

### Key Design Decisions

1. **Monorepo with Shared Types**: Frontend and backend share TypeScript types through `shared/schema.ts`, ensuring type safety across the full stack without code duplication.

2. **Client-Side Cart Persistence**: Cart state is managed in Zustand with localStorage persistence. This reduces server load and provides offline-capable cart functionality.

3. **Hidden Admin Access**: The admin panel is accessed via a secret click pattern (4 rapid clicks on the logo) rather than a visible link, providing security through obscurity for the small publisher use case.

4. **Serverless Database**: Uses Neon PostgreSQL with WebSocket connections, making the app compatible with serverless deployment environments.

5. **Email-Based Notifications**: EmailJS handles contact forms and order notifications client-side, eliminating the need for a dedicated mail server.

## External Dependencies

### Database
- **PostgreSQL**: Primary data store via Neon serverless (`@neondatabase/serverless`)
- **Drizzle ORM**: Schema management and queries (`drizzle-orm`, `drizzle-kit`)
- **Required Environment Variable**: `DATABASE_URL` must be set to the Neon connection string

### Third-Party Services
- **EmailJS**: Client-side email delivery for contact forms and order notifications
  - Configured via environment variables: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

### Key NPM Packages
- `@tanstack/react-query`: Server state management and caching
- `zustand`: Client-side state management with persistence
- `framer-motion`: Page transition animations
- `multer`: Server-side file upload handling
- `zod`: Runtime schema validation (via drizzle-zod)
- Full shadcn/ui component set via Radix UI primitives
