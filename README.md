# Image Upload & Gallery (Angular + Express)

Brief full‑stack example: Angular frontend for uploading, browsing, viewing, editing and deleting images stored in S3 with metadata persisted in MongoDB via an Express (TypeScript) API.

## What It Does

- Upload an image (multipart) -> stored in S3, metadata saved in MongoDB
- List images (pagination, optional tag / mimeType filtering)
- View details (direct S3 URL, size, tags, description)
- Edit title / description / tags
- Delete image (removes S3 object + DB record)

## Tech Stack

- Frontend: Angular 20
- Backend: Express, TypeScript, Mongoose, Multer, AWS SDK (S3)
- Storage: MongoDB, Amazon S3
- Runtime / Delivery: Docker, nginx

## Quick Start

Use docker to run. Run command bellow:

```bash
docker compose up -d
```

Then:

- Web UI: http://localhost:4200
- API: https://fullstack-angular-project.onrender.com

To stop:

```bash
docker compose down
```

## API Documentation

Brief endpoint list: see `API_DOC.md`.

Postman collection: `postman_api_doc.json`.

## Project Structure

```
server/    Express API (TypeScript)
web/       Angular application
docker-compose.yml  Orchestration (web, api, mongodb)
```
