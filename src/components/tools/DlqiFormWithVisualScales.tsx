"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { PremiumButton } from '@/components/ui/button-premium';
import { Form } from '@/components/ui/form';
import { motion } from 'framer-motion';
import { 
  HeartHandshake, 
  User, 
  Home, 
  Shirt, 
  Gamepad2, 
  Dumbbell, 
  Briefcase,
  Users,
  Heart,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DlqiFormProps {
  tool: any;
  onCalculate: (inputs: Record<string, any>) => void;
}

const questionData = [
  {
    id: 'q1',
    text: 'Over the last week, how itchy, sore, painful or stinging has your skin been?',
    icon: User,
    category: 'Symptoms'
  },
  {
    id: 'q2',
    text: 'Over the last week, how embarrassed or self conscious have you been because of your skin?',
    icon: User,
    category: 'Emotions'
  },
  {
    id: 'q3',
    text: 'Over the last week, how much has your skin interfered with you going shopping or looking after your home or garden?',
    icon: Home,
    category: 'Daily Activities'
  },
  {
    id: 'q4',
    text: 'Over the last week, how much has your skin influenced the clothes you wear?',
    icon: Shirt,
    category: 'Daily Activities'
  },
  {
    id: 'q5',
    text: 'Over the last week, how much has your skin affected any social or leisure activities?',
    icon: Gamepad2,
    category: 'Leisure'
  },
  {
    id: 'q6',
    text: 'Over the last week, how much has your skin made it difficult for you to do any sport?',
    icon: Dumbbell,
    category: 'Leisure'
  },
  {
    id: 'q7',
    text: 'Over the last week, has your skin prevented you from working or studying?',
    icon: Briefcase,
    category: 'Work/School',
    isSpecial: true
  },
  {
    id: 'q8',
    text: 'Over the last week, how much has your skin created problems with your partner or any of your close friends or relatives?',
    icon: Users,
    category: 'Relationships'
  },
  {
    id: 'q9',
    text: 'Over the last week, how much has your skin caused any sexual difficulties?',
    icon: Heart,
    category: 'Relationships',
    hasNotRelevant: true
  },
  {
    id: 'q10',
    text: 'Over the last week, how much of a problem has the treatment for your skin been, for example by making your home messy, or by taking up time?',
    icon: Clock,
    category: 'Treatment'
  }
];

// Color gradient for the scale
const getScaleColor = (value: number) => {
  if (value === 0) return 'from-green-500 to-green-400';
  if (value === 1) return 'from-yellow-500 to-yellow-400';
  if (value === 2) return 'from-orange-500 to-orange-400';
  return 'from-red-500 to-red-400';
};

const scaleLabels = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'A little' },
  { value: 2, label: 'A lot' },
  { value: 3, label: 'Very much' }
];

