'use strict';

// Requires: npm install dotenv
// Create a `.env` file in the project root (or same directory as this script):
/*
# Sample .env file
NODE_ENV=development
API_KEY=your_secret_api_key_123
DB_HOST=localhost
DB_PORT=5432
DB_USER=myappuser
DB_PASS=Sup3rS3cr3tP@ssw0rd
FEATURE_FLAG_BETA=true
# Lines starting with # are comments
EMPTY_VAR=
*/

// You can also create environment-specific files like .env.production, .env.development
/*
# Sample .env.production file
NODE_ENV=production
API_KEY=prod_api_key_xyz789
DB_HOST=prod.db.server.com
DB_USER=prod_user
DB_PASS=An0th3rProdP@ssw0rd
FEATURE_FLAG_BETA=false
*/

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

/**
 * Loads environment variables using dotenv.
 * Supports loading a base `.env` file and environment-specific files
 * (e.g., `.env.development`, `.env.production`) which override the base file.
 * Also demonstrates accessing and providing defaults for environment variables.
 *
 * @returns {object} An object containing some key configuration values loaded from process.env.
 */
function loadAndAccessConfig() {
    console.log("--- Loading Environment Variables ---");

    // --- Determine Environment ---
    // `NODE_ENV` is the conventional variable for this.
    const nodeEnv = process.env.NODE_ENV || 'development';
    console.log(`Current NODE_ENV: ${nodeEnv}`);

    // --- Load Base .env File ---
    // dotenv looks for `.env` in the current working directory by default.
    // You can specify a path if needed.
    const baseEnvPath = path.resolve(process.cwd(), '.env'); // Look in CWD
    if (fs.existsSync(baseEnvPath)) {
         const baseResult = dotenv.config({ path: baseEnvPath });
         if (baseResult.error) {
             console.warn(`Warning: Error loading base .env file (${baseEnvPath}):`, baseResult.error.message);
         } else {
             console.log(`Base .env file loaded successfully from ${baseEnvPath}.`);
             // console.log("Base Parsed:", baseResult.parsed); // Careful logging secrets!
         }
    } else {
         console.log(`Base .env file not found at ${baseEnvPath}. Skipping.`);
    }


    // --- Load Environment-Specific .env File ---
    // Example: .env.development or .env.production
    // Load this *after* the base .env file.
    // `override: true` ensures these values take precedence over the base .env file.
    const envSpecificPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);
     if (fs.existsSync(envSpecificPath)) {
        const specificResult = dotenv.config({ path: envSpecificPath, override: true });
        if (specificResult.error) {
            console.warn(`Warning: Error loading environment-specific .env file (${envSpecificPath}):`, specificResult.error.message);
        } else {
            console.log(`Environment-specific .env file (${envSpecificPath}) loaded successfully and override enabled.`);
            // console.log(`Specific (${nodeEnv}) Parsed:`, specificResult.parsed); // Careful logging secrets!
        }
     } else {
         console.log(`Environment-specific .env file (${envSpecificPath}) not found. Skipping.`);
     }


    // --- Accessing Configuration Values ---
    // Always access variables via `process.env`.
    // Provide defaults using `||` or `??` (nullish coalescing) where appropriate.
    console.log("\n--- Accessing Configuration ---");

    const config = {
        nodeEnv: nodeEnv, // Use the determined environment

        // Database Config (provide defaults)
        dbHost: process.env.DB_HOST || 'localhost',
        dbPort: parseInt(process.env.DB_PORT || '5432', 10), // Remember to parse numbers
        dbUser: process.env.DB_USER || 'default_user',
        dbPassword: process.env.DB_PASS, // Often accessed directly where needed, avoid storing in config object

        // API Keys / Secrets (handle missing values)
        apiKey: process.env.API_KEY,

        // Feature Flags (handle boolean conversion)
        // Note: Env vars are strings. Check against 'true'.
        isBetaFeatureEnabled: process.env.FEATURE_FLAG_BETA === 'true',

        // Example of a variable that might be empty
         emptyVar: process.env.EMPTY_VAR ?? 'Default if null/undefined',
         emptyVarOr: process.env.EMPTY_VAR || 'Default if falsy',
    };


    // --- Log Loaded Configuration (Mask Secrets!) ---
    console.log("Loaded Configuration Values:");
    console.log(`  NODE_ENV: ${config.nodeEnv}`);
    console.log(`  DB Host: ${config.dbHost}`);
    console.log(`  DB Port: ${config.dbPort}`);
    console.log(`  DB User: ${config.dbUser}`);
    console.log(`  DB Password: ${config.dbPassword ? 'Loaded (******)' : 'Not Set / Missing!'}`);
    console.log(`  API Key: ${config.apiKey ? 'Loaded (******)' : 'Not Set / Missing!'}`);
    console.log(`  Beta Feature Enabled: ${config.isBetaFeatureEnabled}`);
    console.log(`  Empty Var (??): "${config.emptyVar}"`);
     console.log(`  Empty Var (||): "${config.emptyVarOr}"`);


    // --- Validation (Optional but Recommended) ---
    const requiredVars = ['DB_USER', 'DB_PASS', 'API_KEY'];
    const missingVars = requiredVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
        console.error("\nFATAL ERROR: Required environment variables are missing!");
        console.error(`  Missing: ${missingVars.join(', ')}`);
        console.error("  Please ensure they are set in your .env file or system environment.");
        // In a real app, you might throw an error or exit here
        // throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
         // process.exit(1);
    } else {
         console.log("\nAll required environment variables seem to be loaded.");
    }


    return config;
}

// --- Example Usage ---
// This function should typically be called early in your application's startup process.
if (require.main === module) {
    const appConfig = loadAndAccessConfig();

    console.log("\n--- Using Loaded Config ---");
    console.log(`Connecting to database ${appConfig.dbUser}@${appConfig.dbHost}:${appConfig.dbPort}...`);
    // Example: connectToDatabase(appConfig.dbHost, appConfig.dbPort, appConfig.dbUser, process.env.DB_PASS);

    if (appConfig.isBetaFeatureEnabled) {
        console.log("Beta feature is ENABLED based on environment config.");
        // Initialize beta feature...
    } else {
         console.log("Beta feature is DISABLED based on environment config.");
    }
}

module.exports = { loadAndAccessConfig }; 