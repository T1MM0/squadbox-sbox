/*
 * Footer.jsx
 * Purpose: Site footer with navigation links, company info, and feedback system
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Text, 
  Group, 
  Button, 
  Modal, 
  TextInput, 
  Textarea, 
  Select,
  Stack,
  ActionIcon,
  Divider
} from '@mantine/core';
import { 
  IconHeart, 
  IconBrandTwitter, 
  IconBrandDiscord, 
  IconBrandLinkedin, 
  IconBrandGithub,
  IconMail,
  IconX
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const Footer = () => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    type: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Send feedback to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedbackForm,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        notifications.show({
          title: 'Thank you!',
          message: 'Your feedback has been submitted successfully.',
          color: 'green'
        });
        setFeedbackModalOpen(false);
        setFeedbackForm({ name: '', email: '', type: '', message: '' });
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to submit feedback. Please try again.',
        color: 'red'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Templates', href: '/templates' },
      { label: 'Pricing', href: '/subscriptions' },
      { label: 'Our Tech', href: '/our-tech' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Feature Request', href: '/support' }
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Support', href: '/support' },
      { label: 'Community', href: '/community' },
      { label: 'Security', href: '/security' },
      { label: 'API', href: '/api' },
      { label: 'Report Issue', href: '/support' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Beta NDA', href: '/beta-nda' },
      { label: 'Liability', href: '/liability' },
      { label: 'Cookie Policy', href: '/cookies' }
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Investors', href: '/investors' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' }
    ]
  };

  const socialLinks = [
    { icon: <IconBrandTwitter size={20} />, href: 'https://twitter.com/squadbox_uk', label: 'Twitter' },
    { icon: <IconBrandDiscord size={20} />, href: 'https://discord.gg/squadbox', label: 'Discord' },
    { icon: <IconBrandLinkedin size={20} />, href: 'https://linkedin.com/company/squadbox', label: 'LinkedIn' },
    { icon: <IconBrandGithub size={20} />, href: 'https://github.com/squadbox', label: 'GitHub' }
  ];

  return (
    <>
      <footer style={{ 
        backgroundColor: 'white', 
        borderTop: '1px solid #e9ecef',
        marginTop: 'auto'
      }}>
        {/* Top gradient band */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #ff6b35 0%, #f7dc6f 100%)',
          width: '100%'
        }} />
        
        <Container size="xl" py={40}>
          <Grid gutter={40}>
            {/* Left Section - Company Info */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <div style={{ marginBottom: '24px' }}>
                <Group mb={16}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#ff6b35',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ width: '100%', height: '2px', backgroundColor: 'white' }} />
                      <div style={{ width: '100%', height: '2px', backgroundColor: 'white' }} />
                      <div style={{ width: '100%', height: '2px', backgroundColor: 'white' }} />
                    </div>
                  </div>
                  <Text fw={700} size="lg">Squadbox</Text>
                </Group>
                
                <Text size="sm" c="dimmed" mb={24} style={{ lineHeight: 1.6 }}>
                  Squadbox is the AI-powered platform that lets users build fully functioning apps in minutes. 
                  Using our proprietary MMRY Neural Folding technology, Squadbox enables anyone to turn their 
                  words into personal productivity apps, back-office tools, customer portals, or complete 
                  enterprise products that are ready to use, no integrations required.
                </Text>

                <Button 
                  leftSection={<IconHeart size={16} />}
                  variant="light" 
                  color="red"
                  onClick={() => setFeedbackModalOpen(true)}
                  mb={24}
                >
                  We ♥️ Feedback
                </Button>

                <Group gap="md">
                  {socialLinks.map((link, index) => (
                    <ActionIcon
                      key={index}
                      variant="subtle"
                      size="lg"
                      component="a"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </ActionIcon>
                  ))}
                </Group>
              </div>
            </Grid.Col>

            {/* Right Section - Navigation Links */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Grid gutter={40}>
                <Grid.Col span={{ base: 6, md: 3 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }}>
                    Product
                  </Text>
                  <Stack gap={8}>
                    {footerLinks.product.map((link, index) => (
                      <Text 
                        key={index} 
                        size="sm" 
                        component="a" 
                        href={link.href}
                        style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 3 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }}>
                    Resources
                  </Text>
                  <Stack gap={8}>
                    {footerLinks.resources.map((link, index) => (
                      <Text 
                        key={index} 
                        size="sm" 
                        component="a" 
                        href={link.href}
                        style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 3 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }}>
                    Legal
                  </Text>
                  <Stack gap={8}>
                    {footerLinks.legal.map((link, index) => (
                      <Text 
                        key={index} 
                        size="sm" 
                        component="a" 
                        href={link.href}
                        style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 3 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }}>
                    Company
                  </Text>
                  <Stack gap={8}>
                    {footerLinks.company.map((link, index) => (
                      <Text 
                        key={index} 
                        size="sm" 
                        component="a" 
                        href={link.href}
                        style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>

          <Divider my={24} />
          
          <Text size="sm" c="dimmed">
            © 2024 Squadbox Ltd. All rights reserved.
          </Text>
        </Container>
      </footer>

      {/* Feedback Modal */}
      <Modal 
        opened={feedbackModalOpen} 
        onClose={() => setFeedbackModalOpen(false)}
        title="We ♥️ Your Feedback"
        size="md"
      >
        <form onSubmit={handleFeedbackSubmit}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Name"
                placeholder="Your name"
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                required
              />
              <TextInput
                label="Email"
                placeholder="your@email.com"
                value={feedbackForm.email}
                onChange={(e) => setFeedbackForm({...feedbackForm, email: e.target.value})}
                required
              />
            </Group>

            <Select
              label="Feedback Type"
              placeholder="Select feedback type"
              data={[
                'Bug Report',
                'Feature Request',
                'General Feedback',
                'Compliment',
                'Complaint',
                'Other'
              ]}
              value={feedbackForm.type}
              onChange={(value) => setFeedbackForm({...feedbackForm, type: value})}
              required
            />

            <Textarea
              label="Message"
              placeholder="Tell us what you think..."
              minRows={4}
              value={feedbackForm.message}
              onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
              required
            />

            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={() => setFeedbackModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                color="brand"
                loading={submitting}
                leftSection={<IconMail size={16} />}
              >
                Send Feedback
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default Footer;
