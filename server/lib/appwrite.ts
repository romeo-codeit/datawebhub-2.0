import { Client, Databases, Users, Storage } from 'node-appwrite';

// Make sure to set these environment variables in your .env file
const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  throw new Error('Appwrite server environment variables are required.');
}

const client = new Client();
client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

export const databases = new Databases(client);
export const users = new Users(client);
export const storageService = new Storage(client); // Renamed to avoid conflict with local storage variable

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

if (!DATABASE_ID) {
    throw new Error('Appwrite database ID is required.');
}