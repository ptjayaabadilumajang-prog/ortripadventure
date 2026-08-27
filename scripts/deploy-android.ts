import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

/**
 * Android Deployment Automation Script for Or.Trip Adventure
 * 
 * This script automates the process of building and deploying the Android app.
 * Prerequisites:
 * 1. EXPO_TOKEN must be set in environment variables.
 * 2. eas.json must be configured.
 * 3. google-services-key.json (optional) for Play Store submission.
 */

async function deploy() {
  const profile = process.argv[2] || "preview"; // development, preview, or production
  const shouldSubmit = process.argv.includes("--submit");

  console.log(`🚀 Starting Android deployment for profile: ${profile}...`);

  try {
    // 1. Check for EXPO_TOKEN
    if (!process.env.EXPO_TOKEN) {
      console.warn("⚠️ EXPO_TOKEN not found. You may need to login manually or set it as a secret.");
    }

    // 2. Build the app
    console.log(`📦 Building Android ${profile} build...`);
    const buildCommand = `npx eas build --platform android --profile ${profile} --non-interactive`;
    execSync(buildCommand, { stdio: "inherit" });

    // 3. Submit to Play Store if requested
    if (shouldSubmit && profile === "production") {
      console.log("📤 Submitting to Google Play Store...");
      if (!fs.existsSync(path.join(process.cwd(), "google-services-key.json"))) {
        console.error("❌ google-services-key.json not found. Submission aborted.");
        return;
      }
      const submitCommand = `npx eas submit --platform android --profile production --non-interactive`;
      execSync(submitCommand, { stdio: "inherit" });
    }

    console.log("✅ Deployment process completed successfully!");
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

deploy();
