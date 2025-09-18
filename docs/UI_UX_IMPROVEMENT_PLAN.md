# SkinScores UI/UX Improvement Plan & Implementation Guide

## Overview

This document serves as a comprehensive checklist and implementation guide for enhancing the SkinScores application's user interface and experience. Each section includes current implementation details, technical requirements, and specific action items.

Last Updated: 2025-01-17

---

## 1. Navigation & Information Architecture 🧭

### Current Implementation

- **Header Component**: `/src/components/layout/AppShell.tsx`
  - Uses MUI AppBar with sticky positioning
  - Contains "Browse Tools" dropdown menu
  - Sign In button in top right
  - Tool categories loaded from `useToolsMetadata()` hook
- **Routing**: React Router v6 in `/src/main.tsx`
  - Routes: `/`, `/library`, `/calculators/:slug`, `/auth/*`, `/dashboard`, `/patients`
- **State Management**: Zustand stores in `/src/stores/`
  - No current implementation for search history or favorites

### Improvements Checklist

#### [ ] 1.1 Global Search Bar

**Technical Requirements:**

- Create `/src/components/search/GlobalSearch.tsx`
- Implement search index using Fuse.js or similar
- Add to AppShell header (always visible)
- Integrate with `tool-metadata.ts` for searchable content
- Store search history in localStorage or Firestore

**Implementation Details:**

```typescript
// Search should query:
- tool.name
- tool.description
- tool.keywords[]
- tool.condition
- tool.acronym (if exists)
```

**Dependencies to add:**

```json
"fuse.js": "^7.0.0"  // For fuzzy search
```

#### [ ] 1.2 Quick Access Toolbar

**Files to modify:**

- `/src/components/layout/AppShell.tsx` - Add toolbar section
- Create `/src/components/navigation/QuickAccessBar.tsx`
- Create `/src/hooks/useRecentTools.ts` - Track tool usage
- Create `/src/hooks/useFavorites.ts` - Manage favorites

**Data Structure:**

```typescript
interface QuickAccessData {
  recentTools: Array<{
    toolId: string;
    lastUsed: Date;
    useCount: number;
  }>;
  favorites: string[]; // tool IDs
}
```

#### [ ] 1.3 Breadcrumb Navigation

**Implementation:**

- Create `/src/components/navigation/Breadcrumbs.tsx`
- Add to layout wrapper in `AppShell.tsx`
- Use `useLocation()` and `useParams()` from React Router
- Map routes to human-readable labels

---

## 2. Library Page Enhancements 📚

### Current Implementation

- **Component**: `/src/routes/library/LibraryPage.tsx`
- **Tool Card**: `/src/components/tools/ToolCard.tsx`
- Uses MUI Grid layout with responsive breakpoints
- Basic search with `useState` (client-side filtering)
- Category filter chips at top
- Cards show: name, condition, description, keywords

### Improvements Checklist

#### [ ] 2.1 Enhanced Tool Cards

**Files to modify:**

- `/src/components/tools/ToolCard.tsx`

**Add to ToolCard:**

```typescript
interface EnhancedToolCardProps extends ToolCardProps {
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  popularity: number; // usage count
  categoryColor: string;
  categoryIcon: ReactNode;
}
```

**Visual enhancements:**

- Add complexity badge (top-right corner)
- Time estimate (e.g., "~5 min")
- Usage indicator (bar or number)
- Category color as left border (4px)
- Hover state with transform and shadow (already implemented)
- Quick preview tooltip on info icon

#### [ ] 2.2 Advanced Filtering System

**Create new components:**

- `/src/components/filters/ToolFilters.tsx`
- `/src/components/filters/FilterChip.tsx`
- `/src/hooks/useToolFilters.ts`

**Filter state structure:**

```typescript
interface ToolFilters {
  categories: string[];
  complexity: ('basic' | 'intermediate' | 'advanced')[];
  timeRange: { min: number; max: number };
  specialties: string[];
  searchQuery: string;
  sortBy: 'name' | 'popularity' | 'newest' | 'complexity';
}
```

**Update LibraryPage.tsx:**

- Replace simple category state with comprehensive filter state
- Add filter panel (collapsible on mobile)
- Persist filters in URL params for shareable links

#### [ ] 2.3 View Options

**Implementation:**

- Add view toggle buttons (Grid/List/Grouped)
- Create `/src/components/tools/ToolList.tsx` for list view
- Create `/src/components/tools/ToolsGrouped.tsx` for category groups
- Store view preference in localStorage

**List View Requirements:**

