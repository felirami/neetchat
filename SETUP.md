# NeetChat Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up PostgreSQL Database

#### Option A: Install PostgreSQL Locally (macOS)
```bash
brew install postgresql@14
brew services start postgresql@14
createdb neetchat
```

#### Option B: Install PostgreSQL Locally (Linux)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb neetchat
```

#### Option C: Use Docker (Recommended for Development)
```bash
# Run PostgreSQL in Docker
docker run --name neetchat-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=neetchat \
  -p 5432:5432 \
  -d postgres:14

# To stop: docker stop neetchat-postgres
# To start: docker start neetchat-postgres
```

### 3. Configure Environment Variables

Create `.env.local` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neetchat
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. Initialize Database Schema

After PostgreSQL is running, initialize the schema:

```bash
# Option 1: Using API endpoint (start dev server first)
npm run dev
# Then in another terminal:
curl -X POST http://localhost:3000/api/init-db

# Option 2: Using npm script
npm run db:init
```

### 5. Start Development Server
```bash
npm run dev
```

## Verification

1. Check if database is accessible:
   ```bash
   psql -h localhost -U postgres -d neetchat -c "\dt"
   ```

2. Test API endpoints:
   ```bash
   # Create a profile
   curl -X POST http://localhost:3000/api/profile \
     -H "Content-Type: application/json" \
     -d '{"wallet":"0x123...","username":"testuser"}'
   
   # Get profile
   curl http://localhost:3000/api/profile?wallet=0x123...
   ```

## Troubleshooting

### PostgreSQL Connection Issues
- Ensure PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Check if port 5432 is available: `lsof -i :5432`
- Verify credentials in `.env.local`

### Database Already Exists
If you get "database already exists" error, you can drop and recreate:
```bash
dropdb neetchat
createdb neetchat
npm run db:init
```

