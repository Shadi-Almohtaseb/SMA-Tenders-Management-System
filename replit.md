# SMA Tenders Management System

## Overview

SMA Tenders Management System is a bilingual (Arabic/English) web application designed to manage and track tenders and guarantees for SMA company. The system provides comprehensive tender lifecycle management, from creation and tracking to expiration notifications and audit logging. Built with Next.js on the frontend and Express on the backend, it features user authentication, role-based access control, file attachments, and detailed audit trails.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework: Next.js 16 with React 19**
- **Rationale**: Provides server-side rendering, excellent developer experience, and built-in routing
- **App Router**: Uses Next.js App Router for file-based routing and layouts
- **RTL Support**: Application defaults to Arabic (RTL) with bilingual UI components
- **State Management**: React Context API for authentication state
- **Client-Side Rendering**: Main application components use client-side rendering for interactive features

**UI Component Library**
- **Styling**: Tailwind CSS with custom design tokens using CSS variables
- **Component Pattern**: Composable UI components in `components/ui/` directory (Button, Card, Dialog, Input, etc.)
- **Utility**: `class-variance-authority` for variant-based component styling, `clsx` and `tailwind-merge` for conditional classes

**Form Handling**
- **Library**: React Hook Form for form state and validation
- **Approach**: Controlled components with validation feedback

### Backend Architecture

**Server Framework: Express.js**
- **Port Configuration**: Runs on port 3001 (configurable via environment)
- **Dual Implementation**: Both TypeScript (`server/index.ts`) and JavaScript (`server/index.js`) versions exist
- **API Structure**: RESTful API with versioned endpoints under `/api` prefix

**Route Organization**
- `/api/auth` - Authentication and user management
- `/api/tenders` - Tender CRUD operations
- `/api/audit` - Audit log retrieval
- `/api/attachments` - File upload and management
- `/api/notifications` - Expiring tender notifications

**Authentication & Authorization**
- **Mechanism**: JWT (JSON Web Tokens) with Bearer authentication
- **Password Security**: bcryptjs for password hashing
- **Middleware**: Custom authentication middleware validates tokens on protected routes
- **Role-Based Access**: User roles (user/admin) with middleware for admin-only operations
- **Session Management**: Tokens stored in localStorage, 7-day expiration

**File Upload System**
- **Library**: Multer for multipart/form-data handling
- **Storage**: Disk storage in `/uploads` directory
- **Limits**: 10MB maximum file size
- **Tracking**: File metadata stored in database with references to tenders

### Data Storage

**Database: PostgreSQL**
- **ORM**: Drizzle ORM for type-safe database operations
- **Connection**: node-postgres (pg) driver with connection pooling
- **Schema Management**: Drizzle Kit for migrations and schema push

**Database Schema**

1. **users table**
   - Stores user credentials and profile information
   - Fields: id, email (unique), password (hashed), name, role, createdAt
   - Supports role-based access control

2. **tenders table**
   - Core tender information and tracking
   - Fields: id, ownerEntity, openingDate, guaranteeAmount (decimal), guaranteeExpiryDate, status, awardedCompany, notes, createdBy (FK), createdAt, updatedAt
   - Status values: "awarded", "under_review", "not_awarded"

3. **auditLogs table**
   - Complete audit trail for tender modifications
   - Fields: id, tenderId (FK), userId (FK), action, changes (JSON), timestamp
   - Tracks all CRUD operations on tenders

4. **attachments table**
   - File attachments linked to tenders
   - Fields: id, tenderId (FK), fileName, filePath, fileSize, mimeType, uploadedBy (FK), uploadedAt

**Schema Approach**
- **Problem**: Need for both TypeScript and JavaScript compatibility
- **Solution**: Dual schema files (`shared/schema.ts` and `shared/schema-js.js`)
- **Trade-off**: Code duplication vs. runtime compatibility with both TS and JS environments

### External Dependencies

**Core Framework Dependencies**
- Next.js (^16.0.1) - React framework for frontend
- React (^19.2.0) and React DOM (^19.2.0) - UI library
- Express (^4.21.2) - Backend server framework

**Database & ORM**
- Drizzle ORM (^0.39.2) - Type-safe database toolkit
- Drizzle Kit (^0.30.1) - Schema management and migrations
- pg (^8.13.1) - PostgreSQL client for Node.js

**Authentication & Security**
- bcryptjs (^2.4.3) - Password hashing
- jsonwebtoken (^9.0.2) - JWT token generation and validation
- cors (^2.8.5) - Cross-origin resource sharing middleware

**File Handling**
- multer (^2.0.2) - File upload middleware
- pdfkit (^0.17.2) - PDF generation capabilities

**UI & Styling**
- Tailwind CSS (^3.4.0) - Utility-first CSS framework
- class-variance-authority (^0.7.1) - Component variant management
- lucide-react (^0.552.0) - Icon library

**Utilities**
- date-fns (^4.1.0) - Date manipulation and formatting with Arabic locale support
- dotenv (^16.4.7) - Environment variable management
- TypeScript (^5.9.3) - Type safety and developer experience

**Configuration & Tooling**
- ESLint with Next.js config - Code quality enforcement
- PostCSS with Autoprefixer - CSS processing

**Environment Variables Required**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - JWT signing secret (warns if not set in production)
- `NEXT_PUBLIC_API_URL` - API endpoint URL (defaults to http://localhost:3001/api)
- `PORT` - Server port (defaults to 3001)

**Development Scripts**
- `npm run dev` - Start Next.js development server on port 5000
- `npm run server` - Start Express backend server
- `npm run build` - Build Next.js for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management