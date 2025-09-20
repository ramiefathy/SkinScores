import { describe, it, expect } from 'vitest';
import { aldenCompute } from '../alden.full';

describe('ALDEN', () => {
  it('very probable example', () => {
    const r = aldenCompute({
      delayCategory:'suggestive',
      drugPresent:'definite',
      prechallenge:'pos_specific_drug_disease',
      dechallenge:'drug_stopped',
      notoriety:'strongly_associated',
      otherCauses:'none'
    });
    expect(r.score).toBeGreaterThanOrEqual(6);
    expect(r.category).toBe('very probable');
  });
  it('very unlikely example', () => {
    const r = aldenCompute({
      delayCategory:'excluded',
      drugPresent:'excluded',
      prechallenge:'negative',
      dechallenge:'continued_or_unknown',
      notoriety:'not_suspected',
      otherCauses:'present_intermediate_or_higher'
    });
    expect(r.score).toBeLessThan(0);
    expect(r.category).toBe('very unlikely');
  });
});
