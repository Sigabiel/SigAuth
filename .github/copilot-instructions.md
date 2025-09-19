# SigAuth Development Instructions

SigAuth is a TypeScript authentication service built as a monorepo containing a NestJS API, React webapp, and shared Prisma database package. The system provides authentication, authorization, and asset management capabilities.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites
- Node.js 20.19.5+ (verified working version)
- npm 10.8.2+ (verified working version) 
- PostgreSQL 12+ (for database operations)

### Initial Setup (CRITICAL - Must be done first)
```bash
# Install all dependencies (takes 1-2 minutes)
npm install

# Set up PostgreSQL database (required for Prisma)
sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql && sudo systemctl enable postgresql
sudo -u postgres createdb sigauth
sudo -u postgres psql -c "CREATE USER sigauthuser WITH ENCRYPTED PASSWORD 'sigauthpass'; GRANT ALL PRIVILEGES ON DATABASE sigauth TO sigauthuser;"

# Configure database connection
cp packages/prisma-wrapper/.env.template packages/prisma-wrapper/.env
# Edit .env: DATABASE_URL=postgresql://sigauthuser:sigauthpass@localhost:5432/sigauth

# Generate Prisma client (REQUIRED before building anything)
cd packages/prisma-wrapper
npx prisma generate
npx prisma migrate dev
cd ../..
```

**CRITICAL LIMITATION**: If Prisma client generation fails due to network restrictions (cannot access binaries.prisma.sh), the build system will not work. This is a known limitation in sandboxed environments.

### Build Process
```bash
# Build all packages (takes 3-5 minutes, NEVER CANCEL)
npm run build  # Uses turborepo to build prisma-wrapper, API, and webapp

# Build individual components (if needed)
cd packages/prisma-wrapper && npm run build
cd apps/api && npm run build
cd apps/webapp && npm run build
```

**NEVER CANCEL BUILDS**: Build may take 5+ minutes. Always set timeout to 10+ minutes for build commands.

### Development Servers
```bash
# Run all services in development mode
npm run dev

# Or run individually:
# API server (requires database)
cd apps/api && npm run dev  # Runs on http://localhost:3000

# Webapp development server 
cd apps/webapp && npm run dev  # Runs on http://localhost:5173
# Note: Webapp proxies /api requests to localhost:3000
```

### Testing and Validation
```bash
# Lint (fix issues before committing)
cd apps/api && npm run lint
cd apps/webapp && npm run lint

# Run tests
cd apps/api && npm run test        # Unit tests
cd apps/api && npm run test:e2e    # E2E tests
cd apps/api && npm run test:cov    # Coverage

# Format code
cd apps/api && npm run format
```

**Known Issues**:
- API tests fail with path resolution errors (Jest configuration issue)
- Linting shows TypeScript errors when Prisma client is not generated
- Webapp has 5 linting errors and 4 warnings that need fixing
- **VERIFIED**: Webapp development server works and displays login interface correctly

## Validation Scenarios

**ALWAYS** run these validation steps after making changes:

### Database Operations
1. Verify Prisma schema changes: `cd packages/prisma-wrapper && npx prisma migrate dev`
2. Test database connection: API should start without errors when database is running

### API Testing
1. Start API: `cd apps/api && npm run dev`
2. Test Swagger docs: Visit http://localhost:3000/api/docs  
3. Test health endpoint: `curl http://localhost:3000/api`

### Webapp Testing
1. Start webapp: `cd apps/webapp && npm run dev`
2. Open browser: http://localhost:5173
3. Verify login interface loads correctly (should show "Login to your account" form)
4. Test login flow (requires API running with database)

### Build Validation
1. Clean install: `rm -rf node_modules && npm install`
2. Full build: `npm run build` 
3. Production API: `npm run start` (uses apps/api/dist/main.js)

## Architecture Overview

### Repository Structure
```
/
├── apps/
│   ├── api/          # NestJS authentication API
│   └── webapp/       # React frontend application  
├── packages/
│   └── prisma-wrapper/ # Shared database types and client
├── package.json      # Root workspace configuration
└── turbo.json       # Turborepo build configuration
```

### Key Components

**API (NestJS)**:
- Main entry: `apps/api/src/main.ts`
- Modules: authentication, account, app, asset, asset-type, container
- Database: Uses Prisma client from shared package
- Swagger docs: http://localhost:3000/api/docs
- Rate limiting: 10 requests/minute

**Webapp (React + Vite)**:
- Main entry: `apps/webapp/src/main.tsx`
- UI framework: React 19, Vite, TailwindCSS, shadcn/ui
- Proxy: API requests to localhost:3000
- Auth flow: Cookie-based sessions

**Prisma Wrapper**:
- Schema: `packages/prisma-wrapper/prisma/schema.prisma`
- Generated client: `packages/prisma-wrapper/prisma/generated/client/`
- Exports: Extended Prisma client, JSON types, protected constants

### Database Schema
Main entities: Account, Session, App, Asset, AssetType, Container, PermissionInstance

## Common Tasks

### Adding New API Endpoints
1. Create controller in `apps/api/src/modules/[module]/`
2. Add DTOs in `[module]/dto/`
3. Update service in `[module]/[module].service.ts`
4. Add to module exports
5. Test with Swagger docs

### Database Schema Changes
1. Edit `packages/prisma-wrapper/prisma/schema.prisma`
2. Generate migration: `cd packages/prisma-wrapper && npx prisma migrate dev`
3. Rebuild wrapper: `npm run build`
4. Reinstall in root: `cd ../.. && npm install`

### Webapp Component Development
1. Components: `apps/webapp/src/components/`
2. Routes: `apps/webapp/src/routes/`
3. Shared UI: Uses shadcn/ui components
4. Styling: TailwindCSS with custom config

## Environment Configuration

**API Environment** (`apps/api/.env`):
- `FRONTEND_URL`: Default http://localhost:5713
- Session configuration via environment variables

**Prisma Environment** (`packages/prisma-wrapper/.env`):
- `DATABASE_URL`: PostgreSQL connection string

## Troubleshooting

**Build Failures**:
- Always ensure Prisma client is generated first
- Check database is running for API operations  
- Clear node_modules and reinstall if dependency issues

**Network Issues**:
- Prisma binary downloads may fail in restricted environments (binaries.prisma.sh blocked)
- API requires database connection to start
- **VERIFIED**: Webapp development works without API (shows login form, some features require backend)

**Lint/Type Errors**:
- Most errors relate to missing Prisma client types
- Fix webapp TypeScript errors before committing
- Use `--fix` flag for auto-fixable issues

Always run `npm run build` and fix all issues before committing code changes.