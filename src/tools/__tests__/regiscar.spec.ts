import { describe, it, expect } from 'vitest';
import { regiscarCompute } from '../regiscar.full';

describe('RegiSCAR', () => {
  it('definite example', () => {
    const r = regiscarCompute({
      fever:'yes', lymphadenopathy:'yes', atypicalLymphocytes:'yes', eosinophilia:'marked',
      skinExtent50:'yes', skinFeatures2of4:'yes', biopsySuggestive:'yes', organInvolvement:'two_or_more',
      resolutionGT15d:'yes', altDxExcluded:'yes'
    });
    expect(r.score).toBeGreaterThan(5);
    expect(r.category).toBe('definite');
  });
  it('no case example', () => {
    const r = regiscarCompute({
      fever:'no', lymphadenopathy:'no', atypicalLymphocytes:'no', eosinophilia:'none',
      skinExtent50:'no', skinFeatures2of4:'no', biopsySuggestive:'no', organInvolvement:'none',
      resolutionGT15d:'no', altDxExcluded:'no'
    });
    expect(r.score).toBeLessThan(2);
    expect(r.category).toBe('no');
  });
});
