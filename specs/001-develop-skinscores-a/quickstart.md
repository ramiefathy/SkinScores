# QuickStart Guide: SkinScores Platform Enhancement

**Feature**: Role-based dashboards, batch assessments, population analytics, clinical alerts  
**Version**: 2.0.0  
**Last Updated**: 2025-01-06

## Prerequisites
- Node.js 18+ installed
- Modern browser (Chrome, Firefox, Safari, Edge)
- Test data set (provided in `/tests/fixtures/`)

## Quick Setup (5 minutes)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# In another terminal, run tests
npm run test:watch
```

## Feature Testing Checklist

### 1. Role Selection & Dashboard (2 minutes)
1. Open http://localhost:3000
2. Click "Select Your Role" button (top right)
3. Choose "Dermatology Resident"
4. Verify dashboard shows:
   - Learning resources widget
   - Recently used tools
   - Practice recommendations
5. Switch to "Research Coordinator" role
6. Verify dashboard updates to show:
   - Batch assessment tools
   - Study management
   - Export options

✓ **Success**: Dashboard changes based on selected role

### 2. Batch Assessment (5 minutes)
1. From Research Coordinator dashboard, click "New Batch Assessment"
2. Select "PASI" tool
3. Add 3 test patients:
   - Search and select existing patients
   - Or use "Add Test Patients" button
4. Set shared inputs:
   - Assessment type: "Baseline"
   - Study: "Test Study 001"
5. Click "Start Batch"
6. Complete assessment for Patient 1:
   - Fill in all required fields
   - Click "Save & Next"
7. Skip Patient 2 (click "Skip" with reason)
8. Complete Patient 3
9. Click "Complete Batch"

✓ **Success**: Batch shows 2/3 completed, results saved to patient timelines

### 3. Clinical Alerts (3 minutes)
1. Navigate to any patient's timeline
2. Click "Set Alert" button
3. Configure alert:
   - Tool: PASI
   - Condition: Score above 10
   - Enable notifications
4. Complete new PASI assessment with score > 10
5. Verify alert notification appears
6. Click notification to view details
7. Acknowledge with notes

✓ **Success**: Alert triggers and shows in notification center

### 4. Population Analytics (3 minutes)
1. Navigate to Analytics page (sidebar)
2. Select "PASI" tool
3. Set date range: Last 6 months
4. Click "Generate Analytics"
5. Verify displays:
   - Total patients assessed
   - Score distribution histogram
   - Severity breakdown pie chart
   - Improvement trend line
6. Click "Export" → "CSV"
7. Verify file downloads with data

✓ **Success**: Analytics generate and export correctly

### 5. Quick Entry Mode (2 minutes)
1. Select any tool (e.g., DLQI)
2. Press `Ctrl+Q` to enable quick entry
3. Verify compact form layout
4. Use keyboard navigation:
   - Tab between fields
   - Number keys for scores
   - Enter to advance
5. Complete assessment using keyboard only
6. Press `Ctrl+S` to save

✓ **Success**: Assessment completed without mouse

### 6. Voice Dictation (2 minutes)
1. Open any assessment tool
2. Click microphone icon on text field
3. Grant microphone permission if prompted
4. Speak: "Moderate erythema noted on dorsal surfaces"
5. Verify text appears in field
6. Click microphone to stop
7. Edit text if needed

✓ **Success**: Voice converted to text accurately

### 7. Assessment Templates (3 minutes)
1. Open "EASI" tool
2. Fill out typical initial assessment
3. Click "Save as Template"
4. Name: "Initial EASI Assessment"
5. Navigate away and return to EASI
6. Click "Use Template" → select your template
7. Verify fields pre-populated
8. Modify as needed and save

✓ **Success**: Template saves and loads correctly

## Common Test Scenarios

### Research Workflow
```typescript
// Complete workflow for research coordinator
1. Create study cohort (10 patients)
2. Run baseline batch assessment (PASI)
3. Wait/simulate 4 weeks
4. Run follow-up batch assessment
5. Generate analytics comparing baseline to follow-up
6. Export results for publication
```

### Clinical Workflow
```typescript
// Typical dermatologist workflow
1. Select patient
2. Use quick-entry PASI assessment
3. Set alert for PASI > 15
4. View 6-month progression chart
5. Generate patient report
6. Export for EMR
```

### Training Workflow
```typescript
// Resident learning workflow
1. Review educational resources on dashboard
2. Practice with sample patients
3. Compare scores with attending
4. Track personal assessment accuracy
5. Review feedback and tips
```

## Performance Benchmarks

All operations should complete within these times:
- Role switch: < 100ms
- Tool load: < 200ms
- Calculation: < 50ms
- Batch save: < 500ms per patient
- Analytics generation: < 2s for 1000 assessments
- Export: < 3s for 10,000 records

## Troubleshooting

### Role not persisting
- Check localStorage: `skinscores_current_role`
- Clear cache and reload

### Voice dictation not working
- Verify HTTPS (required for Web Speech API)
- Check browser compatibility
- Test microphone permissions

### Batch assessment stuck
- Check browser console for errors
- Verify all patients have valid IDs
- Try with smaller batch (< 50 patients)

### Analytics not loading
- Check date range has data
- Verify tool has assessments
- Try shorter date range first

## API Testing

### Contract Tests
```bash
# Run contract tests to verify interfaces
npm run test:contracts

# Run specific contract test
npm run test -- user-role-contract.test.ts
```

### Integration Tests
```bash
# Full feature integration tests
npm run test:integration

# E2E tests with Playwright
npm run test:e2e
```

## Data Requirements

### Test Patient Data
Located in `/tests/fixtures/patients.json`:
- 100 test patients with demographics
- 500 historical assessments
- Various tools and time ranges

### Sample Assessments
Located in `/tests/fixtures/assessments/`:
- PASI scores ranging 0-72
- DLQI scores ranging 0-30
- Multiple assessment tools
- 6 months of data per patient

## Success Criteria

✅ All role dashboards load correctly  
✅ Batch assessment processes 50+ patients  
✅ Alerts trigger within 1 minute  
✅ Analytics handle 1000+ assessments  
✅ Quick entry reduces time by 50%  
✅ Voice dictation accuracy > 90%  
✅ Templates save 30+ seconds per assessment  
✅ All exports open in target applications  

## Next Steps

After verifying all features:
1. Run full test suite: `npm run test`
2. Check accessibility: `npm run test:a11y`
3. Verify mobile responsiveness
4. Test with real clinical data (de-identified)
5. Gather user feedback
6. Deploy to staging environment

## Support

- Documentation: `/docs/features/v2.0/`
- Issues: Create ticket with feature tag
- Questions: Contact development team

---

🎉 **Congratulations!** You've successfully tested all new SkinScores v2.0 features!