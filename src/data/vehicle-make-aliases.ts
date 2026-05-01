import type { NcicAlias } from '../types.js';

/**
 * Hand-curated aliases for common vehicle makes whose NIEM raw names are
 * too messy for the build-time normalizer to recover (combo strings,
 * unstripped suffixes like "PART OF FCA US LLC", trailing notes, etc.),
 * plus alternate spellings that NIEM doesn't carry (e.g. "Mercedes-Benz"
 * vs "Mercedes Benz").
 *
 * Lookup behavior:
 *   getCode(<key>)           → entry.code         (uppercased)
 *   getName(<entry.code>)    → entry.displayName  (when set; falls back
 *                                                  to NIEM forward map)
 *   all()[<entry.code>]      → entry.displayName  (same override)
 *
 * Maintenance notes:
 *   - Keys MUST be UPPERCASE. Input to getCode is uppercased before lookup.
 *   - Multiple keys may resolve to the same code (see Mercedes / Mercedes-Benz).
 *   - When a code appears more than once and supplies different displayName
 *     values, the last entry written wins. Keep displayName values consistent
 *     across keys that share a code.
 *   - Re-running scripts/build-data.ts overwrites src/data/ncic-vehicle.ts but
 *     LEAVES THIS FILE ALONE. Re-validate aliases after a NIEM bump.
 *
 * Known NIEM data oddities baked in here:
 *   - SCION: NIEM stores "SCI0N" (digit zeros instead of letter O's)
 *     in the raw name for code SCIO. Worth reporting upstream:
 *     https://github.com/niemopen/niem-model
 */
export const VEHICLE_MAKE_ALIASES: Record<string, NcicAlias> = {
  'ALFA ROMEO': { code: 'ALFA', displayName: 'ALFA ROMEO' },
  CHRYSLER: { code: 'CHRY', displayName: 'CHRYSLER' },
  DODGE: { code: 'DODG', displayName: 'DODGE' },
  GENESIS: { code: 'GENS', displayName: 'GENESIS' },
  KARMA: { code: 'KARM', displayName: 'KARMA' },
  KOENIGSEGG: { code: 'KNGG', displayName: 'KOENIGSEGG' },
  LUCID: { code: 'LUCI', displayName: 'LUCID' },
  MASERATI: { code: 'MASE', displayName: 'MASERATI' },
  MCLAREN: { code: 'MCLA', displayName: 'MCLAREN' },
  MERCEDES: { code: 'MERZ', displayName: 'MERCEDES-BENZ' },
  'MERCEDES-BENZ': { code: 'MERZ', displayName: 'MERCEDES-BENZ' },
  MITSUBISHI: { code: 'MITS', displayName: 'MITSUBISHI' },
  PAGANI: { code: 'PAGN', displayName: 'PAGANI' },
  PLYMOUTH: { code: 'PLYM', displayName: 'PLYMOUTH' },
  POLESTAR: { code: 'PLSR', displayName: 'POLESTAR' },
  RIVIAN: { code: 'RIVA', displayName: 'RIVIAN' },
  'ROLLS ROYCE': { code: 'ROL', displayName: 'ROLLS-ROYCE' },
  'ROLLS-ROYCE': { code: 'ROL', displayName: 'ROLLS-ROYCE' },
  SATURN: { code: 'SATR', displayName: 'SATURN' },
  SCION: { code: 'SCIO', displayName: 'SCION' },
  SMART: { code: 'SMRT', displayName: 'SMART' },
  SUZUKI: { code: 'SUZI', displayName: 'SUZUKI' },
  TESLA: { code: 'TESL', displayName: 'TESLA' },
  VINFAST: { code: 'VNFS', displayName: 'VINFAST' },
  VOLKSWAGEN: { code: 'VOLK', displayName: 'VOLKSWAGEN' },
};