- Compact design (single row per tool)
- Show: Icon | Name | Category | Complexity | Time | Action Button
- Mobile: Stack elements vertically

#### [ ] 2.4 Smart Recommendations

**Backend Requirements:**

- Track tool usage in Firestore
- Create Cloud Function to calculate associations
- Return related tools based on co-usage patterns

**Frontend Implementation:**

- Add "Related Tools" section to ToolCard
- Create `/src/components/recommendations/RelatedTools.tsx`
- Use React Query for caching recommendations

---

## 3. Calculator Page Improvements 🧮

### Current Implementation

- **Component**: `/src/routes/calculators/CalculatorRunnerPage.tsx`
- Uses React Hook Form with Zod validation
- Renders inputs dynamically based on tool schema
- Basic result display with score, interpretation, and details
- Error boundary wrapper for calculation safety

### Improvements Checklist

#### [ ] 3.1 Enhanced Form Experience

**Group Related Inputs:**

```typescript
// Add to tool schema:
interface InputGroup {
  id: string;
  label: string;
  description?: string;
  inputs: string[]; // input IDs
  collapsible?: boolean;
  defaultExpanded?: boolean;
}
```

**Files to modify:**

- Update `/src/tools/types.ts` to include groups
- Create `/src/components/forms/InputGroup.tsx`
- Modify `CalculatorRunnerPage.tsx` to render groups

**Auto-save Implementation:**

- Use `useDebounce` hook
- Save to localStorage with key: `draft_${toolId}_${userId}`
- Add "Restore draft" banner when draft exists

#### [ ] 3.2 Visual Input Helpers

**Range Sliders:**

- Create `/src/components/forms/RangeSlider.tsx`
- Add visual markers and labels
- Show current value in tooltip

**Image References:**

- Create `/src/components/forms/ImageReference.tsx`
- Store images in `/public/images/tools/`
- Add `imageRef` field to input schema

**Body Maps:**

- Integrate SVG body map library
- Create `/src/components/forms/BodyMapInput.tsx`
- Store selections as coordinate arrays

**Dependencies:**

```json
"react-body-highlighter": "^2.0.0"  // Or similar
```

#### [ ] 3.3 Results Enhancement

**Visual Components to Create:**

- `/src/components/results/ScoreGauge.tsx` - Circular progress indicator
- `/src/components/results/ScoreChart.tsx` - Bar/line charts
- `/src/components/results/ResultsExport.tsx` - PDF/clipboard export
- `/src/components/results/ScoreHistory.tsx` - Previous calculations

**Export Implementation:**

```typescript
// PDF generation
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Add export formats:
- PDF with hospital branding
- Markdown for EMR systems
- CSV for data analysis
- Direct print styling
```

---

## 4. User Onboarding & Guidance 🎯

### Current Implementation

- No onboarding system
- No contextual help
- Basic text descriptions in tool metadata

### Improvements Checklist

#### [ ] 4.1 Interactive Welcome Tour

**Implementation:**

- Use `react-joyride` or similar
- Create `/src/components/onboarding/WelcomeTour.tsx`
- Store completion in user preferences
- Trigger on first visit or via help menu

**Tour Steps:**

1. Welcome to SkinScores
2. Browse tools by category
3. Search for specific conditions
4. Save favorites for quick access
5. View calculation history
6. Export and share results

#### [ ] 4.2 Contextual Help System

**Components to Create:**

- `/src/components/help/HelpTooltip.tsx`
- `/src/components/help/VideoModal.tsx`
- `/src/components/help/ExampleCase.tsx`

**Help Content Structure:**

```typescript
interface HelpContent {
  inputId: string;
  tooltip: string;
  extendedHelp?: string;
  videoUrl?: string;
  examples?: Array<{
    label: string;
    value: any;
    explanation: string;
  }>;
  clinicalPearl?: string;
}
```

#### [ ] 4.3 Tool Templates

**Implementation:**

- Add `templates` array to tool metadata
- Create `/src/components/templates/TemplateSelector.tsx`
- Pre-fill form with template values
- Show template description

---

## 5. Personalization & Workflow 👤

### Current Implementation

- Basic auth with Firebase Auth
- User profile in Firestore
- Saved calculations in `/calculations` collection
- No personalization features

### Improvements Checklist

#### [ ] 5.1 User Dashboard

**Create new route:** `/src/routes/dashboard/EnhancedDashboard.tsx`

**Dashboard Widgets:**

```typescript
- RecentCalculations: Last 10 with patient info
- FavoriteTools: Grid of starred tools
- UsageStatistics: Chart of tool usage over time
- QuickActions: Common workflows
- Notifications: Updates and alerts
```

