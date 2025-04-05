# TSX Model Generator

A CLI tool that uses Google's Gemini API to generate TypeScript model files (.tsx) from an OpenAPI YAML schema.

------------------------------------------------------------

## Features:

- Reads OpenAPI 3.x YAML files
- Sends schema to Gemini (via API key)
- Outputs one .tsx model file per schema
- Supports nested structures, enums, and cross-file imports
- Optional model selection (e.g. gemini-pro, gemini-2.5-pro-preview-03-25)

------------------------------------------------------------

## Installation:

1. Clone the repo:

   `git clone https://github.com/yourusername/tsx-model-generator.git`
   `cd tsx-model-generator`

2. Install dependencies:

   `npm install`

3. Optionally link it globally:

   `npm link`

    if you decide not to link then just run it with:

    `node index.js --key YOUR_API_KEY --file path/to/openapi.yml [--model gemini-model-id]`

------------------------------------------------------------

## Usage:

`tsx-model-generator --key YOUR_API_KEY --file path/to/openapi.yml [--model gemini-model-id]`

**Required Flags:**
--key or -k     Your Google Gemini API key
--file or -f    Path to your OpenAPI YAML file

**Optional Flags:**
--model         Gemini model ID (default: gemini-2.0-flash) - check for current models [here](https://ai.google.dev/gemini-api/docs/models#model-variations)

**Example:**

`tsx-model-generator --key AIza... --file test-api.yml --model gemini-2.5-pro-preview-03-25`

------------------------------------------------------------

## Output:

Generated .tsx files will be saved in the ./output directory. Example:

output/
├─ User.tsx
├─ Product.tsx
├─ Address.tsx

------------------------------------------------------------

## Gemini Prompt Strategy:

The tool sends a structured prompt to Gemini that instructs it to:
- Return one code block per model
- Begin each code block with a comment: // FileName.tsx
- Wrap each code block in triple backticks labeled tsx
- Return only code (no explanation text)

------------------------------------------------------------

## Generating an API Key:

You can get a Gemini API key from: https://makersuite.google.com/app/apikey

(Do NOT commit your API key to version control)

------------------------------------------------------------

**License:**
MIT
