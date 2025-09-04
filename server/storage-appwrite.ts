import { databases, users, storageService } from './lib/appwrite';
import { DATABASE_ID } from './lib/appwrite';
import { ID, Query } from 'node-appwrite';
import type { User, InsertUser, Project, InsertProject, ChatMessage, InsertChatMessage, Prompt, InsertPrompt } from '@shared/schema';
import { IStorage } from './storage';

const PROJECTS_COLLECTION_ID = 'projects';
const PROMPTS_COLLECTION_ID = 'prompts';
const CHAT_MESSAGES_COLLECTION_ID = 'chat_messages'; // Assuming you have a collection for chat messages

export class AppwriteStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const appwriteUser = await users.get(id);
      // Map Appwrite user to your User type
      return {
        id: appwriteUser.$id,
        username: appwriteUser.email || appwriteUser.name || '',
        password: '', // Password is not returned by Appwrite get user
      };
    } catch (error: any) {
      if (error.code === 404) {
        return undefined;
      }
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // Appwrite users.list() can filter by email
      const response = await users.list([
        Query.equal('email', username) // Assuming username is stored as email
      ]);
      if (response.users.length > 0) {
        const appwriteUser = response.users[0];
        return {
          id: appwriteUser.$id,
          username: appwriteUser.email || appwriteUser.name || '',
          password: '', // Password is not returned
        };
      }
      return undefined;
    } catch (error: any) {
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const appwriteUser = await users.create(
        ID.unique(),
        insertUser.username, // Assuming username is used as email
        insertUser.password,
        insertUser.username // Assuming username is also used as name
      );
      return {
        id: appwriteUser.$id,
        username: appwriteUser.email || appwriteUser.name || '',
        password: '', // Password is not stored/returned
      };
    } catch (error: any) {
      throw error;
    }
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    const response = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID, [
      Query.orderDesc('createdAt') // Sort by createdAt to match MemStorage
    ]);
    return response.documents as unknown as Project[];
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    const response = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID, [
      Query.equal('category', category),
      Query.orderDesc('createdAt') // Sort by createdAt
    ]);
    return response.documents as unknown as Project[];
  }

  async getFeaturedProjects(): Promise<Project[]> {
    // This method is no longer needed as 'isFeatured' attribute was removed.
    // You can implement a different logic for featured projects if needed, e.g., using a tag.
    return [];
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      const response = await databases.getDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, id);
      return response as unknown as Project;
    } catch (error: any) {
      if (error.code === 404) {
        return undefined;
      }
      throw error;
    }
  }

  async createProject(project: InsertProject): Promise<Project> {
    const response = await databases.createDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      ID.unique(),
      project
    );
    return response as unknown as Project;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const response = await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      id,
      project
    );
    return response as unknown as Project;
  }

  async deleteProject(id: string): Promise<boolean> {
    await databases.deleteDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, id);
    return true;
  }

  // Chat methods
  async getChatMessages(): Promise<ChatMessage[]> {
    const response = await databases.listDocuments(DATABASE_ID, CHAT_MESSAGES_COLLECTION_ID, [
        Query.orderAsc('createdAt') // Sort by createdAt to match MemStorage
    ]);
    return response.documents as unknown as ChatMessage[];
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const response = await databases.createDocument(
      DATABASE_ID,
      CHAT_MESSAGES_COLLECTION_ID,
      ID.unique(),
      message
    );
    return response as unknown as ChatMessage;
  }

  // Prompt methods
  async createPrompt(prompt: InsertPrompt): Promise<Prompt> {
    const response = await databases.createDocument(
      DATABASE_ID,
      PROMPTS_COLLECTION_ID,
      ID.unique(),
      prompt
    );
    return response as unknown as Prompt;
  }

  async getPrompts(): Promise<Prompt[]> {
    const response = await databases.listDocuments(DATABASE_ID, PROMPTS_COLLECTION_ID, [
        Query.orderAsc('$createdAt') // Sort by creation date
    ]);
    return response.documents as unknown as Prompt[];
  }

  async updatePrompt(id: string, prompt: Partial<InsertPrompt>): Promise<Prompt> {
    const response = await databases.updateDocument(
      DATABASE_ID,
      PROMPTS_COLLECTION_ID,
      id,
      prompt
    );
    return response as unknown as Prompt;
  }

  async deletePrompt(id: string): Promise<boolean> {
    await databases.deleteDocument(DATABASE_ID, PROMPTS_COLLECTION_ID, id);
    return true;
  }

  // File methods
  async uploadFile(file: File): Promise<string> {
    // IMPORTANT: Replace 'default' with your actual Appwrite Storage Bucket ID
    const response = await storageService.createFile(
      'default', 
      ID.unique(),
      file
    );
    return response.$id; // Return file ID
  }

  getFileUrl(fileId: string): string {
    // IMPORTANT: Replace 'default' with your actual Appwrite Storage Bucket ID
    const url = storageService.getFileDownload('default', fileId);
    return url;
  }
}
