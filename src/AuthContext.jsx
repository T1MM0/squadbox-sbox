/*
 * AuthContext.jsx
 * Purpose: Authentication context for Squadbox app
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { notifications } from '@mantine/notifications';

// Create Auth Context
const AuthContext = createContext(null);

// API URL
const API_URL = 'http://localhost:3700';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Check if user is authenticated on load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
          } else {
            // Token is invalid or expired
            logout();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Register new user
  const register = async (username, email, password, name) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
          name
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Failed to parse response:', error);
        notifications.show({
          title: 'Error',
          message: 'Invalid server response. Please try again.',
          color: 'red'
        });
        return { success: false, error: 'Invalid server response' };
      }

      if (response.ok) {
        localStorage.setItem('authToken', data.access_token);
        setToken(data.access_token);
        setCurrentUser(data.user);
        notifications.show({
          title: 'Success',
          message: 'Registration successful!',
          color: 'green'
        });
        return { success: true };
      } else {
        notifications.show({
          title: 'Registration failed',
          message: data.detail || 'Please try again.',
          color: 'red'
        });
        return { success: false, error: data.detail };
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Server error, please try again later.',
        color: 'red'
      });
      return { success: false, error: 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Create form data for OAuth2 password flow
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Failed to parse response:', error);
        notifications.show({
          title: 'Error',
          message: 'Invalid server response. Please try again.',
          color: 'red'
        });
        return { success: false, error: 'Invalid server response' };
      }

      if (response.ok) {
        localStorage.setItem('authToken', data.access_token);
        setToken(data.access_token);
        setCurrentUser(data.user);
        notifications.show({
          title: 'Success',
          message: 'Login successful!',
          color: 'green'
        });
        return { success: true };
      } else {
        notifications.show({
          title: 'Login failed',
          message: data.detail || 'Invalid credentials.',
          color: 'red'
        });
        return { success: false, error: data.detail };
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Server error, please try again later.',
        color: 'red'
      });
      return { success: false, error: 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentUser(null);
    notifications.show({
      title: 'Logged out',
      message: 'You have been logged out.',
      color: 'blue'
    });
  };

  // Update user subscription
  const updateSubscription = async (subscriptionType) => {
    try {
      if (!token) {
        notifications.show({
          title: 'Authentication required',
          message: 'Please log in to update subscription.',
          color: 'orange'
        });
        return { success: false };
      }

      const response = await fetch(`${API_URL}/auth/subscription`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscription: subscriptionType
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser({
          ...currentUser,
          subscription: subscriptionType
        });
        notifications.show({
          title: 'Success',
          message: `Subscription updated to ${subscriptionType}`,
          color: 'green'
        });
        return { success: true };
      } else {
        notifications.show({
          title: 'Update failed',
          message: data.detail || 'Please try again.',
          color: 'red'
        });
        return { success: false, error: data.detail };
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Server error, please try again later.',
        color: 'red'
      });
      return { success: false, error: 'Server error' };
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    register,
    login,
    logout,
    updateSubscription
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;