# Modern Portfolio Website

A professional, modern portfolio website with AI chat functionality and dark purple theme with cyan accents.

## Features

- 🎨 Modern dark purple design with cyan accents
- 🚀 Floating circular navigation
- 💬 AI-powered chat interface with avatar placeholder
- 📱 Fully responsive design
- ⚡ Built with React + Vite and Express.js
- 🗄️ Dynamic content management
- 🎭 Smooth animations and transitions
- 🔧 Production-ready with environment configuration

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your personal information
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Configuration

Copy `.env.example` to `.env` and configure the following variables:

### Required Variables
- `VITE_USER_NAME` - Your full name
- `VITE_USER_TITLE` - Your professional title
- `VITE_USER_BIO` - Your professional bio

### Optional Variables
- `VITE_USER_AVATAR` - Path to your avatar image
- `VITE_HERO_IMAGE` - Path to your hero section image
- `VITE_GITHUB_URL` - Your GitHub profile URL
- `VITE_LINKEDIN_URL` - Your LinkedIn profile URL
- `VITE_TWITTER_URL` - Your Twitter profile URL

## Adding Content

### Projects
Add projects through the API endpoints:

```bash
# Add a new project
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project",
    "description": "Project description",
    "category": "web",
    "technologies": ["React", "Node.js"],
    "imageUrl": "path/to/image.jpg",
    "featured": "true"
  }'
```

### Skills & Experience
Currently handled via frontend arrays - extend the API to manage these dynamically.

## AI Chat Integration

The chat system is ready for external AI integration:

1. Update the chat API in `server/routes.ts`
2. Integrate with your preferred AI service (OpenAI, Claude, etc.)
3. Configure the avatar animation system for 3D models

## Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting platform

3. **Deploy** using your preferred platform (Vercel, Netlify, Railway, etc.)

## Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Express.js, TypeScript
- **Database:** In-memory storage (ready for PostgreSQL)
- **UI Components:** Radix UI + shadcn/ui
- **Fonts:** Space Grotesk, Inter

## Color Scheme

- **Primary Background:** Dark Purple (#180026)
- **Primary Text:** Cyan (#60FFD1)
- **Purple Accent:** #7400B8
- **Blue Accent:** #5E60CE

## License

MIT License - feel free to use this for your own portfolio!