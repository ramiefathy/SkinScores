"use client";

import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/button-premium';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, Keyboard, Calculator, FileDown, Search, 
  GitCompare, History, Share2, Moon, BookOpen, Video,
  MessageCircle, Sparkles, ArrowRight, ExternalLink,
  Shield, Zap, Users, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// FAQ data
const faqs = [
  {
    id: 'accuracy',
    question: 'How accurate are the scoring calculations?',
    answer: 'All scoring algorithms are based on peer-reviewed clinical studies and validated scoring systems. Each tool references the original publication and has been verified by dermatology professionals.',
    category: 'general'
  },
  {
    id: 'privacy',
    question: 'Is patient data secure?',
    answer: 'Yes, all calculations are performed locally in your browser. No patient data is transmitted to servers. Data is stored only in your browser\'s local storage and can be cleared at any time.',
    category: 'privacy'
  },
  {
    id: 'export',
    question: 'How do I export calculation results?',
    answer: 'Click the "Export" button on any result page to download as PDF or CSV. Use Ctrl+P to print directly. Results can also be shared via secure links.',
    category: 'features'
  },
  {
    id: 'templates',
    question: 'What are templates and how do I use them?',
    answer: 'Templates save common input values for quick reuse. Save a template after any calculation, then load it later to pre-fill the form with those values.',
    category: 'features'
  },
  {
    id: 'compare',
    question: 'How does the comparison feature work?',
    answer: 'The Compare page lets you view up to 4 calculations side-by-side. Select calculations from your history to analyze changes over time or compare different patients.',
    category: 'features'
  }
];

// Help categories
const categories = [
  { id: 'general', label: 'General', icon: HelpCircle },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'features', label: 'Features', icon: Zap },
];

// Quick links
const quickLinks = [
  { title: 'Keyboard Shortcuts', href: '#shortcuts', icon: Keyboard },
  { title: 'Video Tutorials', href: '#tutorials', icon: Video },
  { title: 'Contact Support', href: 'mailto:support@skinscores.com', icon: MessageCircle },
  { title: 'API Documentation', href: '/api-docs', icon: BookOpen, external: true }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <PageWrapper>
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-[hsl(var(--premium-purple))]/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <HelpCircle className="h-6 w-6" />
            </motion.div>
            <span className="text-sm font-medium uppercase tracking-wider font-accent">Help Center</span>
          </div>
          <h1 className="text-4xl font-bold font-headline">Knowledge Base</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Everything you need to know about using SkinScores effectively
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <div className="p-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search help topics, FAQs, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
                <motion.div
                  animate={{ opacity: searchQuery ? 1 : 0 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Badge variant="secondary">
                    {filteredFaqs.length} results
                  </Badge>
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Link href={link.href} target={link.external ? '_blank' : undefined}>
                <GlassCard className="p-4 hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <link.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{link.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="getting-started" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger value="getting-started" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calculator className="h-4 w-4 mr-2" />
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MessageCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="shortcuts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Keyboard className="h-4 w-4 mr-2" />
                Shortcuts
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Video className="h-4 w-4 mr-2" />
                Tutorials
              </TabsTrigger>
            </TabsList>

            {/* Getting Started Tab */}
            <TabsContent value="getting-started" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                  {
                    step: 1,
                    title: "Select a Tool",
                    description: "Browse tools in the sidebar or use the command palette (⌘K)",
                    icon: Search
                  },
                  {
                    step: 2,
                    title: "Enter Clinical Data",
                    description: "Fill in required parameters with helpful tooltips and validation",
                    icon: Calculator
                  },
                  {
                    step: 3,
                    title: "Get Results",
                    description: "View scores, interpretations, and export or share results",
                    icon: FileDown
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <GlassCard className="h-full">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.5,
                            }}
                            className="p-3 rounded-full bg-primary/10 text-primary"
                          >
                            <item.icon className="h-6 w-6" />
                          </motion.div>
                          <div>
                            <Badge variant="outline">Step {item.step}</Badge>
                            <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              <GlassCard>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: History, title: 'Calculation History', desc: 'Track patient progress over time' },
                      { icon: GitCompare, title: 'Compare Results', desc: 'View up to 4 calculations side-by-side' },
                      { icon: Share2, title: 'Secure Sharing', desc: 'Generate QR codes and secure links' },
                      { icon: Moon, title: 'Dark Mode', desc: 'Comfortable viewing in any environment' },
                      { icon: Shield, title: 'HIPAA Compliant', desc: 'All data processed locally' },
                      { icon: Users, title: 'Multi-user Support', desc: 'Switch between workspaces easily' }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="flex gap-3"
                      >
                        <feature.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </GlassCard>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-4">
              <div className="flex gap-2 mb-6">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    {category.label}
                  </Button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {filteredFaqs.length > 0 ? (
                  <motion.div
                    key="faqs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Accordion type="single" collapsible className="space-y-4">
                      {filteredFaqs.map((faq, index) => (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <AccordionItem value={faq.id} className="border rounded-lg px-4 data-[state=open]:border-primary/50 transition-colors">
                            <AccordionTrigger className="hover:no-underline py-4">
                              <span className="text-left font-medium">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        </motion.div>
                      ))}
                    </Accordion>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <p className="text-muted-foreground">No FAQs found matching your search.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Shortcuts Tab */}
            <TabsContent value="shortcuts" id="shortcuts">
              <GlassCard>
                <CardHeader>
                  <CardTitle>Keyboard Shortcuts</CardTitle>
                  <CardDescription>Speed up your workflow with these shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4 text-primary">Navigation</h4>
                      <div className="space-y-3">
                        {[
                          { keys: '⌘ K', desc: 'Command Palette' },
                          { keys: 'Ctrl H', desc: 'Go Home' },
                          { keys: 'Ctrl Shift H', desc: 'View History' },
                          { keys: 'Ctrl S', desc: 'Settings' },
                        ].map((shortcut) => (
                          <div key={shortcut.keys} className="flex justify-between items-center">
                            <span className="text-muted-foreground">{shortcut.desc}</span>
                            <kbd className="px-2 py-1 text-xs bg-muted rounded font-mono">{shortcut.keys}</kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4 text-primary">Actions</h4>
                      <div className="space-y-3">
                        {[
                          { keys: 'Ctrl P', desc: 'Print Results' },
                          { keys: 'Ctrl Shift E', desc: 'Export Results' },
                          { keys: 'Ctrl Shift T', desc: 'Toggle Theme' },
                          { keys: 'Ctrl /', desc: 'Show Shortcuts' },
                        ].map((shortcut) => (
                          <div key={shortcut.keys} className="flex justify-between items-center">
                            <span className="text-muted-foreground">{shortcut.desc}</span>
                            <kbd className="px-2 py-1 text-xs bg-muted rounded font-mono">{shortcut.keys}</kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials" id="tutorials" className="space-y-4">
              <div className="text-center py-12">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Video Tutorials Coming Soon</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We&apos;re creating comprehensive video tutorials to help you master SkinScores.
                </p>
                <PremiumButton>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Notified When Available
                </PremiumButton>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">Still Need Help?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our support team is here to assist you with any questions or issues you may have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="mailto:support@skinscores.com">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://github.com/skinscores/app/issues" target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Report an Issue
                  </Link>
                </Button>
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>
      </div>
    </PageWrapper>
  );
}