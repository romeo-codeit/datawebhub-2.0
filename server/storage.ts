import { type User, type InsertUser, type Project, type InsertProject, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project methods
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<boolean>;

  // Chat methods
  getChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.chatMessages = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed some initial projects
    const sampleProjects: Project[] = [
      {
        id: "1",
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce solution with React, Node.js, and Stripe integration. Features real-time inventory management and analytics dashboard.",
        longDescription: "A comprehensive e-commerce platform built with modern web technologies. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and an admin dashboard with real-time analytics.",
        category: "web",
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "Socket.io"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500",
        demoUrl: "https://ecommerce-demo.example.com",
        githubUrl: "https://github.com/user/ecommerce-platform",
        featured: "true",
        createdAt: new Date("2024-01-15")
      },
      {
        id: "2",
        title: "Task Management App",
        description: "Cross-platform mobile app built with React Native. Features offline sync, push notifications, and team collaboration tools.",
        longDescription: "A powerful task management application designed for teams and individuals. Built with React Native for cross-platform compatibility, featuring offline synchronization, real-time collaboration, push notifications, and advanced project organization tools.",
        category: "mobile",
        technologies: ["React Native", "Expo", "SQLite", "Firebase", "Redux"],
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500",
        demoUrl: null,
        githubUrl: "https://github.com/user/task-manager",
        featured: "true",
        createdAt: new Date("2024-02-01")
      },
      {
        id: "3",
        title: "Design System",
        description: "Comprehensive design system with reusable components, design tokens, and documentation. Built for scalability and consistency.",
        longDescription: "A complete design system that provides a unified visual language and component library. Includes design tokens, comprehensive documentation, Storybook integration, and tools for maintaining consistency across multiple products and platforms.",
        category: "design",
        technologies: ["Figma", "Storybook", "Design Tokens", "React", "TypeScript"],
        imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500",
        demoUrl: "https://design-system.example.com",
        githubUrl: "https://github.com/user/design-system",
        featured: "true",
        createdAt: new Date("2024-03-10")
      }
    ];

    sampleProjects.forEach(project => {
      this.projects.set(project.id, project);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.featured === "true")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      id,
      title: insertProject.title,
      description: insertProject.description,
      longDescription: insertProject.longDescription || null,
      category: insertProject.category,
      technologies: insertProject.technologies,
      imageUrl: insertProject.imageUrl,
      demoUrl: insertProject.demoUrl || null,
      githubUrl: insertProject.githubUrl || null,
      featured: insertProject.featured || "false",
      createdAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) {
      throw new Error(`Project with id ${id} not found`);
    }
    const updated: Project = { ...existing, ...updateData };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      id,
      message: insertMessage.message,
      response: insertMessage.response,
      metadata: insertMessage.metadata || null,
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
