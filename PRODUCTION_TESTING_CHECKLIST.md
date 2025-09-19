# Production Testing Checklist for New Tools
**Date:** September 19, 2025
**Version:** v2.1.0
**Production URL:** https://skinscore-afw5a.web.app/

## 🔍 Testing Instructions

For each tool, verify:
1. Tool loads without errors
2. All form fields accept input correctly
3. Validation works (try invalid inputs)
4. Calculation produces correct results
5. Results display with proper formatting
6. Save functionality works (if logged in)

---

## ✅ Tool Testing Checklist

### 1. **RegiSCAR** (DRESS Validation Score)
**URL:** `/calculators/regiscar`
- [ ] Select "No" for Fever (-1 point)
- [ ] Select "Yes" for Lymph Nodes (+1 point)
- [ ] Select highest Eosinophilia option (+2 points)
- [ ] Select "Yes" for Atypical Lymphocytes (+1 point)
- [ ] Select "Rash ≥50% BSA" (+1 point)
- [ ] Select "At least 2 of..." for Rash Morphology (+1 point)
- [ ] Select "Suggestive of DRESS" for Biopsy (+1 point)
- [ ] Select "Two or more organs" (+1 point)
- [ ] Select "≥15 days" for Resolution (0 points)
- [ ] Select "Other patterns" for Exclusions (0 points)
- **Expected Total:** 7 points (Definite DRESS)

### 2. **ALDEN** (Drug Causality Algorithm)
**URL:** `/calculators/alden`
- [ ] Time Delay: Select "5-28 days" (+3 points)
- [ ] Drug Present: Select "Drug continued" (-3 points)
- [ ] Prechallenge: Select "Same drug in past tolerated" (-2 points)
- [ ] Dechallenge: Select "Not stopped or unknown" (0 points)
- [ ] Drug Notoriety: Select "Previously known association" (+3 points)
- [ ] Other Causes: Select "≥1 other cause equally likely" (-1 point)
- **Expected Total:** 0 points (Possible)

### 3. **AECT** (Angioedema Control Test)
**URL:** `/calculators/aect`
- [ ] Frequency: Select "3 times" (score 3)
- [ ] Unpredictability: Select "Quite a bit" (score 2)
- [ ] Control: Select "Somewhat" (score 3)
- [ ] Activities: Select "A little" (score 4)
- **Expected Total:** 12/16 (Well-controlled)

### 4. **AAS-28** (28-Day Angioedema Activity)
**URL:** `/calculators/aas28`
- [ ] Day 1: Set all to score 2 (moderate)
- [ ] Day 2: Set all to score 1 (mild)
- [ ] Day 3-28: Leave at 0
- [ ] Verify scrolling through all 28 days works
- **Expected Total:** 15 points (Mild Disease Activity)

### 5. **EBDASI** (Epidermolysis Bullosa)
**URL:** `/calculators/ebdasi`
- [ ] Head Activity: Erosions 2, Blisters 1, Lesions 1
- [ ] Head Damage: Scarring 1, Atrophy 1, Dyspigmentation 1
- [ ] Test at least 3 different body regions
- [ ] Verify Activity and Damage scores calculate separately
- **Expected:** Activity ~10-15, Damage ~5-10

### 6. **Ferriman-Gallwey** (Hirsutism Score)
**URL:** `/calculators/ferrimanGallwey`
- [ ] Upper Lip: Score 2
- [ ] Chin: Score 3
- [ ] Chest: Score 1
- [ ] Upper Abdomen: Score 1
- [ ] Lower Abdomen: Score 2
- [ ] Upper Arms: Score 0
- [ ] Thighs: Score 1
- [ ] Upper Back: Score 1
- [ ] Lower Back: Score 2
- **Expected Total:** 13/36 (Moderate Hirsutism)

### 7. **HDSS** (Hyperhidrosis Severity)
**URL:** `/calculators/hdss`
- [ ] Select Score 1: "Never noticeable, never interferes"
- [ ] Verify interpretation shows "Mild/Normal"
- [ ] Select Score 3: "Barely tolerable, frequently interferes"
- [ ] Verify interpretation shows "Severe Hyperhidrosis"
- [ ] Select Score 4: "Intolerable, always interferes"
- [ ] Verify interpretation shows "Very Severe"

