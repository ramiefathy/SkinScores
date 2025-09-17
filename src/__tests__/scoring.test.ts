import { describe, expect, it } from 'vitest';
import { computeScore, type TemplateData } from '../../functions/src/index';
const templateData: TemplateData = {
  name: 'Braden Scale',
  slug: 'braden-scale',
  category: 'Pressure Injury Risk',
  version: '1.0.0',
  description:
    'Assesses risk for pressure injuries across six subscales with a total score of 6-23.',
  citation:
    'Bergstrom N et al. The Braden Scale for Predicting Pressure Sore Risk. Nurs Res. 1987;36(4):205-210.',
  inputs: [
    {
      id: 'sensoryPerception',
      label: 'Sensory perception',
      type: 'select',
      required: true,
      options: [
        { value: 'completely-limited', label: 'Completely limited', score: 1 },
        { value: 'very-limited', label: 'Very limited', score: 2 },
        { value: 'slightly-limited', label: 'Slightly limited', score: 3 },
        { value: 'no-impairment', label: 'No impairment', score: 4 },
      ],
    },
    {
      id: 'moisture',
      label: 'Moisture',
      type: 'select',
      required: true,
      options: [
        { value: 'constantly', label: 'Skin constantly moist', score: 1 },
        { value: 'often', label: 'Skin often moist', score: 2 },
        { value: 'occasionally', label: 'Skin occasionally moist', score: 3 },
        { value: 'rarely', label: 'Skin rarely moist', score: 4 },
      ],
    },
    {
      id: 'activity',
      label: 'Activity',
      type: 'select',
      required: true,
      options: [
        { value: 'bedfast', label: 'Bedfast', score: 1 },
        { value: 'chairfast', label: 'Chairfast', score: 2 },
        { value: 'walks-occasionally', label: 'Walks occasionally', score: 3 },
        { value: 'walks-frequently', label: 'Walks frequently', score: 4 },
      ],
    },
    {
      id: 'mobility',
      label: 'Mobility',
      type: 'select',
      required: true,
      options: [
        { value: 'completely-immobile', label: 'Completely immobile', score: 1 },
        { value: 'very-limited', label: 'Very limited', score: 2 },
        { value: 'slightly-limited', label: 'Slightly limited', score: 3 },
        { value: 'no-limitations', label: 'No limitations', score: 4 },
      ],
    },
    {
      id: 'nutrition',
      label: 'Nutrition',
      type: 'select',
      required: true,
      options: [
        { value: 'very-poor', label: 'Very poor', score: 1 },
        { value: 'probably-inadequate', label: 'Probably inadequate', score: 2 },
        { value: 'adequate', label: 'Adequate', score: 3 },
        { value: 'excellent', label: 'Excellent', score: 4 },
      ],
    },
    {
      id: 'frictionShear',
      label: 'Friction and shear',
      type: 'select',
      required: true,
      options: [
        { value: 'problem', label: 'Problem', score: 1 },
        { value: 'potential-problem', label: 'Potential problem', score: 2 },
        { value: 'no-apparent-problem', label: 'No apparent problem', score: 3 },
      ],
    },
  ],
  interpretation: {
    summaryTemplate: 'Total Braden score {{score}} indicating {{interpretationLabel}} risk.',
    ranges: [
      { min: 19, max: 23, label: 'No risk', guidance: 'Continue routine prevention strategies.' },
      {
        min: 15,
        max: 18,
        label: 'Mild risk',
        guidance: 'Reassess positioning schedule and moisture management.',
      },
      {
        min: 13,
        max: 14,
        label: 'Moderate risk',
        guidance: 'Increase protective surfaces and monitor skin every shift.',
      },
      {
        min: 10,
        max: 12,
        label: 'High risk',
        guidance: 'Implement aggressive prevention bundle and consider specialty mattress.',
      },
      {
        min: 6,
        max: 9,
        label: 'Very high risk',
        guidance: 'Maximize pressure redistribution and reassess every 4 hours.',
      },
    ],
  },
  copyBlocks: [
    {
      label: 'Clinical summary',
      bodyTemplate:
        'Braden Scale total {{score}} ({{interpretationLabel}} risk). {{interpretationSummary}}',
    },
  ],
};

describe('computeScore', () => {
  it('calculates total score for Braden Scale inputs', () => {
    const result = computeScore(templateData, {
      sensoryPerception: 'slightly-limited',
      moisture: 'occasionally',
      activity: 'walks-occasionally',
      mobility: 'slightly-limited',
      nutrition: 'adequate',
      frictionShear: 'no-apparent-problem',
    });
    expect(result.totalScore).toBe(3 + 3 + 3 + 3 + 3 + 3);
  });

  it('throws error when required input missing', () => {
    expect(() => computeScore(templateData, {})).toThrowError(/Missing required input/);
  });
});
