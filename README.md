# TSX Model Generator

A command-line tool that generates TypeScript models from Swagger YAML files using Google's Gemini AI model.

## Features

- Parse Swagger/OpenAPI YAML files
- Generate TypeScript interfaces using Google Gemini AI
- Customizable output directory
- Support for both file-based and environment-based API keys

## Installation

```bash
npm install -g tsx-model-generator
```

## Usage

```bash
tsx-model-generator -f path/to/swagger.yml -o ./models -k YOUR_GEMINI_API_KEY
```

### Options

- `-f, --file <path>`: Path to the Swagger YAML file (required)
- `-o, --output <path>`: Output directory for generated models (default: ./models)
- `-k, --api-key <key>`: Google Gemini API key (optional, can use GEMINI_API_KEY env var)

## Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tsx-model-generator.git
cd tsx-model-generator
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run in development mode:
```bash
npm run dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.