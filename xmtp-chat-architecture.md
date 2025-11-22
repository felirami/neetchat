# XMTP Chat App – Architecture & Guide (for Cursor)

## Overview
This document explains how to build a production-ready messaging app using the XMTP protocol without storing messages on your backend. XMTP automatically stores, syncs, and retrieves messages across devices. Your app only needs to store metadata, profiles, settings, and optional caching.

---

# 1. What XMTP Stores
XMTP automatically handles:
- Messages  
- Conversations  
- Attachments  
- Message history / sync  
- Identity via wallet  

Example:
```ts
const conversations = await xmtp.conversations.list();
const messages = await conversation.messages();
```

---

# 2. What Your Backend Should Store
You should store:

### User Profiles
| Field | Type | Notes |
|------|------|-------|
| id | uuid | primary key |
| wallet | string | XMTP identity |
| username | string | display name |
| avatar_url | string | profile picture |
| bio | string | optional |
| created_at | timestamp | |

### Contacts
| Field | Type |
|-------|------|
| user_id | uuid |
| contact_wallet | string |
| pinned | boolean |
| blocked | boolean |

### Groups
| Field | Type |
|-------|------|
| id | uuid |
| name | string |
| created_by | string |
| description | string |
| avatar_url | string |

### Files (Filecoin/Web3.Storage)
| Field | Type |
|-------|------|
| id | uuid |
| cid | string |
| uploader | string |
| mime | string |
| created_at | timestamp |

---

# 3. Minimal Database Schema (SQL)
```sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  wallet text unique not null,
  username text,
  avatar_url text,
  bio text,
  created_at timestamp default now()
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  contact_wallet text not null,
  pinned boolean default false,
  blocked boolean default false
);

create table groups (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_by text not null,
  description text,
  avatar_url text
);

create table files (
  id uuid primary key default gen_random_uuid(),
  cid text not null,
  uploader text not null,
  mime text,
  created_at timestamp default now()
);
```

---

# 4. Directory Structure
```
/xmtp-chat-app
│
├── app/
│   ├── api/
│   │   ├── profile/
│   │   ├── files/
│   │   └── groups/
│   ├── chat/
│   └── settings/
│
├── lib/
│   ├── xmtp.ts
│   ├── db.ts
│   └── utils.ts
│
├── components/
│   ├── ChatUI.tsx
│   ├── MessageBubble.tsx
│   ├── ConversationList.tsx
│   ├── ProfileCard.tsx
│   └── GroupCard.tsx
│
└── README.md
```

---

# 5. XMTP Client Wrapper
```ts
import { Client } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers';

export async function createXmtp(wallet) {
  const xmtp = await Client.create(wallet, {
    env: 'production',
  });
  return xmtp;
}
```

---

# 6. Minimal API Endpoints
### /api/profile  
- GET  
- POST  
- PATCH  

### /api/files  
- POST  
- GET  

### /api/groups  
- POST  
- GET  

---

# 7. Hackathon Plan (30h)
0–3h → Setup  
3–8h → UI  
8–15h → Profiles  
15–20h → Sponsor integrations  
20–30h → Polish & submission  

---

# 8. ASCII Architecture Diagram
```
          ┌──────────────────────────┐
          │        Your App          │
          │  Next.js / React Native  │
          └─────────────┬────────────┘
                        │
                  XMTP Client
                        │
          ┌─────────────┴─────────────┐
          │        XMTP Network        │
          │ (messages, history, inbox) │
          └─────────────┬─────────────┘
                        │
          ┌─────────────┴─────────────┐
          │      Your Backend DB       │
          │ (profiles, files, groups)  │
          └────────────────────────────┘
```
