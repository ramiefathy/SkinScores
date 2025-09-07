import { CheckCircle2, Info, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';

// Tool-specific severity level configurations
export const severityConfigs = {
  // DLQI: 0-30 scale
  dlqi: {
    maxScore: 30,
    levels: [
      { label: 'No Effect', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2, min: 0, max: 6.67 },
      { label: 'Small Effect', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Info, min: 6.67, max: 20 },
      { label: 'Moderate Effect', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle, min: 20, max: 36.67 },
      { label: 'Very Large Effect', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle, min: 36.67, max: 70 },
      { label: 'Extremely Large Effect', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: XCircle, min: 70, max: 100 },
    ]
  },

  // PASI: 0-72 scale
  pasi: {
    maxScore: 72,
    levels: [
      { label: 'Clear/Almost Clear', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2, min: 0, max: 4.17 },
      { label: 'Mild', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Info, min: 4.17, max: 13.89 },
      { label: 'Moderate', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle, min: 13.89, max: 27.78 },
      { label: 'Severe', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle, min: 27.78, max: 55.56 },
      { label: 'Very Severe', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: XCircle, min: 55.56, max: 100 },
    ]
  },

  // SCORAD: 0-103 scale
  scorad: {
    maxScore: 103,
    levels: [
      { label: 'Clear/Almost Clear', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2, min: 0, max: 14.56 },
      { label: 'Mild', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Info, min: 14.56, max: 24.27 },
      { label: 'Moderate', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle, min: 24.27, max: 48.54 },
      { label: 'Severe', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle, min: 48.54, max: 72.82 },
      { label: 'Very Severe', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: XCircle, min: 72.82, max: 100 },
    ]
  },

  // EASI: 0-72 scale
  easi: {
    maxScore: 72,
    levels: [
      { label: 'Clear', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2, min: 0, max: 1.39 },
      { label: 'Almost Clear', color: 'text-green-500', bgColor: 'bg-green-100', icon: CheckCircle2, min: 1.39, max: 9.72 },
      { label: 'Mild', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Info, min: 9.72, max: 20.83 },
      { label: 'Moderate', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle, min: 20.83, max: 34.72 },
      { label: 'Severe', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle, min: 34.72, max: 100 },
    ]
  },

  // POEM: 0-28 scale
  poem: {
    maxScore: 28,
    levels: [
      { label: 'Clear/Almost Clear', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2, min: 0, max: 10.71 },
      { label: 'Mild', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Info, min: 10.71, max: 28.57 },
      { label: 'Moderate', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle, min: 28.57, max: 57.14 },
      { label: 'Severe', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle, min: 57.14, max: 75 },
      { label: 'Very Severe', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: XCircle, min: 75, max: 100 },
    ]
  },

  // IGA scales (0-4 or 0-5)
  iga: {
    maxScore: 4,
    levels: [
      { label: 'Clear', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2, min: 0, max: 12.5 },
      { label: 'Almost Clear', color: 'text-green-500', bgColor: 'bg-green-100', icon: CheckCircle2, min: 12.5, max: 37.5 },
      { label: 'Mild', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Info, min: 37.5, max: 62.5 },
      { label: 'Moderate', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle, min: 62.5, max: 87.5 },
      { label: 'Severe', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle, min: 87.5, max: 100 },
    ]
  },

  // Default configuration for unspecified tools
  default: {
    maxScore: 100,
    levels: [
      { label: 'Minimal', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2, min: 0, max: 20 },
      { label: 'Mild', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Info, min: 20, max: 40 },
      { label: 'Moderate', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle, min: 40, max: 60 },
      { label: 'Severe', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle, min: 60, max: 80 },
      { label: 'Very Severe', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: XCircle, min: 80, max: 100 },
    ]
  }
};

// Helper function to get severity config for a tool
export function getSeverityConfig(toolId: string) {
  const config = severityConfigs[toolId as keyof typeof severityConfigs] || severityConfigs.default;
  return config;
}

// Helper function to get contextual recommendations based on severity
export function getSeverityRecommendation(normalizedScore: number, toolId: string): string {
  // Tool-specific recommendations
  if (toolId === 'dlqi') {
    if (normalizedScore < 6.67) return "Your skin condition has minimal impact on your quality of life. Continue current management.";
    if (normalizedScore < 20) return "Your skin condition has a small effect on daily life. Monitor symptoms and discuss with your doctor if they worsen.";
    if (normalizedScore < 36.67) return "Moderate impact on quality of life detected. Consider scheduling a dermatology appointment to review treatment options.";
    if (normalizedScore < 70) return "Your skin condition is significantly affecting your life. Prompt medical evaluation is recommended.";
    return "Extremely large impact on quality of life. Please seek immediate dermatological care.";
  }

  if (toolId === 'pasi' || toolId === 'easi') {
    if (normalizedScore < 13.89) return "Mild disease activity. Continue current treatment and monitor for changes.";
    if (normalizedScore < 27.78) return "Moderate disease activity. Consider discussing treatment optimization with your dermatologist.";
    if (normalizedScore < 55.56) return "Severe disease activity. Medical evaluation recommended to adjust treatment plan.";
    return "Very severe disease activity. Urgent dermatological consultation advised.";
  }

  // Default recommendations
  if (normalizedScore < 20) return "Minimal symptoms detected. Continue monitoring and maintain current care routine.";
  if (normalizedScore < 40) return "Mild symptoms present. Consider discussing management options at your next appointment.";
  if (normalizedScore < 60) return "Moderate symptoms detected. Schedule an appointment to review your treatment plan.";
  if (normalizedScore < 80) return "Significant symptoms present. Prompt medical evaluation is recommended.";
  return "Severe symptoms detected. Please seek immediate medical attention.";
}