**Data Requirements:**

- Extend user profile schema
- Track all tool interactions
- Calculate usage statistics in Cloud Functions

#### [ ] 5.2 Custom Workflows

**New Features:**

- Workflow builder UI
- `/src/components/workflows/WorkflowBuilder.tsx`
- Drag-and-drop tool sequencing
- Conditional logic between tools
- Save and share workflows

**Workflow Schema:**

```typescript
interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    toolId: string;
    config?: Record<string, any>;
    conditions?: Array<{
      field: string;
      operator: '>' | '<' | '=' | 'contains';
      value: any;
      nextStep: string;
    }>;
  }>;
  sharedWith: string[]; // user IDs
}
```

#### [ ] 5.3 Collaboration Features

**Implementation:**

- Share calculations via unique URL
- Create `/src/routes/shared/SharedCalculation.tsx`
- Add permissions system
- Team workspace in Firestore

---

## 6. Mobile Experience 📱

### Current Implementation

- Responsive design with MUI breakpoints
- Basic mobile menu (hamburger)
- Cards stack vertically on mobile
- No mobile-specific optimizations

### Improvements Checklist

#### [ ] 6.1 Mobile-First Calculator Design

**Step-by-step Forms:**

- Create `/src/components/forms/SteppedForm.tsx`
- One question per screen on mobile
- Progress indicator at top
- Swipe between steps
- Review screen before submission

**Implementation:**

```typescript
const isMobile = useMediaQuery('(max-width: 600px)');
if (isMobile) {
  return <SteppedForm inputs={inputs} />;
}
```

#### [ ] 6.2 Offline Capability

**PWA Implementation:**

- Add service worker
- Create `/public/manifest.json`
- Cache tool metadata and common assets
- Queue calculations for sync

**Workbox Config:**

```javascript
// workbox-config.js
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,jpg,json}'],
  swDest: 'dist/sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
      },
    },
  ],
};
```

#### [ ] 6.3 Native App Features

**Consider:**

- Capacitor for native wrapping
- Biometric auth via WebAuthn
- Camera access for skin lesions
- Push notifications via FCM

---

## 7. Visual Design Enhancements 🎨

### Current Implementation

