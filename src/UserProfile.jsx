/*
 * UserProfile.jsx
 * Purpose: User profile component for Squadbox app
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React from 'react';
import { 
  Group, 
  Avatar, 
  Text, 
  Menu, 
  Button, 
  Divider,
  UnstyledButton,
  Box
} from '@mantine/core';
import { 
  IconUser, 
  IconLogout, 
  IconChevronDown, 
  IconSettings, 
  IconCrown,
  IconReceipt
} from '@tabler/icons-react';
import { useAuth } from './AuthContext';

const UserProfile = ({ onNavigateToSettings }) => {
  const { currentUser, logout } = useAuth();
  
  if (!currentUser) return null;
  
  // Get initials for avatar
  const getInitials = () => {
    if (!currentUser.name) return '?';
    return currentUser.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Get badge color based on subscription
  const getSubscriptionColor = () => {
    switch (currentUser.subscription) {
      case 'basic':
        return 'blue';
      case 'unlimited':
        return 'violet';
      default:
        return 'gray';
    }
  };
  
  // Get subscription display name
  const getSubscriptionName = () => {
    switch (currentUser.subscription) {
      case 'basic':
        return 'Basic';
      case 'unlimited':
        return 'Unlimited';
      default:
        return 'Free';
    }
  };

  return (
    <Menu position="bottom-end" withArrow width={280}>
      <Menu.Target>
                <UnstyledButton style={{ 
          padding: '0.4rem 0.6rem', 
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.2s ease',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          width: 'auto',
          maxWidth: '220px'
        }}>
          <Avatar color="brand" radius="xl" size="sm" style={{
            backgroundColor: 'rgba(100, 180, 255, 0.2)',
            border: '1px solid rgba(100, 180, 255, 0.3)',
            flexShrink: 0,
            marginRight: '8px'
          }}>
            {getInitials()}
          </Avatar>
          <Box style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px' }}>
            <Text size="sm" fw={500} truncate style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1, whiteSpace: 'nowrap' }}>
              {currentUser.name}
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IconCrown size={12} color={`var(--mantine-color-${getSubscriptionColor()}-6)`} style={{ flexShrink: 0 }} />
              <Text size="xs" c={getSubscriptionColor()} truncate style={{ opacity: 0.8, lineHeight: 1, whiteSpace: 'nowrap' }}>
                {getSubscriptionName()}
              </Text>
            </div>
          </Box>
          <IconChevronDown size={14} style={{ color: 'rgba(255, 255, 255, 0.7)', flexShrink: 0, marginLeft: '6px' }} />
        </UnstyledButton>
      </Menu.Target>
      
      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item leftSection={<IconUser size={14} />} onClick={() => onNavigateToSettings('profile')}>
          Profile
        </Menu.Item>
        <Menu.Item leftSection={<IconSettings size={14} />} onClick={() => onNavigateToSettings('settings')}>
          Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconCrown size={14} />} onClick={() => onNavigateToSettings('subscription')}>
          Subscription
        </Menu.Item>
        <Menu.Item leftSection={<IconReceipt size={14} />} onClick={() => onNavigateToSettings('billing')}>
          Billing
        </Menu.Item>
        <Divider />
        <Menu.Item 
          leftSection={<IconLogout size={14} />} 
          color="red"
          onClick={logout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserProfile;