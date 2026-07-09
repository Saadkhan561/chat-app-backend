# Chat Software Backend

A TypeScript-based backend application for a chat software with real-time communication, user authentication, and project/workspace management features.

## Tech Stack
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Real-time Communication**: Socket.io
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Authentication**: JWT + bcrypt
- **Email Service**: Nodemailer

## Project Structure
```
src/
├── config/               # Configuration files (data-source.ts for TypeORM)
├── docs/                 # Swagger/OpenAPI documentation
├── dto/                  # Data Transfer Objects (validation schemas)
├── enum/                 # Enumeration definitions
├── interfaces/           # TypeScript interfaces
├── middlewares/          # Express middlewares (auth, validation)
├── migrations/           # TypeORM database migrations
├── modules/              # Feature modules (each module has controller, route, service, docs, entity)
│   ├── auth-module/      # User authentication
│   ├── bookmarks-module/ # Bookmark management
│   ├── conversations-module/ # Chat conversations
│   ├── mail-module.ts/   # Email service
│   ├── message-module/   # Chat messages
│   ├── pinned-message-module/ # Pinned messages
│   ├── project-module/   # Project management
│   ├── user-module/      # User management
│   ├── worked-hours-module/ # Worked hours tracking
│   └── workspace-module/ # Workspace management
├── shared/               # Shared utilities
├── sockets/              # Socket.io handlers
├── app.ts                # Express app setup
├── index.ts              # Server entry point
└── routes.ts             # API route definitions
```

## Flow Overview

### 1. Server Initialization (`src/index.ts`)
- Loads environment variables
- Initializes TypeORM data source (connects to PostgreSQL)
- Creates HTTP server from Express app
- Initializes Socket.io for real-time communication
- Starts listening on specified port (default: 3000)

### 2. Express App Setup (`src/app.ts`)
- Configures CORS
- Parses JSON/urlencoded requests
- Sets up Swagger UI at `/api-docs`
- Mounts main router

### 3. API Routing (`src/routes.ts`)
- Defines all API routes grouped by feature modules
- Applies `authMiddleware` to protected routes (most routes except auth)

### 4. Middlewares (`src/middlewares/`)
- `auth.middleware.ts`: Verifies JWT tokens and attaches user to request
- `validate.middleware.ts`: Validates request bodies using Zod schemas

### 5. Feature Modules (`src/modules/`)
Each module follows a standard structure:
- `*.route.ts`: Defines module-specific routes and applies middlewares
- `*.controller.ts`: Handles HTTP requests, validates input, calls service
- `*.service.ts`: Contains business logic, interacts with database
- `*.entity.ts`: TypeORM entity model
- `*.docs.ts`: Swagger/OpenAPI documentation for endpoints
- `*.dto.ts`: Zod validation schemas (located in `src/dto/`)

### 6. Real-time Communication (`src/sockets/`)
- `chat.socket.ts`: Main Socket.io initialization
- `handlers/`: Contains event handlers for:
  - Joining/leaving conversations
  - Sending messages
  - Creating new conversations
  - Disconnecting

## Available Scripts
```bash
# Development: Compiles TypeScript and runs with nodemon
npm run dev

# Build: Compiles TypeScript
npm run build

# Start: Runs compiled JavaScript
npm start

# TypeORM commands
npm run typeorm                  # Base TypeORM command
npm run migration:generate       # Generate new migration
npm run migration:run            # Run pending migrations
npm run migration:revert         # Revert last migration
```

## Environment Variables
Create a `.env` file in the root directory with necessary variables (database URL, JWT secret, email credentials, etc.)

## API Documentation
Once the server is running, visit `/api-docs` to view the Swagger UI and test API endpoints.
