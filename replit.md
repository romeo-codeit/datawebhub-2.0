# Portfolio Website

## Overview

A modern, dynamic portfolio website built with React/Vite and Express.js featuring an interactive AI chat assistant with 3D avatar integration. The site showcases projects dynamically loaded from a PostgreSQL database and includes smooth animations throughout. Built with a clean, professional design using a sage green, warm orange, and calming blue color palette.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing 
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **TypeScript**: Full type safety across the application

### Backend Architecture  
- **Server**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful endpoints for projects and chat functionality
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Storage Layer**: Abstracted storage interface with in-memory implementation (ready for database integration)
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Database Schema
- **Projects Table**: Stores project information including title, description, technologies, images, and categories
- **Chat Messages Table**: Stores AI chat interactions with metadata for avatar animations
- **Users Table**: Basic user authentication structure (prepared for future use)

### UI/UX Design Patterns
- **Design System**: Custom color palette with CSS variables for consistent theming
- **Animations**: Intersection Observer-based scroll reveals and smooth transitions
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component Architecture**: Reusable UI components with proper separation of concerns

### AI Chat Integration
- **Chat Interface**: Real-time messaging with avatar animation triggers
- **Avatar System**: Placeholder implementation ready for 3D avatar integration
- **Animation States**: Multiple avatar animations (idle, wave, talk, cheer, backflip, nod)
- **Metadata Storage**: Chat responses include animation and emotion data

## External Dependencies

### Core Frontend Libraries
- **React**: UI framework with hooks and context
- **Vite**: Build tool and development server
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing solution

### UI Framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library  
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library

### Backend Infrastructure
- **Express.js**: Web application framework
- **Drizzle ORM**: Type-safe database toolkit
- **Neon Database**: Serverless PostgreSQL provider
- **Zod**: Runtime type validation

### Development Tools
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast bundling for production
- **PostCSS**: CSS processing with Autoprefixer

### Future Integration Points
- **3D Avatar Library**: Ready for Three.js or similar 3D rendering
- **AI Model API**: Prepared endpoints for external AI service integration
- **Authentication**: User system ready for implementation
- **File Uploads**: Infrastructure prepared for project image management