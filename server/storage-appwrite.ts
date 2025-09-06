import { databases, users, storageService } from './lib/appwrite';
import { DATABASE_ID } from './lib/appwrite';
import { ID, Query } from 'node-appwrite';
import type { User, InsertUser, Project, InsertProject, ChatMessage, InsertChatMessage, Prompt, InsertPrompt } from '@shared/schema';
import { IStorage } from './storage';
import { Models } from 'node-appwrite';

const PROJECTS_COLLECTION_ID = 'projects';
const PROMPTS_COLLECTION_ID = 'prompts';
const CHAT_MESSAGES_COLLECTION_ID = 'chat_messages';

// Helper function to map Appwrite document to Project type
function mapDocumentToProject(doc: Models.Document): Project {
  return {
    $id: doc.$id,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    technologies: doc.technologies,
    imageUrl: doc.imageUrl,
    demoUrl: doc.demoUrl,
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
  };
}

// Helper function to map Appwrite document to ChatMessage type
function mapDocumentToChatMessage(doc: Models.Document): ChatMessage {
  let metadata;
  try {
    metadata = JSON.parse(doc.metadata);
  } catch (error) {
    console.error('Error parsing metadata:', error);
    metadata = { animation: "talk", emotion: "neutral" }; // Fallback
  }
  return {
    $id: doc.$id,
    sessionId: doc.sessionId,
    message: doc.message,
    response: doc.response,
    metadata,
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
  };
}

// Helper function to map Appwrite document to Prompt type
function mapDocumentToPrompt(doc: Models.Document): Prompt {
  return {
    $id: doc.$id,
    promptText: doc.promptText,
    promptType: doc.promptType,
    isActive: doc.isActive,
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
  };
}

export class AppwriteStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const appwriteUser = await users.get(id);
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
      const response = await users.list([
        Query.equal('email', username)
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
        insertUser.username,
        insertUser.password,
        insertUser.username
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
      Query.orderDesc('$createdAt')
    ]);
    return response.documents.map(mapDocumentToProject);
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    const response = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID, [
      Query.equal('category', category),
      Query.orderDesc('$createdAt')
    ]);
    return response.documents.map(mapDocumentToProject);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return [];
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      const response = await databases.getDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, id);
      return mapDocumentToProject(response);
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
    return mapDocumentToProject(response);
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const response = await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      id,
      project
    );
    return mapDocumentToProject(response);
  }

  async deleteProject(id: string): Promise<boolean> {
    await databases.deleteDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, id);
    return true;
  }

  // Chat methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    const response = await databases.listDocuments(DATABASE_ID, CHAT_MESSAGES_COLLECTION_ID, [
        Query.equal('sessionId', sessionId),
        Query.orderAsc('$createdAt')
    ]);
    return response.documents.map(mapDocumentToChatMessage);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    console.log('createChatMessage input:', JSON.stringify(message, null, 2));
    console.log('DATABASE_ID:', DATABASE_ID);
    console.log('CHAT_MESSAGES_COLLECTION_ID:', CHAT_MESSAGES_COLLECTION_ID);
    const response = await databases.createDocument(
      DATABASE_ID,
      CHAT_MESSAGES_COLLECTION_ID,
      ID.unique(),
      message
    );
    return mapDocumentToChatMessage(response);
  }

  // Prompt methods
  async createPrompt(prompt: InsertPrompt): Promise<Prompt> {
    const response = await databases.createDocument(
      DATABASE_ID,
      PROMPTS_COLLECTION_ID,
      ID.unique(),
      prompt
    );
    return mapDocumentToPrompt(response);
  }

  async getPrompts(): Promise<Prompt[]> {
    const response = await databases.listDocuments(DATABASE_ID, PROMPTS_COLLECTION_ID, [
        Query.orderAsc('$createdAt')
    ]);
    return response.documents.map(mapDocumentToPrompt);
  }

  async updatePrompt(id: string, prompt: Partial<InsertPrompt>): Promise<Prompt> {
    const response = await databases.updateDocument(
      DATABASE_ID,
      PROMPTS_COLLECTION_ID,
      id,
      prompt
    );
    return mapDocumentToPrompt(response);
  }

  async deletePrompt(id: string): Promise<boolean> {
    await databases.deleteDocument(DATABASE_ID, PROMPTS_COLLECTION_ID, id);
    return true;
  }

  // File methods
  async uploadFile(file: File): Promise<string> {
    const response = await storageService.createFile(
      'default', 
      ID.unique(),
      file
    );
    return response.$id;
  }

  getFileUrl(fileId: string): string {
    const url = storageService.getFileDownload('default', fileId);
    return url.toString();
  }
}