# Udvasito Pathshala Publication

## Overview
A book publication and portfolio website for Udvasito Pathshala, curating Bengali literature. This is a full-stack React application with an Express backend and PostgreSQL database.

## Project Structure
- `/src` - Frontend React application
  - `/components` - Reusable UI components (shadcn/ui)
  - `/pages` - Route pages (Index, Shop, BookDetail, Portfolio, Contact, Cart, AdminPanel)
  - `/hooks` - Custom React hooks
  - `/lib` - Utility functions and configuration
- `/server` - Express backend
  - `index.ts` - Server entry point
  - `routes.ts` - API routes
  - `storage.ts` - Database operations
  - `vite.ts` - Vite middleware setup
- `/shared` - Shared types and schemas
  - `schema.ts` - Drizzle schema definitions
- `/public` - Static assets and uploads

## Tech Stack
- **Frontend**: React 18, React Router, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Express 5, Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Build**: Vite, TypeScript, esbuild

## Key Features
- Book catalog with categories and filtering
- Shopping cart functionality
- Portfolio gallery
- Admin panel for content management
- Contact form
- Image upload support

## Development
- Run: `npm run dev`
- Database push: `npm run db:push`
- Build: `npm run build`

## Database Schema
- `books` - Book catalog with title, author, price, description, cover image, category
- `portfolio` - Portfolio items with title, description, image, category

## API Endpoints
- `GET /api/books` - List all books
- `POST /api/books` - Create book
- `PATCH /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/portfolio` - List portfolio items
- `DELETE /api/portfolio/:id` - Delete portfolio item
- `POST /api/upload` - Upload file

## Recent Changes
- January 6, 2026: Migrated from Lovable to Replit environment
- Database provisioned and schema synced
- Workflow configured for development