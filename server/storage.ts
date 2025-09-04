import { type User, type InsertUser, type Project, type InsertProject, type ChatMessage, type InsertChatMessage, type Prompt, type InsertPrompt } from "@shared/schema";
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

  // Prompt methods
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  getPrompts(): Promise<Prompt[]>;
  updatePrompt(id: string, prompt: Partial<InsertPrompt>): Promise<Prompt>;
  deletePrompt(id: string): Promise<boolean>;

  // File methods
  uploadFile(file: File): Promise<string>;
  getFileUrl(fileId: string): string;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private chatMessages: Map<string, ChatMessage>;
  private prompts: Map<string, Prompt>; // Added for MemStorage

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.chatMessages = new Map();
    this.prompts = new Map(); // Initialize prompts map
    // No seed data in production - everything should be added via API
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

  // Prompt methods for MemStorage
  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = randomUUID();
    const prompt: Prompt = {
      $id: id,
      promptText: insertPrompt.promptText,
      promptType: insertPrompt.promptType,
      isActive: insertPrompt.isActive,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async getPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values()).sort((a, b) => 
      new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
    );
  }

  async updatePrompt(id: string, updateData: Partial<InsertPrompt>): Promise<Prompt> {
    const existing = this.prompts.get(id);
    if (!existing) {
      throw new Error(`Prompt with id ${id} not found`);
    }
    const updated: Prompt = { ...existing, ...updateData, $updatedAt: new Date().toISOString() };
    this.prompts.set(id, updated);
    return updated;
  }

  async deletePrompt(id: string): Promise<boolean> {
    return this.prompts.delete(id);
  }

  // File methods
  async uploadFile(file: File): Promise<string> {
    // In-memory storage doesn't actually store files, just return a dummy URL
    console.warn("uploadFile not implemented for MemStorage. Returning dummy URL.");
    return `http://localhost:5000/uploads/${file.name}`;
  }

  getFileUrl(fileId: string): string {
    // In-memory storage doesn't actually store files, just return a dummy URL
    console.warn("getFileUrl not implemented for MemStorage. Returning dummy URL.");
    return `http://localhost:5000/uploads/${fileId}`;
  }
}

import { AppwriteStorage } from './storage-appwrite';

export const storage = new AppwriteStorage();
