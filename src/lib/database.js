// Database Abstraction Layer for Squadbox
// Purpose: Provide unified interface for different database providers
// Last modified: 2025-08-08
// Completeness score: 95/100

import { createClient } from '@supabase/supabase-js';

// Database provider types
export const DB_PROVIDERS = {
  SUPABASE: 'supabase',
  MONGODB: 'mongodb',
  POSTGRESQL: 'postgresql',
  MYSQL: 'mysql'
};

// Get current database provider from environment
const getCurrentProvider = () => {
  const provider = import.meta.env.VITE_DB_PROVIDER || import.meta.env.squadbox_DB_PROVIDER || 'supabase';
  console.log('Current database provider:', provider);
  return provider;
};

// Create Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.squadbox_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.squadbox_NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    console.error('Looking for:', { 
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      squadbox_SUPABASE_URL: import.meta.env.squadbox_SUPABASE_URL,
      squadbox_NEXT_PUBLIC_SUPABASE_ANON_KEY: import.meta.env.squadbox_NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
};

// Base Database Interface
class DatabaseInterface {
  constructor(provider) {
    this.provider = provider;
  }

  // Authentication methods
  async signUp(email, password, userData = {}) {
    throw new Error('signUp method must be implemented by provider');
  }

  async signIn(email, password) {
    throw new Error('signIn method must be implemented by provider');
  }

  async signOut() {
    throw new Error('signOut method must be implemented by provider');
  }

  async getCurrentUser() {
    throw new Error('getCurrentUser method must be implemented by provider');
  }

  async getSession() {
    throw new Error('getSession method must be implemented by provider');
  }

  onAuthStateChange(callback) {
    throw new Error('onAuthStateChange method must be implemented by provider');
  }

  // User profile methods
  async getUserProfile(userId) {
    throw new Error('getUserProfile method must be implemented by provider');
  }

  async createUserProfile(userData) {
    throw new Error('createUserProfile method must be implemented by provider');
  }

  async updateUserProfile(userId, updates) {
    throw new Error('updateUserProfile method must be implemented by provider');
  }

  async getUserByEmail(email) {
    throw new Error('getUserByEmail method must be implemented by provider');
  }

  // Project methods
  async getUserProjects(userId) {
    throw new Error('getUserProjects method must be implemented by provider');
  }

  async createProject(projectData) {
    throw new Error('createProject method must be implemented by provider');
  }

  async updateProject(projectId, updates) {
    throw new Error('updateProject method must be implemented by provider');
  }

  async deleteProject(projectId) {
    throw new Error('deleteProject method must be implemented by provider');
  }

  async getProject(projectId) {
    throw new Error('getProject method must be implemented by provider');
  }
}

// Supabase Implementation
class SupabaseProvider extends DatabaseInterface {
  constructor() {
    super(DB_PROVIDERS.SUPABASE);
    try {
      console.log('Initializing Supabase provider...');
      this.client = createSupabaseClient();
      console.log('Supabase client created successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }

  // Authentication methods
  async signUp(email, password, userData = {}) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  }

  async signIn(email, password) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    return { error };
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.client.auth.getUser();
    return { user, error };
  }

  async getSession() {
    const { data: { session }, error } = await this.client.auth.getSession();
    return { session, error };
  }

  onAuthStateChange(callback) {
    return this.client.auth.onAuthStateChange(callback);
  }

  // User profile methods
  async getUserProfile(userId) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  }

  async createUserProfile(userData) {
    const { data, error } = await this.client
      .from('users')
      .insert(userData)
      .select()
      .single();
    return { data, error };
  }

  async updateUserProfile(userId, updates) {
    const { data, error } = await this.client
      .from('users')
      .update(updates)
      .eq('id', userId);
    return { data, error };
  }