### 8. **OSI** (Onychomycosis Severity Index)
**URL:** `/calculators/osi`
- [ ] Area: Select "26-50%" (score 3)
- [ ] Proximity: Select "Proximal 1/3 to 2/3" (score 3)
- [ ] Dermatophytoma: Check box (+10 points)
- [ ] Subungual Hyperkeratosis >2mm: Check box (+1 point)
- **Expected Total:** 20 points (Moderate-Severe)

### 9. **POSAS v2.0** (Scar Assessment)
**URL:** `/calculators/posas`
- [ ] **Observer Scale:** Set all 6 parameters to score 5
- [ ] Verify Observer Total: 30/60
- [ ] **Patient Scale:** Set all 6 parameters to score 7
- [ ] Verify Patient Total: 42/60
- [ ] **Expected Combined:** 72/120

### 10. **Vancouver Scar Scale**
**URL:** `/calculators/vancouverScar`
- [ ] Pigmentation: Select "Hyperpigmentation" (2)
- [ ] Vascularity: Select "Red" (2)
- [ ] Pliability: Select "Firm" (3)
- [ ] Height: Select "2-5mm" (2)
- **Expected Total:** 9/13 (Severe scarring)

### 11. **Leeds Revised** (Acne Grading)
**URL:** `/calculators/leedsRevised`
- [ ] Facial Grade: Select Grade 6
- [ ] Back Grade: Select Grade 4
- [ ] Chest Grade: Select Grade 3
- [ ] Lesion Type: Select "Inflammatory"
- **Expected:** Moderate acne, treatment recommendations

### 12. **MDA** (Minimal Disease Activity - PsA)
**URL:** `/calculators/mdaPsa`
- [ ] Tender Joints: Enter 1
- [ ] Swollen Joints: Enter 0
- [ ] PASI Score: Enter 0.5
- [ ] BSA %: Enter 2
- [ ] Patient Pain VAS: Enter 10
- [ ] Patient Global VAS: Enter 15
- [ ] HAQ-DI: Enter 0.4
- [ ] Entheseal Points: Enter 1
- **Expected:** 6/7 criteria met (MDA Achieved)

---

## 🧪 Edge Case Testing

### Validation Testing
- [ ] Try submitting each form with empty required fields
- [ ] Enter out-of-range numbers where applicable
- [ ] Test decimal inputs where allowed (e.g., PASI, HAQ-DI)

### Calculation Edge Cases
- [ ] Test minimum scores (all zeros/lowest options)
- [ ] Test maximum scores (all highest options)
- [ ] Test negative scores where applicable (ALDEN, RegiSCAR)

### UI/UX Testing
- [ ] Test on mobile device (responsive layout)
- [ ] Test keyboard navigation (Tab through fields)
- [ ] Test browser back/forward buttons
- [ ] Test page refresh (form state persistence)

---

## 📊 Performance Testing

- [ ] Tool loads within 2 seconds
- [ ] Form submission responds within 1 second
- [ ] No console errors in browser DevTools
- [ ] Memory usage stable (no leaks)

---

## 🔐 Security Testing

- [ ] XSS: Try entering `<script>alert('test')</script>` in text fields
- [ ] SQL Injection: Not applicable (NoSQL database)
- [ ] Input sanitization working correctly
- [ ] HTTPS enforced on production

---

## 📝 Regression Testing

### Previously Working Tools to Spot Check
- [ ] PASI - Basic calculation still works
- [ ] EASI - Responder criteria display correctly
- [ ] SCORAD - Objective SCORAD calculation works
- [ ] mSWAT - Formula displays correctly

---

## 🚨 Critical Issues to Report

If any of these occur, report immediately:
1. **Calculation Errors:** Results don't match expected values
2. **Form Submission Failures:** "Submit" doesn't work
3. **Data Loss:** Entered values disappear unexpectedly
4. **Display Issues:** Results not showing or formatting broken
5. **Validation Bypass:** Can submit invalid data
6. **Console Errors:** Red errors in browser console

---

## 📋 Testing Sign-off

**Tester Name:** ___________________________

**Date Tested:** ___________________________

**Environment:**
- [ ] Production (https://skinscore-afw5a.web.app/)
- [ ] Preview (specify URL: _______________)

**Browser/Device:**
- Browser: ___________________________
- Version: ___________________________
- Device: ___________________________
- OS: ___________________________

**Overall Status:**
- [ ] All tests passing - Ready for production
- [ ] Issues found - See notes below

**Notes/Issues Found:**
```
[Document any issues here]
```

---

*This checklist should be completed after each deployment of new tools to production.*