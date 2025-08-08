import React, { useState, useEffect } from 'react';
import { 
  AppShell,
  Container,
  Tabs,
  Text,
  Button,
  TextInput,
  Textarea,
  Paper,
  Grid,
  SimpleGrid,
  Card,
  Badge,
  Group,
  Title,
  Box,
  Image,
  Loader,
  Menu,
  UnstyledButton,
  Avatar,
  Divider,
  ActionIcon,
  Switch,
  Select,
  Modal,
  Stack,
  List,
  ThemeIcon,
  ColorSwatch
} from '@mantine/core';
import { IconBuildingSkyscraper, IconFolder, IconReceipt, IconEye, IconBrain, IconStar, IconCrown, IconLock, IconShield, IconHelp } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import './App.css';
import BuildTimeline from './BuildTimeline';
import BuildConsole from './BuildConsole';
import AiManager from './AiManager';
import ProjectDashboard from './ProjectDashboard';
import SubscriptionPlans from './SubscriptionPlans';
import RequirementsEditor from './RequirementsEditor';
import { useAuth } from './AuthContext';
import AuthPage from './AuthPage';
import UserProfile from './UserProfile';
import ProjectViewer from './ProjectViewer';
import OurTech from './OurTech';
import ProfileSettings from './ProfileSettings';
import AdminPanel from './AdminPanel';
import SupportPage from './SupportPage';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import TestLogin from '../test-login';
import TestEnv from './test-env';
import TestAuthSpeed from './test-auth-speed';

