# Database Setup Guide

## Prerequisites

1. Install PostgreSQL locally:
   ```bash
   # macOS
   brew install postgresql@14
   brew services start postgresql@14

   # Linux (Ubuntu/Debian)
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. Create database:
   ```bash
   createdb neetchat
   ```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neetchat
DB_USER=postgres
DB_PASSWORD=postgres
```

## Initialize Database Schema

### Option 1: Using API endpoint
```bash
curl -X POST http://localhost:3000/api/init-db
```

### Option 2: Using npm script
```bash
npm run db:init
```

### Option 3: Manual SQL
Connect to your database and run:
```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contact_wallet TEXT NOT NULL,
  pinned BOOLEAN DEFAULT FALSE,
  blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, contact_wallet)
);

CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cid TEXT NOT NULL,
  uploader TEXT NOT NULL,
  mime TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON profiles(wallet);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_wallet ON contacts(contact_wallet);
CREATE INDEX IF NOT EXISTS idx_files_cid ON files(cid);
```

## Database Schema

### Profiles
Stores user profile information linked to wallet addresses.

### Contacts
Stores user contacts with pinning and blocking functionality.

### Groups
Stores group chat metadata (group chats use XMTP for messages).

### Files
Stores file metadata for files uploaded to IPFS/Filecoin.

## API Endpoints

- `GET /api/profile?wallet=0x...` - Get user profile
- `POST /api/profile` - Create/update profile
- `PATCH /api/profile` - Update profile fields
- `GET /api/contacts?wallet=0x...` - Get user contacts
- `POST /api/contacts` - Add contact
- `GET /api/groups` - Get groups
- `POST /api/groups` - Create group
- `GET /api/files` - Get files
- `POST /api/files` - Upload file metadata
- `POST /api/init-db` - Initialize database schema

