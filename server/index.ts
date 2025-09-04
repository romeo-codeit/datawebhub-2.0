import { config } from 'dotenv';
import { resolve } from 'path';
// Load environment variables from .env file in the project root
// When npm run dev is executed from the root, process.cwd() is the root.
// So, './.env' correctly points to the .env file in the root.
config({ path: resolve(process.cwd(), './.env') });

import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import os from "node:os";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { users } from "./lib/appwrite"; // Import Appwrite users service

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "a-secret-key-for-sessions-that-is-long-and-secure",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: app.get("env") === "production" },
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      // Use Appwrite to create a session, which also verifies the password
      const session = await users.createSession(username, password);
      const user = await storage.getUser(session.userId); // Get user details from storage

      if (!user) {
        // This case should ideally not happen if session creation was successful
        return done(null, false, { message: "User not found after successful session creation." });
      }
      return done(null, user);
    } catch (err: any) {
      if (err.code === 401) { // Appwrite returns 401 for invalid credentials
        return done(null, false, { message: "Incorrect username or password." });
      }
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id); // Corrected to getUser
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    // The reusePort option is not supported on Windows
    reusePort: os.platform() !== "win32",
  }, () => {
    log(`serving on port ${port}`);
  });
})();