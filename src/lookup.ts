import type {
  NcicAlias,
  NcicLookup,
  NcicLookupOptions,
  NcicMapPair,
} from './types.js';

export function createLookup(
  pair: NcicMapPair,
  options: NcicLookupOptions = {}
): NcicLookup {
  const aliases = options.aliases ?? {};

  // Pre-compute code → displayName overrides so getName / all() are O(1).
  const displayOverrides: Record<string, string> = {};
  for (const alias of Object.values(aliases) as NcicAlias[]) {
    if (alias.displayName) {
      displayOverrides[alias.code.toUpperCase()] = alias.displayName;
    }
  }

  return {
    getName(code: string): string | undefined {
      const upper = code.toUpperCase();
      // Display-name override only applies when the code actually exists
      // in the underlying NIEM forward map; otherwise we'd return a name
      // for a code that getCode/all() don't know about.
      if (displayOverrides[upper] && pair.forward[upper]) {
        return displayOverrides[upper];
      }
      return pair.forward[upper];
    },

    getCode(name: string): string | undefined {
      const upper = name.toUpperCase();

      // 1. Input is already a known NCIC code → return it as-is. Makes
      //    code-in/code-out round-trips safe and recovers codes that lost
      //    their reverse-map slot to a sibling normalization collision
      //    (e.g. 'GM' losing to 'GMC' since both normalize to 'GENERAL MOTORS').
      if (Object.prototype.hasOwnProperty.call(pair.forward, upper)) {
        return upper;
      }

      // 2. Hand-curated alias overrides. Take precedence over the
      //    auto-generated reverse map so common typed names (e.g. 'McLaren',
      //    'Volkswagen', 'Mercedes-Benz') resolve even when the NIEM raw
      //    name is too messy for the build-time normalizer to recover.
      const alias = aliases[upper];
      if (alias) {
        return alias.code.toUpperCase();
      }

      // 3. Fall back to the auto-generated normalized-name reverse map.
      return pair.reverse[upper];
    },

    all(): Record<string, string> {
      const result: Record<string, string> = { ...pair.forward };
      // Apply display-name overrides so iteration matches getName output.
      for (const [code, displayName] of Object.entries(displayOverrides)) {
        if (code in result) {
          result[code] = displayName;
        }
      }
      return result;
    },
  };
}
