# GitHub User Search API

A Node.js and TypeScript backend service that helps discover GitHub users based on criteria like username, location, and language.

## Features

- Search for GitHub users using the GitHub Search API.
- Filter by username, location, and language.
- Pagination support.
- Built with TypeScript for type safety.
- Exposes a RESTful POST endpoint for flexible search queries.
- **Secure Authentication**: Endpoints are protected using JWT (JSON Web Tokens).

## Prerequisites

- Node.js
- npm

## Setup

1. Clone the repository (if not already done).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=3000
   GITHUB_TOKEN=your_github_token
   SECRET=your_jwt_secret_key
   ```
   > **Important**: `SECRET` is required for signing and verifying JWT tokens.

## Authentication

The `/search` endpoint is protected and requires a valid JWT token.

### Generating a Token
Since there is no public login endpoint, you can generate a token for testing using a simple Node.js script.

1. Ensure you have the `SECRET` set in your `.env` file.
2. Run the following command in your terminal (replacing `your_jwt_secret_key` with your actual secret if testing manually, or rely on the script reading `.env`):

```bash
node -e "const jwt = require('jsonwebtoken'); const secret = 'your_jwt_secret_key'; console.log(jwt.sign({ user: 'test_user' }, secret));"
```

### Using the Token
Include the token in the `Authorization` header of your requests:

```
Authorization: <your_token_here>
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

**Authentication Required**: Yes (Header: `Authorization: <token>`)

Allows searching for users with various criteria provided in the JSON body.

**Request Body Parameters:**
- `query`: The search string. You can include qualifiers like `user:`, `location:`, `language:` directly in this string (string, required).
- `limit`: Results per page (number, default: 10).

> **Note**: The `query` parameter is required.

**Example Request:**
```bash
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN" \
  -d '{
    "query": "tom language:javascript",
    "limit": 5
  }'
```

**Example Response:**
```json
{
  "status": "success",
  "message": "Search processed successfully",
  "meta": { ... },
  "data": {
    "total_count": 1234,
    "items": [ ... ]
  }
}
```

## Project Structure
- `src/index.ts`: Main entry point.
- `src/routes`: API route definitions.
- `src/controllers`: Request handlers.
- `src/services`: Business logic, storage, and external API interactions.
  - `authService.ts`: JWT authentication middleware.
  - `responseService.ts`: Standardized response formatting.
  - `githubService.ts`: GitHub API integration.
- `src/shared`: Shared utilities and types.
   - `customErrors.ts`: Error class definitions.
   - `customInterfaces.ts`: Interface definitions.
