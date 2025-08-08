# Database Abstraction Layer Guide for Squadbox

## Overview
This guide documents the database abstraction layer that allows Squadbox to switch between different database providers seamlessly. The abstraction layer provides a unified interface for Supabase, MongoDB, PostgreSQL, and other database providers.

## Architecture

### Frontend Abstraction Layer (`src/lib/database.js`)
- **Purpose**: Provides unified database interface for React components
- **Providers**: Supabase, MongoDB, PostgreSQL, MySQL
- **Features**: Authentication, user management, project management

### Backend Abstraction Layer (`backend/database_abstraction.py`)
- **Purpose**: Provides unified database interface for Python backend
- **Providers**: Supabase, MongoDB, PostgreSQL, MySQL
- **Features**: CRUD operations, authentication, data management

## Database Providers

### 1. Supabase (Default)
- **Type**: PostgreSQL with real-time features
- **Authentication**: Built-in auth system
- **Best for**: Production applications with real-time requirements

### 2. MongoDB
- **Type**: NoSQL document database
- **Authentication**: Custom implementation needed
- **Best for**: Flexible schema requirements

### 3. PostgreSQL
- **Type**: Relational database
- **Authentication**: Custom implementation needed
- **Best for**: Complex queries and relationships

### 4. MySQL
- **Type**: Relational database
- **Authentication**: Custom implementation needed
- **Best for**: Traditional web applications

## Configuration

### Environment Variables

#### Frontend (Vite)
```bash
# Database Provider Selection
VITE_DB_PROVIDER=supabase

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# MongoDB Configuration (if using MongoDB)
VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# PostgreSQL Configuration (if using PostgreSQL)
VITE_POSTGRES_URL=postgresql://username:password@host:port/database
```

#### Backend
```bash
# Database Provider Selection
DB_PROVIDER=supabase

# Supabase Configuration
squadbox_SUPABASE_URL=https://your-project.supabase.co
squadbox_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# MongoDB Configuration (if using MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# PostgreSQL Configuration (if using PostgreSQL)
POSTGRES_URL=postgresql://username:password@host:port/database
```

## Usage Examples

### Frontend Usage

#### Basic Setup
```javascript
import { auth, db, DatabaseFactory, DB_PROVIDERS } from './lib/database';

// Get current provider
const currentProvider = DatabaseFactory.getCurrentProvider();
console.log(`Current provider: ${currentProvider}`);

// Switch provider
DatabaseFactory.setProvider(DB_PROVIDERS.MONGODB);
```

#### Authentication
```javascript
// Sign up
const { data, error } = await auth.signUp(email, password, userData);

// Sign in
const { data, error } = await auth.signIn(email, password);

// Sign out
const { error } = await auth.signOut();

// Get current user
const { user, error } = await auth.getCurrentUser();
```

#### User Management
```javascript
// Get user profile
const { data, error } = await db.getUserProfile(userId);

// Create user profile
const { data, error } = await db.createUserProfile(userData);

// Update user profile
const { data, error } = await db.updateUserProfile(userId, updates);

// Get user by email
const { data, error } = await db.getUserByEmail(email);
```

#### Project Management
```javascript
// Get user projects
const { data, error } = await db.getUserProjects(userId);

// Create project
const { data, error } = await db.createProject(projectData);

// Update project
const { data, error } = await db.updateProject(projectId, updates);

// Delete project
const { data, error } = await db.deleteProject(projectId);
```

### Backend Usage

#### Basic Setup
```python
from database_abstraction import database, DatabaseFactory, DB_PROVIDERS

# Get current provider
current_provider = DatabaseFactory.get_current_provider()
print(f"Current provider: {current_provider}")

# Switch provider
DatabaseFactory.set_provider(DB_PROVIDERS['MONGODB'])
```

#### User Operations
```python
import asyncio

# Get user by ID
user = await database.get_user_by_id(user_id)

# Get user by email
user = await database.get_user_by_email(email)

# Create user
user_data = {
    "id": "user-123",
    "email": "user@example.com",
    "username": "username",
    "name": "User Name",
    "role": "user"
}
user = await database.create_user(user_data)

# Update user
success = await database.update_user(user_id, {"name": "New Name"})

# Delete user
success = await database.delete_user(user_id)
```

#### Project Operations
```python
# Get user projects
projects = await database.get_user_projects(user_id)

# Create project
project_data = {
    "id": "project-123",
    "user_id": user_id,
    "name": "Project Name",
    "description": "Project description"
}
project = await database.create_project(project_data)

# Update project
success = await database.update_project(project_id, {"status": "completed"})

# Delete project
success = await database.delete_project(project_id)

# Get project
project = await database.get_project(project_id)
```

