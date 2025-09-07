
"use client";

import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PremiumCard } from '@/components/ui/card-premium';
import { Stethoscope, Microscope, ClipboardList, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { MeshGradient } from '@paper-design/shaders-react';
import { motion } from 'framer-motion';
import { RotatingBadge } from '@/components/ui/rotating-badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { getToolMetadata } from '@/lib/tools';

const ToolCard = memo(({ href, icon: Icon, title, description, toolId }: { href: string; icon: React.ElementType; title: string; description: string; toolId: string }) => {
  const tool = getToolMetadata(toolId);
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={href} passHref>
          <PremiumCard gradient hover className="h-full shadow-sm cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <motion.div 
                  className="bg-gradient-to-br from-primary/20 to-[hsl(var(--premium-purple))]/20 p-3 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <CardTitle className="text-lg font-semibold font-headline">{title}</CardTitle>
                  <CardDescription className="text-base">{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </PremiumCard>
        </Link>
      </HoverCardTrigger>
      {tool && (
        <HoverCardContent className="w-80" side="right">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold">{tool.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
            </div>
            {tool.condition && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {tool.condition}
                </Badge>
              </div>
            )}
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
});

ToolCard.displayName = 'ToolCard';

function HomePageComponent() {
  return (
    <>
      {/* Hero Section with Mesh Gradient */}
      <section className="relative min-h-[70vh] -mt-24 pt-24 overflow-hidden">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-40">
          <MeshGradient
            speed={0.15}
            colors={['#6ba3d0', '#a78bfa', '#60a5fa', '#c7d2fe']}
            className="w-full h-full"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-20">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6">
              <span className="font-headline">Welcome to</span>{' '}
              <span className="font-headline text-gradient-premium">SkinScores</span>
            </h1>
            <p className="text-2xl md:text-3xl text-foreground/80 mb-8 font-normal">
              <span className="font-normal">Your</span> centralized resource for validated dermatology scoring tools. 
              Streamline your clinical workflow with our comprehensive and easy-to-use calculators.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl p-4 sm:p-6 md:p-8 -mt-10 relative z-20">

      <motion.div 
        className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
         <PremiumCard gradient className="p-6">
            <h2 className="text-3xl font-semibold font-headline mb-3">How to Get Started</h2>
            <p className="text-lg text-muted-foreground">
                Quickly access our most frequently used instruments in the &quot;Popular Tools&quot; section below, or use the fully searchable, categorized sidebar to find any tool you need.
            </p>
         </PremiumCard>
         <PremiumCard gradient className="p-6">
            <h2 className="text-3xl font-semibold font-headline mb-3">Secure & Private by Design</h2>
             <p className="text-lg text-muted-foreground">
                All calculations are performed locally in your browser. No patient data is ever transmitted, collected, or stored, ensuring complete confidentiality.
            </p>
         </PremiumCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-4xl font-bold text-center mb-8 font-headline">Popular Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToolCard 
            href="/?toolId=abcde_melanoma"
            icon={Microscope}
            title="ABCDE Rule for Melanoma"
            description="Melanoma Screening"
            toolId="abcde_melanoma"
          />
          <ToolCard
            href="/?toolId=dlqi"
            icon={ClipboardList}
            title="Dermatology Life Quality Index (DLQI)"
            description="Quality of Life"
            toolId="dlqi"
          />
          <ToolCard
            href="/?toolId=easi"
            icon={Stethoscope}
            title="Eczema Area and Severity Index (EASI)"
            description="Atopic Dermatitis / Eczema"
            toolId="easi"
          />
          <ToolCard
            href="/?toolId=pasi"
            icon={BookOpen}
            title="Psoriasis Area and Severity Index (PASI)"
            description="Psoriasis / Psoriatic Arthritis"
            toolId="pasi"
          />
        </div>
      </motion.div>
      </div>
      
      {/* Rotating Quality Badge */}
      <RotatingBadge />
    </>
  );
}

export const HomePage = memo(HomePageComponent);
