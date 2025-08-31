
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Stethoscope, Microscope, ClipboardList, BookOpen } from 'lucide-react'; // Example icons
import Link from 'next/link';

const ToolCard = ({ href, icon: Icon, title, description }: { href: string; icon: React.ElementType; title: string; description: string }) => (
  <Link href={href} passHref>
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  </Link>
);

export function HomePage() {
  return (
    <div className="container mx-auto max-w-5xl p-4 sm:p-6 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Welcome to SkinScores</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Your centralized resource for validated dermatology scoring tools. Streamline your clinical workflow with our comprehensive and easy-to-use calculators.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 text-left">
         <div className="space-y-2">
            <h2 className="text-2xl font-semibold">How to Get Started</h2>
            <p className="text-muted-foreground">
                Quickly access our most frequently used instruments in the "Popular Tools" section below, or use the fully searchable, categorized sidebar to find any tool you need.
            </p>
         </div>
         <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Secure & Private by Design</h2>
             <p className="text-muted-foreground">
                All calculations are performed locally in your browser. No patient data is ever transmitted, collected, or stored, ensuring complete confidentiality.
            </p>
         </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Popular Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToolCard 
            href="/?toolId=abcde_melanoma"
            icon={Microscope}
            title="ABCDE Rule for Melanoma"
            description="Melanoma Screening"
          />
          <ToolCard
            href="/?toolId=dlqi"
            icon={ClipboardList}
            title="Dermatology Life Quality Index (DLQI)"
            description="Quality of Life"
          />
          <ToolCard
            href="/?toolId=easi"
            icon={Stethoscope}
            title="Eczema Area and Severity Index (EASI)"
            description="Atopic Dermatitis / Eczema"
          />
          <ToolCard
            href="/?toolId=pasi"
            icon={BookOpen}
            title="Psoriasis Area and Severity Index (PASI)"
            description="Psoriasis / Psoriatic Arthritis"
          />
        </div>
      </div>
    </div>
  );
}
