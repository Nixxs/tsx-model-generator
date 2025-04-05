#!/usr/bin/env node

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

// --- Parse command-line arguments ---
const args = process.argv.slice(2);
let apiKey = null;
let filePath = null;
let model = "gemini-2.0-flash";

for (let i = 0; i < args.length; i++) {
  if ((args[i] === "--key" || args[i] === "-k") && args[i + 1]) {
    apiKey = args[i + 1];
  }
  if ((args[i] === "--file" || args[i] === "-f") && args[i + 1]) {
    filePath = args[i + 1];
  }
  if ((args[i] === "--model" || args[i] === "-m") && args[i + 1]) {
    model = args[i + 1];
  }
}

if (!apiKey || !filePath) {
  console.error("ERROR: Usage: tsx-model-generator --key YOUR_API_KEY --file path/to/openapi.yml");
  process.exit(1);
}

// --- Load and parse the YAML file ---
let openApi;
try {
  const file = fs.readFileSync(path.resolve(filePath), "utf8");
  openApi = yaml.load(file);
} catch (err) {
  console.error("ERROR: Failed to load or parse YAML:", err.message);
  process.exit(1);
}

// --- Build the prompt for Gemini ---
const schemas = openApi.components?.schemas;
if (!schemas) {
  console.error("ERROR: No schemas found in the OpenAPI file.");
  process.exit(1);
}

const schemaJson = JSON.stringify(schemas, null, 2);
const prompt = `
You are a TypeScript expert helping generate frontend model files based on OpenAPI schema definitions (JSON format).

Please follow these exact instructions:
1. For each schema definition, return one code block per file.
2. The first line of each block **must** be a comment in the format: \`// <ModelName>.tsx\` (e.g., \`// User.tsx\`)
3. The code block must be wrapped in triple backticks with \`tsx\` as the language tag: \`\`\`tsx ... \`\`\`
4. Use TypeScript interfaces or types (no classes) and match field names and types exactly.
5. Nested objects should be typed inline or using separate interfaces as appropriate.
6. Include imports between models if needed (e.g. \`import { Address } from './Address'\`)
7. Do not add any extra explanation, only the code blocks.

Here is the OpenAPI schema to base the models on:
${schemaJson}
`;


// --- Initialize Gemini ---
const ai = new GoogleGenAI({ apiKey });

async function main() {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
  
    const text = response.text;
    console.log("\nGemini response received.");
  
    // Extract ```tsx code blocks
    const tsxBlocks = Array.from(text.matchAll(/```tsx\s*([\s\S]*?)```/g), m => m[1].trim());
  
    if (tsxBlocks.length === 0) {
      console.error("ERROR: No TSX code blocks found in response.");
      console.log(`${model} Response: \n\n${text}`);
      return;
    }
  
    const outputDir = path.resolve("output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
  
    tsxBlocks.forEach((code, i) => {
        const lines = code.split("\n");
      
        let filename = `Model${i + 1}.tsx`;
        const firstLine = lines[0].trim();
        const match = firstLine.match(/^\/\/\s*(.+\.ts[x]?)$/i);
      
        if (match) {
          filename = match[1].replace(/\.ts$/, ".tsx");
          lines.shift(); // remove the filename comment
        }
      
        const cleanedCode = lines.join("\n").trim();
        const filePath = path.join(outputDir, filename);
      
        fs.writeFileSync(filePath, cleanedCode);
        console.log(`Wrote: ${filePath}`);
    });            
  
    console.log("\nAll models saved to ./output/");
  }

await main();
