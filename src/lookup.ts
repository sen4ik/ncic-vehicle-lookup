import type { NcicLookup, NcicMapPair } from './types.js';

export function createLookup(pair: NcicMapPair): NcicLookup {
  return {
    getName(code: string): string | undefined {
      return pair.forward[code.toUpperCase()];
    },

    getCode(name: string): string | undefined {
      return pair.reverse[name.toUpperCase()];
    },

    all(): Record<string, string> {
      return { ...pair.forward };
    },
  };
}
