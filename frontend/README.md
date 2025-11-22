# Cryptocurrency Dashboard Frontend

This is a [Next.js](https://nextjs.org) frontend for the Crypto Viz project, providing real-time cryptocurrency market data, analytics, and interactive charts.

## Features

- Real-time market data via WebSocket and REST API
- Interactive charts and tables for crypto prices and trends
- Responsive UI with modern design
- Search and filter functionality
- Modular component structure (cards, charts, tables, navigation)
- TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm, yarn, or pnpm
- Docker (optional, see Docker section)

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Docker

This project includes a Dockerfile for containerized builds. Use Docker to run the app in a consistent environment or for deployment.

Prerequisite: Docker installed.

Run Docker (from /):

```bash
docker-compose -f compose.dev.yml up --build -d frontend
```

## Project Structure

- `app/` – Next.js app directory (pages, global styles, data)
- `components/` – UI components (charts, tables, navigation, cards)
- `lib/` – Utility functions and API clients
- `hooks/` – Custom React hooks
- `types/` – TypeScript types and interfaces
- `public/` – Static assets

## Environment Variables

Create a `.env.local` (dev) or set environment variables for Docker:

- NEXT_PUBLIC_API_URL — Backend API base URL
- Any other NEXT_PUBLIC_* variables required by components


docker-compose -f compose.dev.yml up --build -d

```bash
span
```