export function DlqiFormWithVisualScales({ tool, onCalculate }: DlqiFormProps) {
  // Generate form schema
  const formSchema = React.useMemo(() => {
    const shape: Record<string, z.ZodSchema<any>> = {};
    for (let i = 1; i <= 10; i++) {
      if (i === 7) {
        shape[`q${i}`] = z.union([z.literal('3'), z.literal('0_no'), z.literal('0_nr')]);
      } else if (i === 9) {
        shape[`q${i}`] = z.union([z.number().min(0).max(3), z.literal('0_nr')]);
      } else {
        shape[`q${i}`] = z.number().min(0).max(3);
      }
    }
    return z.object(shape);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q1: 0, q2: 0, q3: 0, q4: 0, q5: 0,
      q6: 0, q7: '0_no', q8: 0, q9: 0, q10: 0,
    },
  });

  const onSubmit = (data: Record<string, any>) => {
    onCalculate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <CardContent className="space-y-6">
          {/* Instructions */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold mb-2">Instructions</h3>
        <p className="text-sm text-muted-foreground">
          The following questions ask about the impact of your skin condition on your life over the <strong>last week</strong>. 
          Please select the most appropriate response for each question.
        </p>
      </Card>

      {/* Questions */}
      {questionData.map((question, index) => {
        const Icon = question.icon;
        const currentValue = form.watch(question.id);
        
        // Handle special Q7 case
        if (question.isSpecial) {
          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">
                        Question {index + 1} - {question.category}
                      </p>
                      <p className="text-base">{question.text}</p>
                    </div>
                    
                    <RadioGroup
                      value={currentValue?.toString() || '0_no'}
                      onValueChange={(value) => form.setValue(question.id, value)}
                    >
                      <div className="grid grid-cols-1 gap-3">
                        <label
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                            currentValue === '3' ? 'border-red-500 bg-red-50' : 'border-muted hover:border-primary/50'
                          )}
                        >
                          <RadioGroupItem value="3" />
                          <span className="font-medium">Yes (Prevented work/study)</span>
                        </label>
                        <label
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                            currentValue === '0_no' ? 'border-green-500 bg-green-50' : 'border-muted hover:border-primary/50'
                          )}
                        >
                          <RadioGroupItem value="0_no" />
                          <span>No</span>
                        </label>
                        <label
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                            currentValue === '0_nr' ? 'border-gray-500 bg-gray-50' : 'border-muted hover:border-primary/50'
                          )}
                        >
                          <RadioGroupItem value="0_nr" />
                          <span className="text-muted-foreground">Not relevant</span>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        }
        
        // Handle Q9 with not relevant option
        if (question.hasNotRelevant && form.watch(question.id) === '0_nr') {
          const numValue = 0;
          
          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">
                        Question {index + 1} - {question.category}
                      </p>
                      <p className="text-base">{question.text}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="flex justify-between mb-2">
                          {scaleLabels.map((label) => (
                            <button
                              key={label.value}
                              type="button"
                              onClick={() => form.setValue(question.id, label.value)}
                              className={cn(
                                "text-xs px-2 py-1 rounded transition-all",
                                numValue === label.value 
                                  ? "font-semibold bg-primary/20 text-primary" 
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {label.label}
                            </button>
                          ))}
                        </div>
                        
                        <div className="relative h-12">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-lg" />
                          <Slider
                            min={0}
                            max={3}
                            step={1}
                            value={[numValue]}
                            onValueChange={(value) => form.setValue(question.id, value[0])}
                            className="absolute inset-0"
                          />
                        </div>
                        
                        <div className="text-center mt-2">
                          <span className={cn(
                            "text-lg font-semibold px-3 py-1 rounded-full inline-flex items-center gap-2",
                            "bg-gradient-to-r text-white",
                            getScaleColor(numValue)
                          )}>
                            {numValue}
                            <span className="text-sm font-normal">
                              {scaleLabels[numValue]?.label}
                            </span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => form.setValue(question.id, '0_nr')}
                          className={cn(
                            "text-sm px-4 py-2 rounded-lg border transition-all",
                            form.watch(question.id) === '0_nr'
                              ? "border-gray-500 bg-gray-100 font-medium"
                              : "border-muted text-muted-foreground hover:border-gray-400"
                          )}
                        >
                          Not relevant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        }
        
        // Regular questions with visual scale
        const numValue = question.hasNotRelevant && currentValue === '0_nr' ? 0 : Number(currentValue || 0);
        
        return (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="font-medium text-sm text-primary mb-1">
                      Question {index + 1} - {question.category}
                    </p>
                    <p className="text-base">{question.text}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        {scaleLabels.map((label) => (
                          <button
                            key={label.value}
                            type="button"
                            onClick={() => form.setValue(question.id, label.value)}
                            className={cn(
                              "text-xs px-2 py-1 rounded transition-all",
                              numValue === label.value 
                                ? "font-semibold bg-primary/20 text-primary" 
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {label.label}
                          </button>
                        ))}
                      </div>
                      
                      <div className="relative h-12">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-lg" />
                        <Slider
                          min={0}
                          max={3}
                          step={1}
                          value={[numValue]}
                          onValueChange={(value) => form.setValue(question.id, value[0])}
                          className="absolute inset-0"
                        />
                      </div>
                      
                      <div className="text-center mt-2">
                        <span className={cn(
                          "text-lg font-semibold px-3 py-1 rounded-full inline-flex items-center gap-2",
                          "bg-gradient-to-r text-white",
                          getScaleColor(numValue)
                        )}>
                          {numValue}
                          <span className="text-sm font-normal">
                            {scaleLabels[numValue]?.label}
                          </span>
                        </span>
                      </div>
                    </div>
                    
                    {question.hasNotRelevant && (
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => form.setValue(question.id, '0_nr')}
                          className={cn(
                            "text-sm px-4 py-2 rounded-lg border transition-all",
                            currentValue === '0_nr'
                              ? "border-gray-500 bg-gray-100 font-medium"
                              : "border-muted text-muted-foreground hover:border-gray-400"
                          )}
                        >
                          Not relevant
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}

      {/* Score Preview */}
      <Card className="p-6 bg-primary/5 border-primary/20 sticky bottom-4">
        <h4 className="font-semibold mb-2">DLQI Score Preview</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            {(() => {
              let score = 0;
              for (let i = 1; i <= 10; i++) {
                const rawVal = form.watch(`q${i}`);
                let numVal = 0;
                
                if (i === 7) {
                  if (rawVal === '3') {
                    numVal = 3;
                  } else {
                    numVal = 0;
                  }
                } else if (i === 9) {
                  if (rawVal === '0_nr') {
                    numVal = 0;
                  } else {
                    numVal = Number(rawVal) || 0;
                  }
                } else {
                  numVal = Number(rawVal) || 0;
                }
                
                score += numVal;
              }
              return score;
            })()}
          </span>
          <span className="text-muted-foreground">/ 30</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {(() => {
            const score = (() => {
              let s = 0;
              for (let i = 1; i <= 10; i++) {
                const rawVal = form.watch(`q${i}`);
                let numVal = 0;
                
                if (i === 7) {
                  if (rawVal === '3') {
                    numVal = 3;
                  }
                } else if (i === 9) {
                  if (rawVal !== '0_nr') {
                    numVal = Number(rawVal) || 0;
                  }
                } else {
                  numVal = Number(rawVal) || 0;
                }
                
                s += numVal;
              }
              return s;
            })();
            
            if (score <= 1) return 'No effect on quality of life';
            if (score <= 5) return 'Small effect on quality of life';
            if (score <= 10) return 'Moderate effect on quality of life';
            if (score <= 20) return 'Very large effect on quality of life';
            return 'Extremely large effect on quality of life';
          })()}
        </p>
      </Card>
        </CardContent>
        <CardFooter className="p-6 pt-4 flex justify-end">
          <PremiumButton type="submit" size="lg">
            Calculate DLQI Score
          </PremiumButton>
        </CardFooter>
      </form>
    </Form>
  );
}