/*
 * Footer.jsx
 * Purpose: Site footer with navigation links, company info, and feedback system
 * Last modified: 2025-08-08
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
  Divider,
  Image
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
      const response = await fetch(`http://localhost:8000/feedback`, {
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
        backgroundColor: '#1a1a1a', 
        borderTop: '1px solid #333',
        marginTop: 'auto',
        padding: '40px 0 20px 0'
      }}>
                <Container size="xl" style={{ paddingLeft: '40px' }}>
          <Grid gutter={40}>
            {/* Left Section - Company Info */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <div style={{ marginBottom: '24px' }}>
                <Group mb={20} justify="flex-start">
                  <Image
                    src="/images/squadboxboxed.svg"
                    alt="Squadbox Logo"
                    width={120}
                    height={40}
                    style={{ 
                      filter: 'brightness(0) saturate(100%) invert(100%)',
                      objectFit: 'contain'
                    }}
                  />
                </Group>
                
                <Text size="sm" c="dimmed" mb={24} style={{ lineHeight: 1.6, maxWidth: '300px' }}>
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
                  size="sm"
                >
                  We ♥️ Feedback
                </Button>

                {/* Social Links - Hidden for now */}
                {/* <Group gap="md">
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
                      color="brand"
                    >
                      {link.icon}
                    </ActionIcon>
                  ))}
                </Group> */}
              </div>
            </Grid.Col>

            {/* Right Section - Navigation Links */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Grid gutter={40}>
                <Grid.Col span={{ base: 6, md: 4 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }} c="brand">
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
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--mantine-color-brand-6)'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col>

                {/* Resources column - hidden */}
                {/* <Grid.Col span={{ base: 6, md: 3 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }} c="brand">
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
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--mantine-color-brand-6)'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col> */}

                <Grid.Col span={{ base: 6, md: 4 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }} c="brand">
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
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--mantine-color-brand-6)'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 4 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }} c="brand">
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
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--mantine-color-brand-6)'}
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

          <Divider my={24} style={{ borderColor: 'rgba(100, 180, 255, 0.15)' }} />
          
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
