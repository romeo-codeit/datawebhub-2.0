import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '../.env') });

import { Client, Databases, ID, Permission, Role, Query } from 'node-appwrite';

async function setupAppwrite() {
  try {
    const client = new Client();
    const databases = new Databases(client);

    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databaseId = process.env.APPWRITE_DATABASE_ID;

    if (!databaseId) {
      throw new Error('APPWRITE_DATABASE_ID is not set in your .env file.');
    }

    console.log(`Using Database ID: ${databaseId}`);

    // --- Create Projects Collection ---
    const projectsCollectionId = 'projects';
    try {
      console.log('Creating Projects collection...');
      await databases.createCollection(databaseId, projectsCollectionId, 'Projects', [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
      ]);
      console.log('Projects collection created.');

      console.log('Creating attributes for Projects collection...');
      await databases.createStringAttribute(databaseId, projectsCollectionId, 'title', 255, true);
      await databases.createStringAttribute(databaseId, projectsCollectionId, 'description', 10000, true); // Merged description
      await databases.createStringAttribute(databaseId, projectsCollectionId, 'category', 255, true);
      await databases.createStringAttribute(databaseId, projectsCollectionId, 'technologies', 255, true, undefined, true); // Array of strings
      await databases.createUrlAttribute(databaseId, projectsCollectionId, 'imageUrl', true); // Assuming imageUrl is required
      await databases.createUrlAttribute(databaseId, projectsCollectionId, 'demoUrl', false);
      await databases.createDatetimeAttribute(databaseId, projectsCollectionId, 'createdAt', true); // createdAt attribute
      console.log('Attributes for Projects collection created.');
    } catch (e) {
      if (e.code === 409) {
        console.log('Projects collection already exists.');
      } else {
        throw e;
      }
    }

    // --- Create Prompts Collection ---
    const promptsCollectionId = 'prompts';
    try {
      console.log('Creating Prompts collection...');
      await databases.createCollection(databaseId, promptsCollectionId, 'Prompts', [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
      ]);
      console.log('Prompts collection created.');

      console.log('Creating attributes for Prompts collection...');
      await databases.createStringAttribute(databaseId, promptsCollectionId, 'promptText', 10000, true);
      await databases.createStringAttribute(databaseId, promptsCollectionId, 'promptType', 255, true);
      await databases.createBooleanAttribute(databaseId, promptsCollectionId, 'isActive', true); // Removed default value
      console.log('Attributes for Prompts collection created.');
    } catch (e) {
      if (e.code === 409) {
        console.log('Prompts collection already exists.');
      } else {
        throw e;
      }
    }

    // --- Seed Data ---
    console.log('Seeding data...');

    const exampleProjects = [
      {
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce solution with real-time features, user authentication, and payment processing.',
        category: 'web',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
        imageUrl: 'https://via.placeholder.com/400x300/FF5733/FFFFFF?text=E-commerce',
        demoUrl: 'https://demo.ecommerce.com',
        createdAt: new Date().toISOString(),
      },
      {
        title: 'Mobile Task Manager',
        description: 'A cross-platform mobile application for managing tasks and to-do lists with push notifications.',
        category: 'mobile',
        technologies: ['React Native', 'Firebase', 'Redux'],
        imageUrl: 'https://via.placeholder.com/400x300/33FF57/FFFFFF?text=Task+Manager',
        demoUrl: 'https://demo.taskmanager.com',
        createdAt: new Date().toISOString(),
      },
      {
        title: 'Design System Library',
        description: 'A comprehensive design system and component library built for consistency and reusability across multiple products.',
        category: 'design',
        technologies: ['Storybook', 'Styled Components', 'TypeScript', 'Figma'],
        imageUrl: 'https://via.placeholder.com/400x300/3357FF/FFFFFF?text=Design+System',
        demoUrl: 'https://demo.designsystem.com',
        createdAt: new Date().toISOString(),
      },
    ];

    for (const projectData of exampleProjects) {
      try {
        const existingProjects = await databases.listDocuments(databaseId, projectsCollectionId, [
          Query.equal('title', projectData.title)
        ]);
        if (existingProjects.documents.length === 0) {
          await databases.createDocument(databaseId, projectsCollectionId, ID.unique(), projectData);
          console.log(`Seeded project: ${projectData.title}`);
        } else {
          console.log(`Project already exists: ${projectData.title}`);
        }
      } catch (e) {
        console.error(`Error seeding project ${projectData.title}:`, e);
      }
    }

    const examplePrompts = [
      {
        promptText: `You are Romeo's AI assistant. Your purpose is to provide information about Romeo's professional background, skills, and projects. Be helpful, concise, and professional. Do not answer questions outside of Romeo's professional profile.`,
        promptType: 'system_persona',
        isActive: true,
      },
      {
        promptText: `Romeo specializes in React, Next.js, Node.js, TypeScript, and modern web development. He also has strong UI/UX design skills and experience with cloud technologies including AWS and Docker. He's passionate about creating scalable, performant applications with great user experiences.`,
        promptType: 'skills',
        isActive: true,
      },
      {
        promptText: `Romeo has worked on various exciting projects including e-commerce platforms, mobile applications, and comprehensive design systems. His recent work includes a full-stack e-commerce solution with real-time features, a cross-platform task management app, and a scalable design system used across multiple products.`,
        promptType: 'projects_overview',
        isActive: true,
      },
      {
        promptText: `You can reach Romeo at hello@romeo.dev or through his LinkedIn profile. He's always interested in discussing new opportunities and exciting projects. Feel free to download his resume or schedule a call to discuss your project needs!`,
        promptType: 'contact_info',
        isActive: true,
      },
      {
        promptText: `Romeo is a Senior Full-Stack Developer with 5+ years of experience. He currently works at TechCorp Solutions leading development of enterprise applications. Previously, he worked at a creative agency developing solutions for Fortune 500 clients. He has a strong background in both technical development and user experience design.`,
        promptType: 'experience_background',
        isActive: true,
      },
    ];

    for (const promptData of examplePrompts) {
      try {
        const existingPrompts = await databases.listDocuments(databaseId, promptsCollectionId, [
          Query.equal('promptType', promptData.promptType)
        ]);
        if (existingPrompts.documents.length === 0) {
          await databases.createDocument(databaseId, promptsCollectionId, ID.unique(), promptData);
          console.log(`Seeded prompt: ${promptData.promptType}`);
        } else {
          console.log(`Prompt already exists: ${promptData.promptType}`);
        }
      } catch (e) {
        console.error(`Error seeding prompt ${promptData.promptType}:`, e);
      }
    }

    console.log('Appwrite setup completed successfully!');

  } catch (error) {
    console.error('Error setting up Appwrite:', error);
  }
}

setupAppwrite();
