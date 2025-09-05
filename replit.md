# InfluBee AI Persona Creation Platform

## Overview

InfluBee is a full-stack web application that enables users to create and interact with custom AI influencer personas. The platform features a streamlined 4-step persona creation wizard and a real-time chat interface for conversations with AI companions. Built with React/TypeScript frontend, Express.js backend, and PostgreSQL database, the application focuses on creating engaging, flirty AI personalities with Hindi-English mixed communication styles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using modern React with TypeScript, featuring a component-based architecture:

- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting dark mode with a neutral color scheme
- **UI Components**: Extensive use of Radix UI primitives wrapped in custom components following the shadcn/ui design system
- **Routing**: Wouter for lightweight client-side routing with two main routes: persona creation (`/`) and chat interface (`/chat/:id`)
- **State Management**: TanStack Query for server state management and caching, with local React state for UI interactions
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
The server follows a RESTful API design with Express.js:

- **Framework**: Express.js with TypeScript for type-safe server development
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Storage Strategy**: Memory storage implementation with interface-based design allowing for future database integration
- **API Design**: RESTful endpoints for persona creation, conversation management, and message handling
- **Middleware**: Custom logging middleware for API request tracking and error handling

### Data Storage Solutions
The application uses a PostgreSQL database with Drizzle ORM:

- **Database**: PostgreSQL configured through environment variables with Neon Database serverless integration
- **Schema Design**: Three main entities - users, AI personas, and conversations with proper foreign key relationships
- **Data Types**: JSON columns for storing arrays (traits, icebreakers) and complex message structures
- **Migration Strategy**: Drizzle Kit for schema migrations and database management

### Authentication and Authorization
Currently implements a basic user system:

- **User Management**: Simple username/password authentication structure
- **Session Handling**: Prepared for session-based authentication with connect-pg-simple for PostgreSQL session storage
- **Authorization**: Basic user-persona ownership validation for data access control

### AI Integration Architecture
The system is designed for AI conversation management:

- **System Prompt Generation**: Dynamic system prompt creation based on persona characteristics, personality traits, and communication style
- **Message Handling**: Structured conversation flow with user and assistant message types
- **Conversation Management**: Persistent conversation history with timestamp tracking
- **Persona Customization**: Comprehensive persona configuration including personality traits, communication style, and behavioral instructions

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, and React Router (Wouter) for frontend framework
- **TypeScript**: Full TypeScript support across frontend and backend for type safety
- **Vite**: Modern build tool with hot module replacement and optimized production builds

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with PostCSS integration
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives including dialogs, dropdowns, forms, and navigation components
- **Lucide React**: Icon library for consistent iconography across the application
- **Class Variance Authority**: Utility for creating type-safe component variants

### Backend Infrastructure
- **Express.js**: Web application framework for Node.js with middleware support
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL dialect support
- **Drizzle Kit**: Database migration and schema management tool
- **Neon Database**: Serverless PostgreSQL database service integration

### Data Management
- **TanStack Query**: Powerful data synchronization library for React applications
- **React Hook Form**: Performance-focused forms library with validation support
- **Zod**: TypeScript-first schema validation library integrated with Drizzle for runtime type checking

### Development and Build Tools
- **ESBuild**: Fast JavaScript bundler for server-side code compilation
- **TSX**: TypeScript execution engine for development server
- **Replit Integration**: Development environment integration with error overlay and debugging tools

### Utility Libraries
- **Date-fns**: Modern JavaScript date utility library for timestamp handling
- **Nanoid**: URL-safe unique string ID generator for entity creation
- **CMDK**: Command menu component for enhanced user interactions
- **Embla Carousel**: Lightweight carousel library for UI components