"use client";

import React, { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { SettingsGroup } from '@/components/ui/settings-group';
import { AnimatedToggle } from '@/components/ui/animated-toggle';
import { ThemePreview } from '@/components/ui/theme-preview';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/button-premium';
import { Separator } from '@/components/ui/separator';
import { Settings, Palette, Calculator, Bell, Shield, Download, Trash2, BookOpen, Sparkles, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultUnits: 'metric' | 'imperial';
  showWelcomeMessage: boolean;
  autoSaveCalculations: boolean;
  enableNotifications: boolean;
  compactMode: boolean;
  showIntroCards: boolean;
  showTooltips: boolean;
  showSeverityIndicators: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  defaultUnits: 'metric',
  showWelcomeMessage: true,
  autoSaveCalculations: false,
  enableNotifications: false,
  compactMode: false,
  showIntroCards: true,
  showTooltips: true,
  showSeverityIndicators: true,
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [hasChanges, setHasChanges] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('skinscores_preferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      } catch (e) {
        console.error('Failed to load preferences:', e);
      }
    }
    // Sync theme with current theme provider value
    setPreferences(prev => ({ ...prev, theme: theme as UserPreferences['theme'] }));
  }, [theme]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const savePreferences = () => {
    localStorage.setItem('skinscores_preferences', JSON.stringify(preferences));
    setHasChanges(false);
    
    // Apply theme
    setTheme(preferences.theme);
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setHasChanges(true);
    toast({
      title: "Settings Reset",
      description: "Preferences have been reset to defaults.",
      variant: "destructive",
    });
  };

  const clearAllData = () => {
    if (confirm("This will clear all saved calculations and reset all settings. Are you sure?")) {
      localStorage.clear();
      setPreferences(DEFAULT_PREFERENCES);
      setHasChanges(false);
      toast({
        title: "Data Cleared",
        description: "All saved data has been removed.",
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    const data = {
      preferences,
      calculations: JSON.parse(localStorage.getItem('skinscores_calculations') || '[]'),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skinscores-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your data has been downloaded successfully.",
    });
  };

  return (
    <PageWrapper>
      {/* Radial gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[hsl(var(--premium-purple))]/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>
      <div className="space-y-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "linear" }}
          >
            <Settings className="h-8 w-8 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold font-headline">Settings</h1>
            <p className="text-lg text-muted-foreground">Customize your SkinScores experience</p>
          </div>
        </motion.div>

        {/* Appearance */}
        <SettingsGroup
          icon={Palette}
          title="Appearance"
          description="Customize how SkinScores looks"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme">Theme</Label>
              <p className="text-sm text-muted-foreground">Select your preferred color theme</p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Select value={preferences.theme} onValueChange={(value) => updatePreference('theme', value as UserPreferences['theme'])}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Reduce spacing and use smaller fonts</p>
            </div>
            <AnimatedToggle
              id="compact-mode"
              checked={preferences.compactMode}
              onCheckedChange={(checked) => updatePreference('compactMode', checked)}
            />
          </div>
          
          {/* Theme Preview */}
          <div className="mt-6">
            <Label className="text-sm font-medium mb-3 block">Theme Preview</Label>
            <div className="grid grid-cols-3 gap-4">
              <ThemePreview theme="light" />
              <ThemePreview theme="dark" />
              <ThemePreview theme="system" />
            </div>
          </div>
        </SettingsGroup>

        {/* Calculations */}
        <SettingsGroup
          icon={Calculator}
          title="Calculations"
          description="Configure calculation preferences"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="units">Default Units</Label>
              <p className="text-sm text-muted-foreground">Preferred measurement system</p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Select value={preferences.defaultUnits} onValueChange={(value) => updatePreference('defaultUnits', value as UserPreferences['defaultUnits'])}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                  <SelectItem value="imperial">Imperial (in, lbs)</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Auto-save Calculations</Label>
              <p className="text-sm text-muted-foreground">Automatically save calculation results</p>
            </div>
            <AnimatedToggle
              id="auto-save"
              checked={preferences.autoSaveCalculations}
              onCheckedChange={(checked) => updatePreference('autoSaveCalculations', checked)}
            />
          </div>
        </SettingsGroup>

        {/* User Interface */}
        <SettingsGroup
          icon={BookOpen}
          title="User Interface"
          description="Customize educational and assistance features"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="intro-cards">Show Tool Introductions</Label>
              <p className="text-sm text-muted-foreground">Display educational cards before each tool</p>
            </div>
            <AnimatedToggle
              id="intro-cards"
              checked={preferences.showIntroCards}
              onCheckedChange={(checked) => updatePreference('showIntroCards', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tooltips">Show Field Tooltips</Label>
              <p className="text-sm text-muted-foreground">Display helpful hints for form fields</p>
            </div>
            <AnimatedToggle
              id="tooltips"
              checked={preferences.showTooltips}
              onCheckedChange={(checked) => updatePreference('showTooltips', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="severity-indicators">Visual Severity Indicators</Label>
              <p className="text-sm text-muted-foreground">Show progress bars and severity levels in results</p>
            </div>
            <AnimatedToggle
              id="severity-indicators"
              checked={preferences.showSeverityIndicators}
              onCheckedChange={(checked) => updatePreference('showSeverityIndicators', checked)}
            />
          </div>
        </SettingsGroup>

        {/* Notifications */}
        <SettingsGroup
          icon={Bell}
          title="Notifications"
          description="Control how you receive updates"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates about new features</p>
            </div>
            <AnimatedToggle
              id="notifications"
              checked={preferences.enableNotifications}
              onCheckedChange={(checked) => updatePreference('enableNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="welcome">Show Welcome Message</Label>
              <p className="text-sm text-muted-foreground">Display helpful tips on homepage</p>
            </div>
            <AnimatedToggle
              id="welcome"
              checked={preferences.showWelcomeMessage}
              onCheckedChange={(checked) => updatePreference('showWelcomeMessage', checked)}
            />
          </div>
        </SettingsGroup>

        {/* Data & Privacy */}
        <SettingsGroup
          icon={Shield}
          title="Data & Privacy"
          description="Manage your data and privacy settings"
        >
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="w-full justify-start" onClick={exportData}>
                <Download className="mr-2 h-4 w-4" />
                Export All Data
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="destructive" className="w-full justify-start" onClick={clearAllData}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
            </motion.div>
          </div>
          
          <Separator />
          
          <div className="relative">
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-[hsl(var(--premium-purple))]/20 rounded-lg blur"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
            <p className="relative text-sm text-muted-foreground bg-background p-4 rounded-lg">
              All calculations are performed locally in your browser. No patient data is ever transmitted 
              or stored on our servers. Your privacy is our top priority.
            </p>
          </div>
        </SettingsGroup>

        {/* Save/Reset Buttons */}
        <motion.div 
          className="flex gap-4 justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant="outline" onClick={resetPreferences}>
            Reset to Defaults
          </Button>
          <PremiumButton onClick={savePreferences} disabled={!hasChanges}>
            <Sparkles className="mr-2 h-4 w-4" />
            Save Changes
          </PremiumButton>
        </motion.div>
      </div>
    </PageWrapper>
  );
}