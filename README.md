# Bookmark Manager

Full-stack Bookmark Manager with a Node/Express REST API and a React client.

## Setup

1. Install dependencies

```bash
npm install
npm run install:all
```

2. Start backend and frontend together

```bash
npm run dev
```

Backend runs on `http://localhost:3000`, frontend on `http://localhost:5173`.

### Environment

Client can point to a custom API URL:

```bash
VITE_API_URL=http://localhost:3000
```

## API Documentation

Base URL: `http://localhost:3000`

### GET /bookmarks

Returns all bookmarks. Optional query: `?tag=value` to filter by tag.

### POST /bookmarks

Create a new bookmark.

```json
{
	"url": "https://example.com",
	"title": "Example",
	"description": "Optional description",
	"tags": ["example", "docs"]
}
```

Responses:
- `201` on success
- `400` on validation error

### PUT /bookmarks/:id

Update an existing bookmark by ID.

Responses:
- `200` on success
- `404` if not found
- `400` on validation error

### DELETE /bookmarks/:id

Delete a bookmark by ID.

Responses:
- `200` on success
- `404` if not found

## Data Model

- `id`: string (auto-generated)
- `url`: string (required, valid URL)
- `title`: string (required, max 200 chars)
- `description`: string (optional, max 500 chars)
- `tags`: string[] (optional, lowercase only, max 5)
- `createdAt`: ISO 8601 datetime

## Design Decisions

- JSON file storage under [server/data/bookmarks.json](server/data/bookmarks.json) with in-memory cache.
- Express Validator middleware for centralized validation.
- React client uses Fetch API and local UI state for filtering/search.

## Assumptions

- `PUT` expects full bookmark payload (url, title, description, tags).
- Tags are stored in lowercase and trimmed.
- Search is client-side and case-insensitive.

