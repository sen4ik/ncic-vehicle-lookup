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
