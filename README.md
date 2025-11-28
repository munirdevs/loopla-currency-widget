# GBP Currency Exchange Widget

A full-stack TypeScript application that displays real-time exchange rates for GBP to USD, EUR, CHF, AUD, and CAD. Built with Next.js and Express, featuring live conversion, auto-refresh, and smart caching.

## Features

- Live currency converter with reverse conversion (GBP ↔ Other currencies)
- Auto-refresh every 5 minutes
- 2-minute server-side caching to reduce API calls
- Clean, responsive UI with Tailwind CSS
- Full TypeScript coverage
- Docker support
- CI/CD with GitHub Actions

## Tech Stack

**Frontend:** Next.js 14, React, TypeScript, Tailwind CSS  
**Backend:** Node.js, Express, TypeScript, node-cache  
**API:** ExchangeRate-API  
**Testing:** Jest, Vitest  
**DevOps:** Docker, docker-compose, GitHub Actions

## Live Demo

🌐 **Frontend:** https://currency-widget-nine.vercel.app  
🔌 **Backend API:** https://currency-widget-backend.vercel.app

## Quick Start

### Prerequisites

- Node.js 20+
- Free API key from [ExchangeRate-API](https://www.exchangerate-api.com/)

### Local Development

1. **Get your API key** (free, no credit card needed)

2. **Configure backend**
```bash
cd backend
cp .env.example .env
# Edit .env and add: EXCHANGE_API_KEY=your_key_here
```

3. **Configure frontend**
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local and set: NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. **Run the app**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Docker

```bash
# Add API key to .env file
cp .env.example .env

# Run both services
docker-compose up --build
```

Frontend: http://localhost:3000  
Backend: http://localhost:3001

## Deployment

### Vercel (Recommended)

**Backend:**
1. Import repository on [Vercel](https://vercel.com)
2. Set Root Directory: `backend`
3. Add environment variables:
   - `EXCHANGE_API_KEY` = your_api_key
   - `EXCHANGE_API_URL` = https://v6.exchangerate-api.com/v6
4. Deploy

**Frontend:**
1. Import repository again
2. Set Root Directory: `frontend`
3. Framework: Next.js
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your_backend_url (no trailing slash)
5. Deploy

Vercel auto-deploys on every push to main.

## Testing

```bash
cd backend && npm test
cd frontend && npm test
```

## API

**GET** `/api/rates` - Get current exchange rates  
**POST** `/api/rates/refresh` - Clear cache  
**GET** `/health` - Health check

## Project Structure

```
backend/
  src/
    config/        # API configuration
    middleware/    # Caching layer
    routes/        # Express routes
    services/      # External API integration
    utils/         # Helper functions
frontend/
  src/
    app/           # Next.js pages
    components/    # React components
    services/      # API client
    types/         # TypeScript definitions
```

## How It Works

1. **Backend** fetches rates from ExchangeRate-API every 2 minutes
2. **Caching** minimizes API calls (from ~28K/day to ~720/day)
3. **Frontend** auto-refreshes display every 5 minutes
4. **Converter** calculates live conversions between GBP and other currencies

## Configuration

**Cache TTL:** `backend/.env` → `CACHE_TTL=120` (seconds)  
**Auto-refresh:** `frontend/src/components/CurrencyWidget.tsx` → `AUTO_REFRESH_INTERVAL`

## Notes

Built for the Loopla technical assessment. The app demonstrates TypeScript full-stack development with clean architecture, proper caching, and modern React patterns.
