import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  const adminUser = await storage.getUserByUsername("admin");

  if (!adminUser) {
    await storage.createUser({
      username: "admin",
      password: "password",
    });
    console.log("Created admin user with username 'admin' and password 'password'");
  } else {
    console.log("Admin user already exists.");
  }

  console.log("Seeding complete.");
}

seed().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});
