# GitHub User Search API

A Node.js and TypeScript backend service that helps discover GitHub users based on criteria like username, location, and language.

## Features

- Search for GitHub users using the GitHub Search API.
- Filter by username, location, and language.
- Pagination support.
- Built with TypeScript for type safety.
- Exposes a RESTful POST endpoint for flexible search queries.

## Prerequisites

- Node.js
- npm

## Setup

1. Clone the repository (if not already done).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your GitHub Token (optional but recommended for higher rate limits):
   ```
   PORT=3000
   GITHUB_TOKEN=your_github_token
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build & Run
First, compile the TypeScript code:
```bash
npm run build
```
Then run the compiled code:
```bash
npm run prod
```

## API Endpoints

### Health Check
**GET** `/`
Returns a simple message indicating the API is running.

### Search Users
**POST** `/search`

Allows searching for users with various criteria provided in the JSON body.

**Request Body Parameters:**
- `query`: The search string. You can include qualifiers like `user:`, `location:`, `language:` directly in this string (string, required).
- `limit`: Results per page (number, default: 10).

> **Note**: The `query` parameter is required.

**Example Request:**
```bash
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "tom language:javascript",
    "limit": 5
  }'
```

**Example Response:**
```json
{
  "success": true,
  "total_count": 1234,
  "items": [
    {
      "login": "tom",
      "id": 748,
      ...
    }
  ]
}
```

## Project Structure
- `src/index.ts`: Main entry point.
- `src/routes`: API route definitions.
- `src/controllers`: Request handlers.
- `src/services`: Business logic and external API interactions.
