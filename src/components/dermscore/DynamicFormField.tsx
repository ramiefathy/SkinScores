
import React, { memo } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { InputConfig } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { TooltipField } from '@/components/ui/tooltip-field';


// Generate contextual help based on field properties
const generateTooltipContent = (inputConfig: InputConfig) => {
  const { label, type, description, id } = inputConfig;
  const labelLower = label.toLowerCase();
  
  // Common severity tooltips
  if (labelLower.includes('erythema') || labelLower.includes('redness')) {
    return {
      tooltip: 'Redness of the skin. Assess the intensity of red coloration in the affected area.',
      references: {
        '0': 'No redness',
        '1': 'Faint pink/light red',
        '2': 'Definite red',
        '3': 'Deep/dark red',
        '4': 'Very deep red/purple'
      }
    };
  }
  
  if (labelLower.includes('induration') || labelLower.includes('thickness')) {
    return {
      tooltip: 'Thickness or raised appearance of skin lesions. Assess by gently palpating the area.',
      references: {
        '0': 'No elevation',
        '1': 'Barely perceptible elevation',
        '2': 'Easily palpable elevation',
        '3': 'Marked elevation',
        '4': 'Very marked elevation'
      }
    };
  }
  
  if (labelLower.includes('scaling') || labelLower.includes('desquamation')) {
    return {
      tooltip: 'Visible flaking or peeling of the skin surface.',
      references: {
        '0': 'No scaling',
        '1': 'Fine scales',
        '2': 'Moderate scales',
        '3': 'Heavy scales',
        '4': 'Very heavy/thick scales'
      }
    };
  }
  
  if (labelLower.includes('body surface area') || labelLower.includes('bsa') || labelLower.includes('extent')) {
    return {
      tooltip: 'Percentage of the body region affected. Use the palm of your hand as approximately 1% of total body surface area.',
      examples: [
        'Palm = ~1% BSA',
        'Entire arm = ~9% BSA',
        'Entire leg = ~18% BSA'
      ]
    };
  }
  
  if (labelLower.includes('pruritus') || labelLower.includes('itch')) {
    return {
      tooltip: 'Itching sensation. Rate the average intensity over the specified time period.',
      examples: [
        '0-3: Mild - occasional awareness',
        '4-6: Moderate - frequent awareness, some interference',
        '7-10: Severe - constant awareness, significant interference'
      ]
    };
  }
  
  if (labelLower.includes('sleep') || labelLower.includes('insomnia')) {
    return {
      tooltip: 'Sleep disturbance due to skin symptoms. Consider both difficulty falling asleep and night-time awakening.',
      examples: [
        '0: No sleep loss',
        '1-3: Occasional difficulty',
        '4-6: Frequent awakening',
        '7-10: Severe insomnia'
      ]
    };
  }
  
  // VAS (Visual Analog Scale) specific help
  if (labelLower.includes('vas') || type === 'number' && (inputConfig.max === 10 || inputConfig.max === 100)) {
    return {
      tooltip: `Rate on a scale from ${inputConfig.min || 0} (none) to ${inputConfig.max} (most severe).`,
      examples: [
        'Consider your average experience over the time period',
        'Be consistent in your ratings across different assessments'
      ]
    };
  }
  
  // Default to description if provided
  if (description) {
    return { tooltip: description };
  }
  
  return null;
};

interface DynamicFormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  inputConfig: InputConfig;
}

function DynamicFormFieldComponent<TFieldValues extends FieldValues>({
  control,
  inputConfig,
}: DynamicFormFieldProps<TFieldValues>) {
  const { id, label, type, options, defaultValue, min, max, step, placeholder, description: fieldDescription } = inputConfig; // Renamed to avoid conflict

  return (
    <FormField
      control={control}
      name={id as Path<TFieldValues>}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          {type !== 'checkbox' && (
            <div className="min-h-[4rem]">
              <TooltipField {...generateTooltipContent(inputConfig) || {}}>
                <FormLabel>{label}</FormLabel>
              </TooltipField>
              {fieldDescription ? (
                <FormDescription className="mt-1 text-sm text-muted-foreground">
                  {fieldDescription}
                </FormDescription>
              ) : (
                <div className="mt-1 h-[1.25rem]" aria-hidden="true" />
              )}
            </div>
          )}
          <FormControl>
            <div>
              {type === 'number' && (
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? null : parseFloat(val));
                  }}
                  min={min}
                  max={max}
                  step={step}
                  placeholder={placeholder}
                  className={error ? 'border-destructive' : ''}
                />
              )}
              {type === 'text' && (
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder={placeholder}
                  className={error ? 'border-destructive' : ''}
                />
              )}
              {type === 'select' && options && (
                <Select
                  onValueChange={(value) => {
                    const selectedOption = options.find(opt => String(opt.value) === value);
                    if (selectedOption && typeof selectedOption.value === 'number') {
                      field.onChange(Number(value));
                    } else {
                      field.onChange(value);
                    }
                  }}
                  value={field.value !== null && field.value !== undefined ? String(field.value) : ''}
                >
                  <SelectTrigger className={error ? 'border-destructive' : ''}>
                    <SelectValue placeholder={placeholder || "Select an option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem
                        key={`${inputConfig.id}-${String(option.value)}-${option.label}`}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {type === 'checkbox' && (
                <div className="flex items-start space-x-2 pt-2 min-h-[4rem]">
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    id={field.name}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={field.name} className="text-sm font-medium cursor-pointer">
                      {label}
                    </Label>
                    {fieldDescription && (
                      <p className="text-sm text-muted-foreground">{fieldDescription}</p>
                    )}
                  </div>
                </div>
              )}
              {type === 'radio' && options && (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    const selectedOption = options.find(opt => String(opt.value) === value);
                    if (selectedOption && typeof selectedOption.value === 'number') {
                      field.onChange(Number(value));
                    } else {
                      field.onChange(value);
                    }
                  }}
                  value={field.value !== null && field.value !== undefined ? String(field.value) : ''}
                  className="flex flex-col space-y-1 pt-1"
                >
                  {options.map((option) => (
                    <FormItem
                      key={`${inputConfig.id}-${String(option.value)}-${option.label}`}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={String(option.value)} id={`${field.name}-${option.value}`} />
                      </FormControl>
                      <FormLabel htmlFor={`${field.name}-${option.value}`} className="font-normal cursor-pointer">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              )}
              {(!['number', 'text', 'select', 'checkbox', 'radio'].includes(type) ||
                (type === 'select' && !options) ||
                (type === 'radio' && !options)) && (
                  <div data-testid="empty-form-control-child" />
              )}
            </div>
          </FormControl>
          <FormMessage className="text-xs min-h-[1rem]" />
        </FormItem>
      )}
    />
  );
}

export const DynamicFormField = memo(DynamicFormFieldComponent) as typeof DynamicFormFieldComponent;