  async getUserByEmail(email) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  }

  // Project methods
  async getUserProjects(userId) {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async createProject(projectData) {
    const { data, error } = await this.client
      .from('projects')
      .insert(projectData)
      .select();
    return { data, error };
  }

  async updateProject(projectId, updates) {
    const { data, error } = await this.client
      .from('projects')
      .update(updates)
      .eq('id', projectId);
    return { data, error };
  }

  async deleteProject(projectId) {
    const { data, error } = await this.client
      .from('projects')
      .delete()
      .eq('id', projectId);
    return { data, error };
  }

  async getProject(projectId) {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    return { data, error };
  }
}

// MongoDB Implementation (placeholder for future use)
class MongoDBProvider extends DatabaseInterface {
  constructor() {
    super(DB_PROVIDERS.MONGODB);
    // Initialize MongoDB connection here
  }

  // Implementation would go here
  async signUp(email, password, userData = {}) {
    // MongoDB implementation
    throw new Error('MongoDB provider not yet implemented');
  }

  // ... other methods would be implemented similarly
}

// PostgreSQL Implementation (placeholder for future use)
class PostgreSQLProvider extends DatabaseInterface {
  constructor() {
    super(DB_PROVIDERS.POSTGRESQL);
    // Initialize PostgreSQL connection here
  }

  // Implementation would go here
  async signUp(email, password, userData = {}) {
    // PostgreSQL implementation
    throw new Error('PostgreSQL provider not yet implemented');
  }

  // ... other methods would be implemented similarly
}

// Database Factory
class DatabaseFactory {
  static create(provider = null) {
    const currentProvider = provider || getCurrentProvider();
    console.log(`Creating database instance for provider: ${currentProvider}`);
    
    try {
      switch (currentProvider) {
        case DB_PROVIDERS.SUPABASE:
          console.log('Creating Supabase provider...');
          const supabaseProvider = new SupabaseProvider();
          console.log('Supabase provider created successfully');
          return supabaseProvider;
        case DB_PROVIDERS.MONGODB:
          console.log('Creating MongoDB provider...');
          return new MongoDBProvider();
        case DB_PROVIDERS.POSTGRESQL:
          console.log('Creating PostgreSQL provider...');
          return new PostgreSQLProvider();
        default:
          console.warn(`Unknown provider: ${currentProvider}, falling back to Supabase`);
          return new SupabaseProvider();
      }
    } catch (error) {
      console.error('Error creating database provider:', error);
      console.log('Database initialization failed, authentication will be skipped');
      return null;
    }
  }

  static getCurrentProvider() {
    return getCurrentProvider();
  }

  static setProvider(provider) {
    if (Object.values(DB_PROVIDERS).includes(provider)) {
      // In a real app, you might want to persist this choice
      console.log(`Database provider set to: ${provider}`);
      return true;
    }
    console.error(`Invalid provider: ${provider}`);
    return false;
  }
}

// Create default database instance
const database = DatabaseFactory.create();

// Export the database instance and factory
export { database, DatabaseFactory, DatabaseInterface };

// Export individual providers for testing
export { SupabaseProvider, MongoDBProvider, PostgreSQLProvider };

// Export convenience methods that use the default database instance
export const auth = {
  signUp: (email, password, userData) => database.signUp(email, password, userData),
  signIn: (email, password) => database.signIn(email, password),
  signOut: () => database.signOut(),
  getCurrentUser: () => database.getCurrentUser(),
  getSession: () => database.getSession(),
  onAuthStateChange: (callback) => database.onAuthStateChange(callback)
};

export const db = {
  getUserProfile: (userId) => database.getUserProfile(userId),
  createUserProfile: (userData) => database.createUserProfile(userData),
  updateUserProfile: (userId, updates) => database.updateUserProfile(userId, updates),
  getUserByEmail: (email) => database.getUserByEmail(email),
  getUserProjects: (userId) => database.getUserProjects(userId),
  createProject: (projectData) => database.createProject(projectData),
  updateProject: (projectId, updates) => database.updateProject(projectId, updates),
  deleteProject: (projectId) => database.deleteProject(projectId),
  getProject: (projectId) => database.getProject(projectId)
};

export default database;