#### Authentication
```python
# Verify token
user = await database.verify_token(token)
```

## Provider-Specific Features

### Supabase Provider
- **Authentication**: Full auth system with JWT tokens
- **Real-time**: Built-in real-time subscriptions
- **Row Level Security**: Automatic RLS policies
- **File Storage**: Built-in file storage

### MongoDB Provider
- **Flexible Schema**: No fixed schema requirements
- **Scalability**: Horizontal scaling
- **Aggregation**: Powerful aggregation pipeline
- **Custom Auth**: Requires custom authentication implementation

### PostgreSQL Provider
- **ACID Compliance**: Full ACID transactions
- **Complex Queries**: Advanced SQL features
- **Extensions**: Rich ecosystem of extensions
- **Custom Auth**: Requires custom authentication implementation

## Migration Between Providers

### Switching Providers
1. **Update Environment Variables**: Change the provider configuration
2. **Data Migration**: Use migration scripts to move data
3. **Test Functionality**: Verify all features work with new provider
4. **Update Code**: Modify any provider-specific code

### Migration Scripts
```python
# Example migration from Supabase to MongoDB
from database_abstraction import SupabaseProvider, MongoDBProvider

# Initialize providers
supabase = SupabaseProvider()
mongodb = MongoDBProvider()

# Migrate users
users = await supabase.get_all_users()
for user in users:
    await mongodb.create_user(user)

# Migrate projects
projects = await supabase.get_all_projects()
for project in projects:
    await mongodb.create_project(project)
```

## Testing

### Frontend Testing
```javascript
// Test database connection
import { DatabaseFactory } from './lib/database';

const provider = DatabaseFactory.getCurrentProvider();
console.log(`Testing with provider: ${provider}`);

// Test authentication
const { data, error } = await auth.signIn('test@example.com', 'password');
if (error) {
    console.error('Authentication failed:', error);
}
```

### Backend Testing
```python
# Test database connection
from database_abstraction import database, DatabaseFactory

provider = DatabaseFactory.get_current_provider()
print(f"Testing with provider: {provider}")

# Test user operations
user = await database.get_user_by_email('test@example.com')
if user:
    print(f"Found user: {user['name']}")
```

## Best Practices

### 1. Provider Selection
- **Development**: Use Supabase for quick setup
- **Production**: Choose based on requirements (Supabase for real-time, MongoDB for flexibility, PostgreSQL for complex queries)

### 2. Error Handling
```javascript
// Frontend
try {
    const { data, error } = await db.getUserProfile(userId);
    if (error) {
        console.error('Database error:', error);
        // Handle error appropriately
    }
} catch (error) {
    console.error('Unexpected error:', error);
}
```

```python
# Backend
try:
    user = await database.get_user_by_id(user_id)
    if user is None:
        print("User not found")
except Exception as e:
    print(f"Database error: {e}")
```

### 3. Environment Management
- Use different providers for different environments
- Keep sensitive credentials secure
- Use environment-specific configuration files

### 4. Performance Optimization
- Implement caching where appropriate
- Use connection pooling for database connections
- Monitor query performance

## Troubleshooting

### Common Issues

#### 1. Provider Not Found
```
Error: Unknown provider: invalid_provider
```
**Solution**: Check that the provider name is correct and supported.

#### 2. Missing Environment Variables
```
Error: Missing Supabase environment variables
```
**Solution**: Ensure all required environment variables are set for the selected provider.

#### 3. Connection Issues
```
Error: Failed to connect to database
```
**Solution**: Check network connectivity and database credentials.

#### 4. Authentication Errors
```
Error: Invalid credentials
```
**Solution**: Verify authentication configuration and credentials.

### Debug Mode
Enable debug logging to troubleshoot issues:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Future Enhancements

### Planned Features
1. **Redis Provider**: Add Redis for caching and session management
2. **GraphQL Support**: Add GraphQL interface for complex queries
3. **Migration Tools**: Automated migration between providers
4. **Performance Monitoring**: Built-in performance metrics
5. **Backup/Restore**: Automated backup and restore functionality

### Contributing
To add a new database provider:
1. Implement the `DatabaseInterface` abstract class
2. Add provider to the `DB_PROVIDERS` enum
3. Update the `DatabaseFactory.create()` method
4. Add tests for the new provider
5. Update documentation

## Conclusion

The database abstraction layer provides a powerful and flexible foundation for Squadbox, allowing seamless switching between different database providers while maintaining a consistent API. This architecture ensures scalability, maintainability, and future-proofing of the application.
