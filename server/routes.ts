import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertChatMessageSchema, insertPromptSchema } from "@shared/schema";
import { z } from "zod";
import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import Groq from "groq-sdk";
const upload = multer({ storage: multer.memoryStorage() });

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
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Removed as 'isFeatured' attribute is no longer in schema
  // app.get("/api/projects/featured", async (_req, res) => {
  //   try {
  //     const projects = await storage.getFeaturedProjects();
  //     res.json(projects);
  //   } catch (error) {
  //     res.status(500).json({ message: "Failed to fetch featured projects" });
  //   }
  // });

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
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required." });
      }

      const fileId = await storage.uploadFile(req.file);
      const imageUrl = storage.getFileUrl(fileId);

      const validatedData = insertProjectSchema.parse({
        ...req.body,
        technologies: req.body.technologies ? req.body.technologies.split(",") : [], // Ensure technologies is an array
        imageUrl: imageUrl, // Use the URL from Appwrite Storage
      });
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
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
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const { sessionId } = req.query;
      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ message: "sessionId is required" });
      }
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, prompts, sessionId } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }
      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ message: "sessionId is required" });
      }

      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });

      const systemPrompts = (prompts || []).map((p: any) => ({
        role: "system",
        content: p.promptText,
      }));

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          ...systemPrompts,
          { role: "user", content: message },
        ],
        model: "llama-3.1-8b-instant",
      });

      const response = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
      console.log('Groq response:', response);
      console.log('Groq response type:', typeof response);

      // Function to determine animation based on response content
      const getAnimationFromResponse = (text: string) => {
        const lowerText = text.toLowerCase();
        
        // Define a map of keywords to animations, ordered by specificity (longer phrases first)
        const animationMap = new Map<string, string>([
          ["playing golf", "playing golf"],
          ["salsa dance", "salsa dance"],
          ["looking behind", "looking behind"],
          ["nods head", "nods head"],
          ["shakes head", "shakes head"],
          ["cheering", "cheering"],
          ["punching", "punching"],
          ["stretching", "stretching"],
          ["waving", "waving"],
          ["hello", "waving"],
          ["hi", "waving"],
          ["golf", "playing golf"],
          ["cheer", "cheering"],
          ["great", "cheering"],
          ["yes", "nods head"],
          ["affirmative", "nods head"],
          ["no", "shakes head"],
          ["negative", "shakes head"],
          ["dance", "salsa dance"],
          ["punch", "punching"],
          ["stretch", "stretching"],
        ]);

        // Sort keywords by length in descending order to prioritize more specific phrases
        const sortedKeywords = Array.from(animationMap.keys()).sort((a, b) => b.length - a.length);

        for (const keyword of sortedKeywords) {
          if (lowerText.includes(keyword)) {
            return animationMap.get(keyword);
          }
        }

        if (text.length > 0) return "talking"; // Default to talking if there's a response
        return "idle"; // Default to idle if no response
      };

      // Function to determine morph targets for emotion and basic lip-sync
      const getMorphTargetsFromResponse = (text: string) => {
        const lowerText = text.toLowerCase();
        let morphTargets: { [key: string]: number } = {};

        // --- Emotional Expression ---
        if (lowerText.includes("curious") || lowerText.includes("wonder") || lowerText.includes("question")) {
          morphTargets.browInnerUp = 0.4;
          morphTargets.eyeWideLeft = 0.2;
          morphTargets.eyeWideRight = 0.2;
        } else if (lowerText.includes("funny") || lowerText.includes("amused") || lowerText.includes("haha")) {
          morphTargets.mouthSmileLeft = 0.5;
          morphTargets.mouthSmileRight = 0.5;
          morphTargets.cheekSquintLeft = 0.3;
          morphTargets.cheekSquintRight = 0.3;
        }

        // --- Lip Sync (Viseme Generation) ---
        // This is a simplified approach that creates an "average" mouth shape for the text.
        if (text.length > 0) {
          const visemeMap = {
            'a': ['aa'], 'e': ['E'], 'i': ['ih'], 'o': ['oh'], 'u': ['ou'],
            'r': ['RR'],
            'f': ['FF'], 'v': ['FF'],
            't': ['DD'], 'd': ['DD'], 'g': ['kk'],
            'c': ['kk'], 'k': ['kk'], 'q': ['kk'],
            'n': ['nn'], 'm': ['nn'],
            's': ['SS'], 'z': ['SS'],
            'c_h': ['CH'], 's_h': ['CH'], 'j': ['CH'],
            'p': ['PP'], 'b': ['PP'],
            't_h': ['TH']
          };

          let visemeActivation: { [key: string]: number } = {};

          // Initialize activations
          Object.values(visemeMap).flat().forEach(v => visemeActivation[v] = 0);

          // Check for digraphs first
          const processedText = lowerText.replace(/ch/g, 'c_h').replace(/sh/g, 's_h').replace(/th/g, 't_h');

          for (const char of processedText) {
            if (visemeMap[char]) {
              visemeMap[char].forEach(v => visemeActivation[v] += 1);
            }
          }

          // Normalize and add to morph targets
          const totalActivations = Object.values(visemeActivation).reduce((sum, val) => sum + val, 0);
          if (totalActivations > 0) {
            morphTargets['jawOpen'] = 0; // Start with jaw closed
            for (const viseme in visemeActivation) {
              const value = visemeActivation[viseme] / totalActivations;
              morphTargets[viseme] = value * 2; // Amplify the effect
              // Open the jaw for vowel sounds
              if (['aa', 'E', 'ih', 'oh', 'ou'].includes(viseme)) {
                morphTargets['jawOpen'] += value * 0.8;
              }
            }
          } else {
            // Default talking pose if no specific visemes are found
            morphTargets['jawOpen'] = 0.3;
            morphTargets['mouthPucker'] = 0.1;
          }
        }

        // Clamp values between 0 and 1
        for (const key in morphTargets) {
          morphTargets[key] = Math.max(0, Math.min(1, morphTargets[key]));
        }

        return morphTargets;
      };

      const animation = getAnimationFromResponse(response);
      const morphTargets = getMorphTargetsFromResponse(response);

      // Voice RSS Text-to-Speech
      const voiceRSSApiKey = process.env.VOICE_RSS_API_KEY;
      let audioContent = null;

      if (voiceRSSApiKey) {
        console.log("Attempting to generate TTS with VoiceRSS...");
        const ttsUrl = `https://voicerss.org/api/?key=...&hl=en-ca&v=Mason&c=MP3&f=48khz_16bit_stereo&src=${encodeURIComponent(response)}`;
        console.log("Fetching TTS from URL (key omitted):", ttsUrl.replace(/key=[^&]+&/, 'key=...&'));

        try {
          const ttsResponse = await fetch(`https://voicerss.org/api/?key=${voiceRSSApiKey}&hl=en-ca&v=Mason&c=MP3&f=48khz_16bit_stereo&src=${encodeURIComponent(response)}`);

          console.log("VoiceRSS API Response Status:", ttsResponse.status);

          if (ttsResponse.ok) {
            const audioBuffer = await ttsResponse.arrayBuffer();
            audioContent = Buffer.from(audioBuffer).toString('base64');
            console.log("Successfully fetched and encoded TTS audio.");
          } else {
            const errorText = await ttsResponse.text();
            console.error("Voice RSS TTS API Error Response:", errorText);
          }
        } catch (ttsError) {
          console.error("An exception occurred during TTS fetch:", ttsError);
        }
      } else {
        console.warn("VOICE_RSS_API_KEY not set. Skipping TTS.");
      }

      const metadata = { animation, morphTargets };
      const metadataString = JSON.stringify(metadata);
      console.log('Metadata string:', metadataString, 'Length:', metadataString.length);
      if (metadataString.length > 500) {
        return res.status(400).json({ message: "Metadata too long" });
      }

      const chatMessage = await storage.createChatMessage({
        sessionId,
        message,
        response,
        metadata: metadataString,
      });

      res.json({ chatMessage, audioContent });
    } catch (error) {
      console.error("Error processing chat message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Prompt routes
  app.post("/api/prompts", ensureAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPromptSchema.parse(req.body);
      const prompt = await storage.createPrompt(validatedData);
      res.status(201).json(prompt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid prompt data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create prompt" });
    }
  });

  app.get("/api/prompts", async (_req, res) => {
    try {
      const prompts = await storage.getPrompts();
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  app.put("/api/prompts/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPromptSchema.partial().parse(req.body);
      const prompt = await storage.updatePrompt(id, validatedData);
      res.json(prompt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid prompt data", errors: error.errors });
      }
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.status(500).json({ message: "Failed to update prompt" });
    }
  });

  app.delete("/api/prompts/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePrompt(id);
      if (!deleted) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete prompt" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}