function App() {
  const { isAuthenticated, currentUser, loading: authLoading } = useAuth();
  const [view, setView] = useState('main'); // 'main', 'dashboard', or 'subscriptions'
  const [mode, setMode] = useState('template'); // 'template' or 'nlp'
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templateError, setTemplateError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDetails, setTemplateDetails] = useState(null);
  const [customReq, setCustomReq] = useState('');
  const [nlRequest, setNlRequest] = useState('');
  const [requirementsStep, setRequirementsStep] = useState(false);
  const [finalRequirements, setFinalRequirements] = useState([]);
  const [projectName, setProjectName] = useState('My Project');
  const [submitted, setSubmitted] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [buildStatus, setBuildStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [buildComplete, setBuildComplete] = useState(false);
  const [consoleSrc, setConsoleSrc] = useState('about:blank');
  const [aiStatus, setAiStatus] = useState('');
  const [aiIssues, setAiIssues] = useState([]);
  const [aiCodeQuality, setAiCodeQuality] = useState(null);
  const [headerActivated, setHeaderActivated] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [profileSettingsTab, setProfileSettingsTab] = useState('profile');
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState(null);
  
  // Reset header when navigating away from build page
  useEffect(() => {
    if (view !== 'main' || (!submitted && !requirementsStep)) {
      setHeaderActivated(false);
    }
  }, [view, submitted, requirementsStep]);
  
  const handleNavigateToSettings = (tab) => {
    setProfileSettingsTab(tab);
    setShowProfileSettings(true);
    setView('settings');
  };

  // Rating component for templates
  const TemplateRating = ({ rating = 4.5, size = 14, interactive = false, onRatingChange }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    const handleStarClick = (starIndex) => {
      if (interactive && onRatingChange) {
        onRatingChange(starIndex + 1);
      }
    };
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[...Array(fullStars)].map((_, i) => (
          <IconStar 
            key={`full-${i}`} 
            size={size} 
            style={{ 
              color: 'rgba(255, 255, 255, 0.3)',
              transition: 'color 0.2s ease',
              cursor: interactive ? 'pointer' : 'default'
            }}
            className="template-star"
            onClick={() => handleStarClick(i)}
          />
        ))}
        {hasHalfStar && (
          <IconStar 
            size={size} 
            style={{ 
              color: 'rgba(255, 255, 255, 0.3)',
              transition: 'color 0.2s ease',
              cursor: interactive ? 'pointer' : 'default'
            }}
            className="template-star"
            onClick={() => handleStarClick(fullStars)}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <IconStar 
            key={`empty-${i}`} 
            size={size} 
            style={{ 
              color: 'rgba(255, 255, 255, 0.1)',
              transition: 'color 0.2s ease',
              cursor: interactive ? 'pointer' : 'default'
            }}
            className="template-star"
            onClick={() => handleStarClick(fullStars + (hasHalfStar ? 1 : 0) + i)}
          />
        ))}
        <Text size="xs" c="dimmed" ml={4} style={{ opacity: 0.7 }}>
          {rating}
        </Text>
      </div>
    );
  };

  // Check if template is premium and user has access
  const isTemplatePremium = (template) => {
    return template.access_tier === 'pro' || template.access_tier === 'enterprise';
  };

  const hasTemplateAccess = (template) => {
    if (!isTemplatePremium(template)) return true;
    if (!currentUser) return false;
    
    const userTier = currentUser.subscription;
    if (template.access_tier === 'pro' && (userTier === 'basic' || userTier === 'unlimited')) return true;
    if (template.access_tier === 'enterprise' && userTier === 'unlimited') return true;
    
    return false;
  };

  // Handle template selection for modal
  const handleTemplateSelect = (template) => {
    if (!hasTemplateAccess(template)) {
      notifications.show({
        title: 'Premium Template',
        message: 'This template requires a higher subscription tier.',
        color: 'yellow'
      });
      return;
    }
    setSelectedTemplateForModal(template);
    setTemplateModalOpen(true);
  };

  // Handle modal customization and build
  const handleModalCustomizeAndBuild = () => {
    if (!selectedTemplateForModal) return;
    
    setSelectedTemplate(selectedTemplateForModal);
    setTemplateModalOpen(false);
    
    // Move to requirements step
    let reqs = [];
    
    // Handle free form template
    if (selectedTemplateForModal.id === 'free-form') {
      if (customReq.trim()) {
        reqs.push(customReq.trim());
      }
    } else {
      // Handle regular templates
      if (templateDetails) {
        if (templateDetails.tech_stack) {
          reqs.push(`Use tech stack: ${templateDetails.tech_stack.join(', ')}`);
        }
        
        if (templateDetails.structure) {
          if (templateDetails.structure.pages) {
            templateDetails.structure.pages.forEach(page => {
              reqs.push(`Create page: ${page.name}`);
            });
          }
          
          if (templateDetails.structure.components) {
            reqs.push(`Include components: ${templateDetails.structure.components.join(', ')}`);
          }
        }
      }
      
      if (customReq.trim()) {
        const customReqs = customReq
          .split(/,|\n/)
          .map(r => r.trim())
          .filter(r => r.length > 0);
        reqs = [...reqs, ...customReqs];
      }
    }
    
    setFinalRequirements([...new Set(reqs)]);
    setRequirementsStep(true);
  };
  
  // Fetch templates from API
  useEffect(() => {
    async function fetchTemplates() {
      try {
        setTemplatesLoading(true);
        const response = await fetch('http://localhost:8000/templates/');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch templates: ${response.status}`);
        }
        
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setTemplateError(error.message);
      } finally {
        setTemplatesLoading(false);
      }
    }
    
    fetchTemplates();
  }, []);
  
  // Fetch template details when template is selected
  useEffect(() => {
    async function fetchTemplateDetails(templateId) {
      try {
        const response = await fetch(`http://localhost:8000/templates/${templateId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch template details: ${response.status}`);
        }
        
        const data = await response.json();
        setTemplateDetails(data);
      } catch (error) {
        console.error(`Error fetching template details for ${templateId}:`, error);
      }
    }
    
    if (selectedTemplate?.id) {
      fetchTemplateDetails(selectedTemplate.id);
    } else {
      setTemplateDetails(null);
    }
  }, [selectedTemplate]);

  const handleTemplateNext = (e) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    
    let reqs = [];
    
    // If we have template details with structure information
    if (templateDetails) {
      // Add tech stack as requirements
      if (templateDetails.tech_stack) {
        reqs.push(`Use tech stack: ${templateDetails.tech_stack.join(', ')}`);
      }
      
      // Add page/component requirements based on structure
      if (templateDetails.structure) {
        if (templateDetails.structure.pages) {
          templateDetails.structure.pages.forEach(page => {
            reqs.push(`Create page: ${page.name}`);
          });
        }
        
        if (templateDetails.structure.components) {
          reqs.push(`Include components: ${templateDetails.structure.components.join(', ')}`);
        }
      }
    }
    
    // Add custom requirements
    if (customReq.trim()) {
      // Split customReq by comma or newline
      const customReqs = customReq
        .split(/,|\n/)
        .map(r => r.trim())
        .filter(r => r.length > 0);
      reqs = [...reqs, ...customReqs];
    }
    
    setFinalRequirements([...new Set(reqs)]);
    setRequirementsStep(true);
  };

  const handleRequirementsConfirm = async (reqs) => {
    setFinalRequirements([...new Set(reqs)]);
    setRequirementsStep(false);
    setSubmitted(true);
    setBuildComplete(false);
    setBuildStatus('Uploading and starting build...');
    setAiStatus('');
    setAiIssues([]);
    setAiCodeQuality(null);
    setHeaderActivated(false); // Reset header to transparent when starting new build
    
    // Prepare form data
    const formData = new FormData();
    
    // Add project name
    formData.append('project_name', projectName);
    
    // Add requirements
    reqs.forEach((req) => {
      formData.append('requirements', req);
    });
    
    // Add template ID if one is selected
    if (selectedTemplate?.id) {
      formData.append('template_id', selectedTemplate.id);
    }
    
    // Add project type (web by default)
    formData.append('project_type', 'web');
    
    try {
      const res = await fetch('http://localhost:8000/generate-project/', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Build request failed');
      
      const data = await res.json();
      setProjectId(data.project_id);
      setDownloadUrl(`http://localhost:8000${data.zip_file}`);
      setConsoleSrc(`http://localhost:8000/logs/${data.project_id}`);
      setBuildStatus('Build started...');
      pollBuildStatus(data.project_id);
      pollLogs(data.project_id);
    } catch (err) {
      console.error("Error starting build:", err);
      setBuildStatus('Build failed to start.');
      setBuildComplete(true);
    }
  };

  // Set log source URL
  const pollLogs = (projectId) => {
    // Set console source to the logs endpoint
    setConsoleSrc(`http://localhost:8000/logs/${projectId}`);
  };

  // Real-time polling of build status
  const pollBuildStatus = (projectId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/build-status/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          
          // Update UI based on build status
          switch(data.status) {
            case 'initializing':
              setBuildStatus('Initializing build process...');
              setAiStatus('Analyzing requirements...');
              setAiIssues([]);
              setAiCodeQuality(75);
              setHeaderActivated(true);
              break;
              
            case 'generating':
              setBuildStatus(`Building... (${data.file_count} files generated)`);
              setAiStatus('Generating code and validating...');
              setAiIssues([]);
              setAiCodeQuality(85);
              setHeaderActivated(true);
              break;
              
            case 'complete':
              setBuildStatus('Build complete!');
              setAiStatus('All requirements implemented successfully.');
              setAiIssues([]);
              setAiCodeQuality(95);
              setBuildComplete(true);
              setHeaderActivated(true);
              clearInterval(interval); // Stop polling
              break;
              
            case 'failed':
              setBuildStatus('Build failed.');
              setAiStatus('Build failed with errors. Check the console logs below for details.');
              setAiIssues(['Build process encountered errors', 'Review console output for specific issues', 'Try adjusting your requirements and rebuilding']);
              setAiCodeQuality(50);
              setBuildComplete(true);
              setHeaderActivated(true);
              clearInterval(interval); // Stop polling
              break;
              
            default:
              setBuildStatus(`Build status: ${data.status}`);
          }
        }
      } catch (error) {
        console.error("Error polling build status:", error);
        // Stop polling on error after a few attempts
        clearInterval(interval);
      }
    }, 2000); // Poll every 2 seconds
    
    // Stop polling after 10 minutes as a safety measure
    setTimeout(() => clearInterval(interval), 600000);
  };

  // If still loading auth state, show a loader
  if (authLoading) {
    console.log('Auth loading, showing centered loader');
    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}>
        <Image 
          src="/images/squadboxboxed.svg" 
          alt="Squadbox Logo" 
          w={200}
          h={60}
          fit="contain"
          mb={40}
          style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
        />
        <Loader size="xl" color="brand" />
        <Text size="sm" c="dimmed" mt={20}>
          Loading authentication...
        </Text>
        {/* Temporary auth speed test */}
        <div style={{ marginTop: '20px', maxWidth: '400px' }}>
          <TestAuthSpeed />
        </div>
      </div>
    );
  }
  
  // TEMPORARILY BYPASS AUTH FOR TESTING
  console.log('Auth state:', { authLoading, isAuthenticated, currentUser });
  
  // If not authenticated, show the auth page
  if (!isAuthenticated) {
    console.log('Not authenticated, showing auth page');
    return <AuthPage />;
  }
  
  // User is authenticated, show main app
  return (
    <AppShell>
      <AppShell.Header 
        pt="xl" 
        pb="sm" 
        className={headerActivated ? 'activated' : ''}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          backgroundColor: headerActivated ? 'rgba(0, 40, 100, 0.95)' : 'rgba(0, 0, 0, 0.2)',
          backdropFilter: headerActivated ? 'blur(15px)' : 'blur(20px)',
          WebkitBackdropFilter: headerActivated ? 'blur(15px)' : 'blur(20px)',
          borderBottom: headerActivated ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingLeft: 48, paddingRight: 64, marginBottom: 13, height: '65px' }}>
          <Image 
            src="/images/squadboxboxed.svg" 
            alt="Squadbox Logo" 
            w={180} 
            h={50}
            fit="contain" 
            style={{ alignSelf: 'center' }}
          />
          <div style={{ height: '65px', display: 'flex', alignItems: 'center' }}>
            <UserProfile onNavigateToSettings={handleNavigateToSettings} />
          </div>
        </div>
        

        <div style={{ width: '100%', marginBottom: '13px' }}>
          <Tabs 
            value={view} 
            onChange={setView} 
            color="brand" 
            classNames={{ root: 'header-tabs' }}
            position="center"
          >
              <Tabs.List style={{ borderBottom: 'none' }}>
              <Tabs.Tab 
                value="main" 
                leftSection={<IconBuildingSkyscraper size={16} />}
              >
                Build Project
              </Tabs.Tab>
                                            <Tabs.Tab 
                value="dashboard" 
                leftSection={<IconFolder size={16} />}
              >
                My Projects
              </Tabs.Tab>
              {currentUser?.subscription === 'free' && (
                <Tabs.Tab 
                  value="subscriptions" 
                  leftSection={<IconReceipt size={16} />}
                >
                  Subscriptions
                </Tabs.Tab>
              )}
              {/* <Tabs.Tab 
                value="viewer" 
                leftSection={<IconEye size={16} />}
              >
                Viewer
              </Tabs.Tab> */}
              <Tabs.Tab 
                value="tech" 
                leftSection={<IconBrain size={16} />}
              >
                Our Tech
              </Tabs.Tab>
              {currentUser?.role === 'admin' && (
                <Tabs.Tab 
                  value="admin" 
                  leftSection={<IconShield size={16} />}
                >
                  Admin
                </Tabs.Tab>
              )}
              <Tabs.Tab value="support" leftSection={<IconHelp size={16} />}>
                Support
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>
      </AppShell.Header>
      
      <AppShell.Main pt={30}>
        <Container size="lg" pt={20} pb="xl">
          {view === 'dashboard' ? (
            <div style={{ marginTop: 175 }}>
              <ProjectDashboard />
            </div>
          ) : view === 'subscriptions' ? (
            <div style={{ marginTop: 175 }}>
              <SubscriptionPlans />
            </div>
          ) : view === 'settings' ? (
            <div style={{ marginTop: 175 }}>
              <ProfileSettings initialTab={profileSettingsTab} />
            </div>
          ) : /* view === 'viewer' ? (
            <div style={{ marginTop: 175 }}>
              <ProjectViewer />
            </div>
          ) : */ view === 'tech' ? (
            <div style={{ marginTop: 175 }}>
              <OurTech />
            </div>
          ) : view === 'admin' ? (
            <div style={{ marginTop: 175 }}>
              <AdminPanel />
            </div>
          ) : view === 'support' ? (
            <div style={{ marginTop: 175 }}>
              <SupportPage />
            </div>
          ) : !requirementsStep && !submitted ? (
          <div className="input-methods" style={{ marginTop: 125 }}>

            {mode === 'template' ? (
              <form onSubmit={handleTemplateNext} className="template-form">
                <h2 style={{ marginTop: 10, marginBottom: 20 }}><span style={{ color: 'var(--mantine-color-brand-6)', fontWeight: 'bold', marginRight: 8 }}>1.</span> Select a Template</h2>
                <div className="template-list">
                  {templatesLoading ? (
                    <div className="loading">Loading templates...</div>
                  ) : templateError ? (
                    <div className="error">Error loading templates: {templateError}</div>
                  ) : templates.length === 0 ? (
                    <div className="no-templates">No templates available</div>
                  ) : (
                    [
                      {
                        id: 'free-form',
                        name: 'Custom Project',
                        description: 'Describe what you want to build in natural language',
                        tech_stack: ['Custom'],
                        isFreeForm: true
                      },
                      ...templates
                    ].map(t => (
                      <div 
                        key={t.id} 
                        className={`template-card ${selectedTemplate?.id === t.id ? 'selected' : ''} ${!hasTemplateAccess(t) ? 'locked' : ''}`} 
                        onClick={() => handleTemplateSelect(t)}
                        style={{
                          opacity: !hasTemplateAccess(t) ? 0.6 : 1,
                          cursor: !hasTemplateAccess(t) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <strong>{t.name}</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {t.isFreeForm ? (
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'rgba(100, 180, 255, 0.2)',
                                borderRadius: '50%',
                                border: '1px solid rgba(100, 180, 255, 0.3)',
                                color: 'rgba(100, 180, 255, 0.8)',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease'
                              }}>
                                +
                              </div>
                            ) : (
                              <TemplateRating rating={t.rating || 4.5} />
                            )}
                            
                            {/* Premium Access Icon */}
                            {isTemplatePremium(t) && (
                              hasTemplateAccess(t) ? (
                                <IconCrown 
                                  size={16} 
                                  style={{ 
                                    color: '#ffd700',
                                    opacity: 0.8
                                  }} 
                                />
                              ) : (
                                <IconLock 
                                  size={16} 
                                  style={{ 
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    opacity: 0.6
                                  }} 
                                />
                              )
                            )}
                          </div>
                        </div>
                        <p>{t.description}</p>
                        {t.tech_stack && (
                          <div className="tech-stack">
                            Tech: {t.tech_stack.join(', ')}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <Text size="sm" c="dimmed">
                    Click on any template to customize and build your project
                  </Text>
                </div>
              </form>
            ) : (
              <form onSubmit={e => {
                e.preventDefault();
                // For NLP, treat user input as requirements
                setFinalRequirements([nlRequest.trim()]);
                setRequirementsStep(true);
              }} className="nl-form">
                <h2 style={{ marginTop: 10, marginBottom: 20 }}><span style={{ color: 'var(--mantine-color-brand-6)', fontWeight: 'bold', marginRight: 8 }}>1.</span> Describe Your Site</h2>
                <div className="form-group">
                  <textarea
                    id="nlRequest"
                    placeholder="Describe your site, features, plugins, tech stack, etc."
                    value={nlRequest}
                    onChange={e=>setNlRequest(e.target.value)}
                    rows={6}
                    required
                  />
                </div>
                
                <h2 style={{ marginTop: 25, marginBottom: 15 }}><span style={{ color: 'var(--mantine-color-brand-6)', fontWeight: 'bold', marginRight: 8 }}>2.</span> Project Name</h2>
                <div className="form-group">
                  <input
                    id="nlpProjectName"
                    type="text"
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    required
                  />
                </div>
                
                <button type="submit" disabled={!nlRequest.trim() || !projectName.trim()}>Next: Review Requirements</button>
              </form>
            )}
          </div>
        ) : requirementsStep ? (
          <div style={{ marginTop: 140 }}>
            <RequirementsEditor
              initialRequirements={finalRequirements}
              onConfirm={handleRequirementsConfirm}
            />
          </div>
        ) : (
          <div className="build-progress" style={{ marginTop: 140 }}>
            <AiManager 
              statusMessage={aiStatus} 
              issues={aiIssues} 
              codeQuality={aiCodeQuality} 
              complete={buildComplete} 
            />
            <BuildTimeline 
              currentStage={buildComplete ? 2 : (buildStatus.includes('Building') ? 1 : 0)} 
              complete={buildComplete} 
            />
            <h2 style={{ 
              color: buildStatus.includes('failed') ? '#F44336' : 
                     buildStatus.includes('complete') ? '#4CAF50' : 
                     'inherit'
            }}>
              Status: {buildStatus}
            </h2>
            {buildStatus === 'Build failed to start.' && (
              <div style={{color: 'red', marginBottom: 8}}>
                Error: Could not connect to backend or backend returned an error.
              </div>
            )}
            {buildStatus === 'Build failed.' && (
              <div style={{
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                color: '#F44336'
              }}>
                <strong>Build Failed</strong>
                <br />
                The build process encountered errors. Review the console logs below for specific details about what went wrong.
                You can try adjusting your requirements and rebuilding the project.
              </div>
            )}
            <BuildConsole src={consoleSrc} projectId={projectId} />
            {buildComplete && (
              <div className="download-deploy">
                {!buildStatus.includes('failed') ? (
                  <>
                    <a href={downloadUrl} download>Download Site Package</a>
                    <button disabled>Deploy (Coming Soon)</button>
                  </>
                ) : (
                  <div style={{
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    color: '#F44336'
              }}>
                    <strong>Build Failed - No Download Available</strong>
                    <br />
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      Fix the errors in your requirements and try rebuilding the project.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        </Container>
        <Box component="footer" py="md" ta="center">
                        <Text size="sm" c="dimmed">&copy; {new Date().getFullYear()} Squadbox AI Builder</Text>
        </Box>
      </AppShell.Main>

      {/* Template Detail Modal */}
      <Modal
        opened={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        size="lg"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconBuildingSkyscraper size={16} />
            <Text size="sm" fw={600}>{selectedTemplateForModal?.name}</Text>
          </div>
        }
        styles={{
          title: { color: 'white' },
          header: { backgroundColor: 'rgba(0, 0, 0, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
          body: { backgroundColor: 'rgba(0, 0, 0, 0.9)', padding: '24px' },
          content: { backgroundColor: 'rgba(0, 0, 0, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)' }
        }}
      >
        {selectedTemplateForModal && (
          <div>
            {/* Project Name */}
            <div style={{ marginBottom: '24px' }}>
              <Text size="lg" fw={600} mb="16px">
                Name Your Project
              </Text>
              
              <TextInput
                placeholder="Enter your project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }
                }}
              />
            </div>

            {/* Customization */}
            <div style={{ marginBottom: '24px' }}>
              <Text size="lg" fw={600} mb="16px">
                {selectedTemplateForModal.id === 'free-form' ? 'Describe Your Project' : 'Add Custom Requirements'}
              </Text>
              
              <Textarea
                placeholder={
                  selectedTemplateForModal.id === 'free-form' 
                    ? "Describe what you want to build in detail. Include features, design preferences, tech stack, etc..."
                    : "- Add custom requirements\n- One per line/bullet list works best"
                }
                value={customReq}
                onChange={(e) => setCustomReq(e.target.value)}
                minRows={selectedTemplateForModal.id === 'free-form' ? 6 : 5}
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }
                }}
              />
            </div>

            {/* Template Preview */}
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '8px', 
              padding: '20px', 
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <Text size="lg" fw={600} mb="xs">{selectedTemplateForModal.name}</Text>
                  <TemplateRating rating={selectedTemplateForModal.rating || 4.5} size={16} />
                </div>
                <Badge color="brand" variant="light">
                  {selectedTemplateForModal.tech_stack?.length || 0} technologies
                </Badge>
              </div>
              
              <Text size="sm" c="dimmed" mb="16px">
                {selectedTemplateForModal.description}
              </Text>
              
              {selectedTemplateForModal.tech_stack && (
                <div>
                  <Text size="sm" fw={500} mb="xs">Tech Stack:</Text>
                  <Group gap="xs">
                    {selectedTemplateForModal.tech_stack.map((tech, index) => (
                      <Badge key={index} variant="outline" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </Group>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ position: 'relative' }}>
              <Group justify="flex-end" gap="md">
                <Button 
                  variant="light" 
                  onClick={() => setTemplateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  color="brand"
                  onClick={handleModalCustomizeAndBuild}
                  disabled={!projectName.trim() || (selectedTemplateForModal.id === 'free-form' && !customReq.trim())}
                >
                  {selectedTemplateForModal.id === 'free-form' ? 'Build Project' : 'Customize & Build'}
                </Button>
              </Group>
              
              {/* Premium Veil for Locked Templates */}
              {selectedTemplateForModal && isTemplatePremium(selectedTemplateForModal) && !hasTemplateAccess(selectedTemplateForModal) && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  zIndex: 10
                }}>
                  <IconLock size={24} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Text size="sm" fw={500} ta="center" c="white">
                    Premium Template
                  </Text>
                  <Text size="xs" ta="center" c="dimmed" style={{ maxWidth: '200px' }}>
                    Upgrade your subscription to unlock this template
                  </Text>
                  <Button 
                    size="xs" 
                    color="brand" 
                    variant="light"
                    onClick={() => {
                      setTemplateModalOpen(false);
                      setView('subscriptions');
                    }}
                  >
                    View Plans
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
      
      {/* Footer */}
      <Footer />
      
      {/* Theme Toggle */}
      <ThemeToggle />
    </AppShell>
  );
}

export default App;