- Paper shaders via `@paper-design/shaders-react`
- Purple (#6B4C8A) and terracotta (#D4826A) theme
- Material-UI components
- Basic hover states

### Improvements Checklist

#### [ ] 7.1 Micro-animations

**Add Framer Motion animations:**

```typescript
// Install: "framer-motion": "^11.0.0"

// Page transitions
// List item stagger
// Success checkmark animation
// Error shake animation
// Skeleton loading states
```

#### [ ] 7.2 Data Visualization

**Chart Library:**

```json
"recharts": "^2.10.0"  // or "visx": "^3.0.0"
```

**Visualization Components:**

- `/src/components/charts/TrendChart.tsx`
- `/src/components/charts/ComparisonChart.tsx`
- `/src/components/charts/DistributionChart.tsx`

#### [ ] 7.3 Iconography System

**Icon Requirements:**

- Consistent size (24px default)
- Category-specific icons
- Status indicators (success/warning/error)
- Create icon manifest

**Implementation:**

```typescript
// /src/constants/icons.ts
export const CATEGORY_ICONS = {
  'Psoriasis': <PsoriasisIcon />,
  'Eczema': <EczemaIcon />,
  // ... etc
};
```

---

## 8. Performance & Reliability ⚡

### Current Implementation

- Lazy loading for tool modules
- React Query for data caching
- Error boundaries on calculations
- Basic loading states

### Improvements Checklist

#### [ ] 8.1 Speed Optimizations

**Search Optimization:**

- Debounce search input (300ms)
- Build search index on app load
- Use Web Workers for heavy computations

**Code Splitting:**

- Split by route
- Split large tool calculations
- Preload on hover/intent

#### [ ] 8.2 Error Handling

**Comprehensive Error System:**

- Global error boundary
- Contextual error messages
- Retry mechanisms
- Error reporting to Sentry

**Error Message Patterns:**

```typescript
interface ErrorMessage {
  title: string;
  description: string;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
  technical?: string; // For developers
}
```

#### [ ] 8.3 Analytics Integration

**Google Analytics 4:**

```typescript
// Track:
- Page views
- Tool usage
- Search queries
- Error events
- Performance metrics
```

**Custom Events:**

```typescript
gtag('event', 'calculate_tool', {
  tool_id: toolId,
  tool_name: toolName,
  category: category,
  completion_time: timeInSeconds,
});
```

---

## 9. Clinical Integration 🏥

### Current Implementation

- Basic result display
- No integration capabilities
- Manual export only

### Improvements Checklist

#### [ ] 9.1 EMR Integration Prep

**FHIR Resources:**

```typescript
// Create FHIR Observation for results
interface FHIRObservation {
  resourceType: 'Observation';
  status: 'final';
  code: CodeableConcept;
  subject: Reference;
  effectiveDateTime: string;
  valueQuantity: Quantity;
  interpretation: CodeableConcept[];
}
```

**Implementation Files:**

- `/src/utils/fhir/` - FHIR utilities
- `/src/api/hl7/` - HL7 message formatting

#### [ ] 9.2 Clinical Decision Support

**Alert System:**

```typescript
interface ClinicalAlert {
  severity: 'info' | 'warning' | 'critical';
  message: string;
  evidenceLink?: string;
  recommendedAction?: string;
}
```

**Implementation:**

- Add alert thresholds to tool metadata
- Create `/src/components/alerts/ClinicalAlert.tsx`
- Link to guidelines and evidence

#### [ ] 9.3 Documentation Helpers

**Note Generation:**

- Create `/src/utils/clinicalNotes.ts`
- Generate structured notes
- Include ICD-10/CPT codes
- Customizable templates

---

## 10. Community & Learning 🤝

### Current Implementation

- Static tool descriptions
- Reference links only
- No community features

### Improvements Checklist

#### [ ] 10.1 Knowledge Base

**Content Structure:**

```typescript
interface KnowledgeArticle {
  id: string;
  toolId: string;
  title: string;
  content: string; // Markdown
  type: 'methodology' | 'clinical-pearl' | 'case-study';
  author: string;
  reviewedBy: string[];
  updatedAt: Date;
}
```

**Implementation:**

- Create `/src/routes/knowledge/` section
- Use MDX for rich content
- Link from tool pages

#### [ ] 10.2 Community Features

**Components:**

- `/src/components/community/ToolRating.tsx`
- `/src/components/community/CommentThread.tsx`
- `/src/components/community/SuggestImprovement.tsx`

**Moderation:**

- Flag inappropriate content
- Verified clinician badges
- Community guidelines

#### [ ] 10.3 Educational Content

**CME Integration:**

- Track time spent
- Quiz assessments
- Certificate generation
- Progress tracking

---

## Technical Dependencies Summary

### New NPM Packages Needed

```json
{
  "dependencies": {
    "fuse.js": "^7.0.0",
    "recharts": "^2.10.0",
    "react-joyride": "^2.8.0",
    "framer-motion": "^11.0.0",
    "jspdf": "^2.5.0",
    "html2canvas": "^1.4.0",
    "react-markdown": "^9.0.0",
    "@mdx-js/react": "^3.0.0",
    "workbox-webpack-plugin": "^7.0.0"
  }
}
```

### Firebase Services to Configure

- Firestore indexes for:
  - Tool usage queries
  - Search optimization
  - Workflow queries
- Cloud Functions for:
  - Usage analytics aggregation
  - Recommendation engine
  - Export generation
- Firebase Storage for:
  - Image references
  - Generated PDFs
  - Video content

### Environment Variables Needed

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://...
VITE_API_ENDPOINT=https://api.skinscores.com
VITE_FHIR_SERVER=https://fhir.skinscores.com
```

---

## Implementation Priority

### Phase 1 (Immediate Impact)

1. Global search bar
2. Enhanced tool cards
3. Advanced filtering
4. Visual input helpers

### Phase 2 (User Engagement)

1. User dashboard
2. Favorites system
3. Mobile optimizations
4. Results visualization

### Phase 3 (Clinical Value)

1. EMR integration prep
2. Clinical alerts
3. Documentation helpers
4. Offline capability

### Phase 4 (Community)

1. Knowledge base
2. Community features
3. Educational content
4. Analytics dashboard

---

## Notes for Developers

1. **State Management**: Consider migrating from Zustand to Redux Toolkit for complex state
2. **Testing**: Add Playwright E2E tests for critical user flows
3. **Performance**: Monitor bundle size, implement performance budgets
4. **Accessibility**: Ensure all new components meet WCAG 2.1 AA standards
5. **Documentation**: Update Storybook stories for new components
6. **Security**: Audit all user inputs, implement CSP headers
7. **Monitoring**: Set up error tracking and performance monitoring

---

This document should be updated as features are implemented. Each checkbox represents a discrete unit of work that can be assigned and tracked.
