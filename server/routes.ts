import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";
import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({ message: "Logged in successfully", user: req.user });
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Project routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/featured", async (_req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured projects" });
    }
  });

  app.get("/api/projects/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const projects = await storage.getProjectsByCategory(category);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects by category" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", ensureAuthenticated, upload.single("image"), async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        technologies: req.body.technologies.split(","),
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      });
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Chat routes
  app.get("/api/chat/messages", async (_req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Simple AI response logic - in production, integrate with OpenAI, Claude, etc.
      let response = "I'm Alex's AI assistant. Let me help you with information about Alex's work and skills.";
      let animationData = { animation: "idle", emotion: "neutral" };

      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes("skill") || lowerMessage.includes("technology") || lowerMessage.includes("tech")) {
        response = "Alex specializes in React, Next.js, Node.js, TypeScript, and modern web development. He also has strong UI/UX design skills and experience with cloud technologies including AWS and Docker. He's passionate about creating scalable, performant applications with great user experiences.";
        animationData = { animation: "talk", emotion: "enthusiastic" };
      } else if (lowerMessage.includes("project") || lowerMessage.includes("work") || lowerMessage.includes("portfolio")) {
        response = "Alex has worked on various exciting projects including e-commerce platforms, mobile applications, and comprehensive design systems. His recent work includes a full-stack e-commerce solution with real-time features, a cross-platform task management app, and a scalable design system used across multiple products.";
        animationData = { animation: "wave", emotion: "proud" };
      } else if (lowerMessage.includes("contact") || lowerMessage.includes("hire") || lowerMessage.includes("email")) {
        response = "You can reach Alex at hello@alexjohnson.dev or through his LinkedIn profile. He's always interested in discussing new opportunities and exciting projects. Feel free to download his resume or schedule a call to discuss your project needs!";
        animationData = { animation: "nod", emotion: "helpful" };
      } else if (lowerMessage.includes("experience") || lowerMessage.includes("background")) {
        response = "Alex is a Senior Full-Stack Developer with 5+ years of experience. He currently works at TechCorp Solutions leading development of enterprise applications. Previously, he worked at a creative agency developing solutions for Fortune 500 clients. He has a strong background in both technical development and user experience design.";
        animationData = { animation: "talk", emotion: "professional" };
      } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
        response = "Hello! I'm Alex's AI assistant. I'm here to help you learn more about Alex's skills, projects, and experience. What would you like to know?";
        animationData = { animation: "wave", emotion: "friendly" };
      }

      const chatMessage = await storage.createChatMessage({
        message,
        response,
        metadata: animationData
      });

      res.json(chatMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
