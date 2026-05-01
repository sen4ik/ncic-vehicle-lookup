export interface NcicLookup {
  /**
   * Returns the full name for an NCIC code, or undefined if not found.
   * Case-insensitive: getName('niss') === getName('NISS')
   */
  getName(code: string): string | undefined;

  /**
   * Returns the NCIC code for a name, or undefined if not found.
   * Case-insensitive. Matches against normalized names (corporate
   * suffixes and parentheticals stripped from NIEM source).
   * getCode('Nissan') === getCode('NISSAN') → 'NISS'
   *
   * If the input is already a valid NCIC code, it is returned as-is
   * (uppercased): getCode('gmc') → 'GMC'. This makes the call
   * round-trip safe when callers pass either a name or a code.
   */
  getCode(name: string): string | undefined;

  /**
   * Returns the full forward map: code → name.
   */
  all(): Record<string, string>;
}

/** Internal data structure stored in src/data/ncic-vehicle.ts */
export interface NcicVehicleData {
  VMA: NcicMapPair;
  VMO: NcicMapPair;
  VCO: NcicMapPair;
  VST: NcicMapPair;
}

export interface NcicMapPair {
  /** NCIC code → full NIEM name */
  forward: Record<string, string>;
  /** Normalized name → NCIC code */
  reverse: Record<string, string>;
}

/**
 * A hand-curated alias entry. Routes a user-friendly name (the map key)
 * to a specific NCIC code and, optionally, overrides the messy NIEM
 * display name returned by getName for that code.
 */
export interface NcicAlias {
  /** NCIC code this alias resolves to. Will be uppercased on use. */
  code: string;
  /**
   * Optional clean display name. When set, getName(code) and all()[code]
   * return this string instead of the raw NIEM forward-map value.
   */
  displayName?: string;
}

/** Optional extras passed to createLookup. */
export interface NcicLookupOptions {
  /**
   * Map of UPPERCASE name → alias. Consulted by getCode after the
   * code-passthrough check but before the auto-generated reverse map.
   * Keys MUST be uppercase; the input to getCode is uppercased before
   * the lookup. Aliases that supply a displayName also affect getName
   * and all() for the target code.
   */
  aliases?: Record<string, NcicAlias>;
}
