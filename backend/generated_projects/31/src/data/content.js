export const content = {
  // Site metadata
  site: {
    title: "Product Name - Tagline Goes Here",
    description: "A brief compelling description of your product or service that appears in search results.",
    domain: "yourdomain.com"
  },
  
  // Hero section
  hero: {
    headline: "Main value proposition headline",
    subheadline: "Supporting statement that explains your product and its benefits.",
    ctaText: "Get Started",
    secondaryCtaText: "Learn More",
    image: "/images/hero-image.jpg"
  },
  
  // Features section
  features: {
    headline: "Why Choose Us",
    subheadline: "Discover what sets our product apart from the competition.",
    featureList: [
      {
        title: "Feature One",
        description: "Description of the first main feature and its benefits.",
        icon: "sparkles"
      },
      {
        title: "Feature Two",
        description: "Description of the second main feature and its benefits.",
        icon: "shield-check"
      },
      {
        title: "Feature Three",
        description: "Description of the third main feature and its benefits.",
        icon: "lightning-bolt"
      }
    ]
  },
  
  // Testimonials section
  testimonials: {
    headline: "What Our Customers Say",
    testimonialList: [
      {
        quote: "This product has completely transformed our business operations. We've seen a 30% increase in productivity.",
        author: "Jane Smith",
        role: "CEO, Company Inc.",
        image: "/images/testimonial-1.jpg"
      },
      {
        quote: "The ease of use and powerful features make this the best solution we've tried. Highly recommended!",
        author: "John Doe",
        role: "Marketing Director, Agency Co.",
        image: "/images/testimonial-2.jpg"
      }
    ]
  },
  
  // Pricing section
  pricing: {
    headline: "Simple, Transparent Pricing",
    subheadline: "No hidden fees or long-term contracts. Choose the plan that works for you.",
    plans: [
      {
        name: "Basic",
        price: "$9",
        period: "/month",
        description: "Perfect for individuals and small projects",
        features: [
          "Feature one",
          "Feature two",
          "Feature three"
        ],
        ctaText: "Start Free Trial"
      },
      {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "Ideal for growing businesses",
        features: [
          "Everything in Basic",
          "Additional feature one",
          "Additional feature two",
          "Additional feature three"
        ],
        ctaText: "Start Free Trial",
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "$99",
        period: "/month",
        description: "For large organizations with advanced needs",
        features: [
          "Everything in Pro",
          "Premium feature one",
          "Premium feature two",
          "Premium feature three",
          "Priority support"
        ],
        ctaText: "Contact Sales"
      }
    ]
  },
  
  // FAQ section
  faq: {
    headline: "Frequently Asked Questions",
    questions: [
      {
        question: "What is your product?",
        answer: "Our product is a [brief description]. It helps [target audience] to [key benefit]."
      },
      {
        question: "How does the free trial work?",
        answer: "Our free trial gives you full access to all features for 14 days. No credit card required."
      },
      {
        question: "Do you offer refunds?",
        answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our product."
      },
      {
        question: "How can I get support?",
        answer: "We provide 24/7 support via email and live chat. Our dedicated team is always ready to help."
      }
    ]
  },
  
  // CTA section
  cta: {
    headline: "Ready to get started?",
    subheadline: "Join thousands of satisfied customers using our product.",
    ctaText: "Sign Up Now",
    secondaryCtaText: "Contact Sales"
  },
  
  // Footer
  footer: {
    companyName: "Your Company Name",
    tagline: "Brief company description or tagline.",
    links: {
      product: [
        { text: "Features", url: "#features" },
        { text: "Pricing", url: "#pricing" },
        { text: "FAQ", url: "#faq" }
      ],
      company: [
        { text: "About", url: "/about" },
        { text: "Contact", url: "/contact" },
        { text: "Careers", url: "/careers" }
      ],
      legal: [
        { text: "Privacy", url: "/privacy" },
        { text: "Terms", url: "/terms" }
      ]
    },
    social: [
      { platform: "twitter", url: "https://twitter.com/yourcompany" },
      { platform: "linkedin", url: "https://linkedin.com/company/yourcompany" },
      { platform: "facebook", url: "https://facebook.com/yourcompany" }
    ],
    copyright: `© ${new Date().getFullYear()} Your Company Name. All rights reserved.`
  }
};

export default content;
