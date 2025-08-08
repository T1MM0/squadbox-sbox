# Supabase Integration Guide for Squadbox

## Overview
This guide documents the integration of Supabase with the Squadbox project, including database configuration, authentication, and deployment setup.

## Supabase Configuration

### Project Details
- **Project URL:** https://iwvpvyscnjcxkolqzpsv.supabase.co
- **Project ID:** iwvpvyscnjcxkolqzpsv
- **Database:** PostgreSQL (Supabase managed)

### Environment Variables

#### Frontend Variables (Vite)
```bash
VITE_SUPABASE_URL=https://iwvpvyscnjcxkolqzpsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Backend Variables
```bash
squadbox_SUPABASE_URL=https://iwvpvyscnjcxkolqzpsv.supabase.co
squadbox_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
squadbox_SUPABASE_JWT_SECRET=l0bK0qcn1B0p1BnkIt+ucvfjLYq658+w3MVDxPSoVxtGIFOm41GOaj8GfiutoUdUUKIrl5KkZc+C4gGt6EjYBw==
```

#### Database Connection
```bash
squadbox_POSTGRES_URL=postgres://postgres.iwvpvyscnjcxkolqzpsv:QFpoqwlJUjc0WmT9@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
squadbox_POSTGRES_PRISMA_URL=postgres://postgres.iwvpvyscnjcxkolqzpsv:QFpoqwlJUjc0WmT9@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
squadbox_POSTGRES_URL_NON_POOLING=postgres://postgres.iwvpvyscnjcxkolqzpsv:QFpoqwlJUjc0WmT9@aws-0-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require
```

## Integration Steps

### 1. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Client Configuration

#### Frontend (src/lib/supabase.js)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### Backend (backend/supabase_client.py)
```python
import os
from supabase import create_client, Client

url = os.environ.get("squadbox_SUPABASE_URL")
key = os.environ.get("squadbox_SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)
```

### 3. Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  role VARCHAR DEFAULT 'user',
  subscription VARCHAR DEFAULT 'free',
  project_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Projects Table
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  description TEXT,
  requirements TEXT[],
  project_type VARCHAR DEFAULT 'web',
  status VARCHAR DEFAULT 'pending',
  build_log TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Authentication Integration

#### Frontend Auth Hook
```javascript
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

#### Backend Auth Middleware
```python
from supabase import create_client, Client
import os
from functools import wraps
from flask import request, jsonify

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            # Verify token with Supabase
            user = supabase.auth.get_user(token)
            request.user = user
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
    
    return decorated_function
```

## Vercel Deployment Configuration

### Environment Variables in vercel.json
```json
{
  "env": {
    "VITE_SUPABASE_URL": "https://iwvpvyscnjcxkolqzpsv.supabase.co",
    "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "squadbox_SUPABASE_URL": "https://iwvpvyscnjcxkolqzpsv.supabase.co",
    "squadbox_SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "squadbox_SUPABASE_JWT_SECRET": "l0bK0qcn1B0p1BnkIt+ucvfjLYq658+w3MVDxPSoVxtGIFOm41GOaj8GfiutoUdUUKIrl5KkZc+C4gGt6EjYBw==",
    "squadbox_POSTGRES_URL": "postgres://postgres.iwvpvyscnjcxkolqzpsv:QFpoqwlJUjc0WmT9@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
  }
}
```

## Migration from MongoDB

### Current Setup
- **Primary:** MongoDB Cloud
- **Secondary:** Supabase PostgreSQL

### Migration Strategy
1. **Phase 1:** Dual write (MongoDB + Supabase)
2. **Phase 2:** Read from Supabase, write to both
3. **Phase 3:** Full migration to Supabase

### Data Migration Script
```python
import os
from pymongo import MongoClient
from supabase import create_client, Client

# MongoDB connection
mongo_uri = os.environ.get("MONGODB_URI")
mongo_client = MongoClient(mongo_uri)
mongo_db = mongo_client.sbox

# Supabase connection
supabase_url = os.environ.get("squadbox_SUPABASE_URL")
supabase_key = os.environ.get("squadbox_SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

def migrate_users():
    users = mongo_db.auth.find()
    for user in users:
        supabase.table('users').insert({
            'id': str(user['_id']),
            'email': user['email'],
            'username': user['username'],
            'name': user.get('name', ''),
            'role': user.get('role', 'user'),
            'subscription': user.get('subscription', 'free'),
            'project_count': user.get('projectCount', 0),
            'created_at': user.get('createdAt'),
            'updated_at': user.get('updatedAt')
        }).execute()
```

## Security Considerations

### Row Level Security (RLS)
```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy for users to update only their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### API Security
- Use service role key only on backend
- Use anon key for frontend
- Implement proper JWT validation
- Set up CORS policies

## Performance Optimization

### Connection Pooling
- Use pooled connection for read operations
- Use non-pooled connection for write operations
- Configure connection limits appropriately

### Caching Strategy
- Cache frequently accessed data
- Use Supabase's built-in caching
- Implement client-side caching

## Monitoring and Logging

### Supabase Dashboard
- Monitor database performance
- Track API usage
- View authentication logs
- Monitor storage usage

### Custom Logging
```python
import logging
from supabase import create_client

def log_database_operation(operation, table, user_id):
    logging.info(f"Database operation: {operation} on {table} by user {user_id}")
```

## Troubleshooting

### Common Issues
1. **Connection Timeout:** Check network connectivity
2. **Authentication Errors:** Verify JWT tokens
3. **RLS Policy Issues:** Check user permissions
4. **Environment Variables:** Ensure all variables are set

### Debug Commands
```bash
# Test Supabase connection
curl -X GET "https://iwvpvyscnjcxkolqzpsv.supabase.co/rest/v1/users" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Check environment variables
echo $VITE_SUPABASE_URL
echo $squadbox_SUPABASE_SERVICE_ROLE_KEY
```

## Next Steps

1. **Install Supabase client libraries**
2. **Create database schema**
3. **Implement authentication flow**
4. **Migrate existing data**
5. **Update API endpoints**
6. **Test deployment**
7. **Monitor performance**

## Version History
- 2025-08-08: Created Supabase integration guide
- 2025-08-08: Added environment variable configuration
- 2025-08-08: Documented migration strategy
