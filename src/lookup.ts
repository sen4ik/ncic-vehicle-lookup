import type { NcicLookup, NcicMapPair } from './types.js';

export function createLookup(pair: NcicMapPair): NcicLookup {
  return {
    getName(code: string): string | undefined {
      return pair.forward[code.toUpperCase()];
    },

    getCode(name: string): string | undefined {
      const upper = name.toUpperCase();
      // If the input is already a known NCIC code, return it as-is.
      // This makes code-in/code-out round-trip safe (e.g. getCode('GMC') → 'GMC')
      // and recovers codes that lose their reverse-map slot to a sibling whose
      // normalized name collides (e.g. 'GM' vs 'GMC' both normalize to 'GENERAL MOTORS').
      if (Object.prototype.hasOwnProperty.call(pair.forward, upper)) {
        return upper;
      }
      return pair.reverse[upper];
    },

    all(): Record<string, string> {
      return { ...pair.forward };
    },
  };
}
