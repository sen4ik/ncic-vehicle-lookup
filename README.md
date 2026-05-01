# ncic-vehicle-lookup

[![npm version](https://img.shields.io/npm/v/ncic-vehicle-lookup.svg)](https://www.npmjs.com/package/ncic-vehicle-lookup)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Synchronous NCIC vehicle code lookups — make, model, color, and style — sourced from [NIEM 6.0](https://github.com/niemopen/niem-model/tree/6.0-ps02).

Supports both directions: **code → name** and **name → code**. Zero runtime dependencies. Works in Node.js (CJS and ESM).

## Background

The [National Crime Information Center (NCIC)](https://www.fbi.gov/services/cjis/ncic) maintains standardized vehicle code tables used by law enforcement and DMV agencies across the United States. These codes appear on vehicle titles, registration documents, and law enforcement records — for example, `NISS` for Nissan, `TOYT` for Toyota, `BLK` for black.

This package extracts the vehicle-related code types from the NIEM 6.0 schema and exposes them as simple synchronous lookups with no async I/O.

## Install

```bash
npm install ncic-vehicle-lookup
# or
yarn add ncic-vehicle-lookup
```

## Usage

```ts
import { vehicleMake, vehicleColor, vehicleStyle, vehicleModel } from 'ncic-vehicle-lookup';

// Name → code  (e.g. corgi VIN decoder returns 'Nissan', DMV form needs 'NISS')
vehicleMake.getCode('Nissan')      // → 'NISS'
vehicleMake.getCode('toyota')      // → 'TOYT'  (case-insensitive)
vehicleMake.getCode('Unknown')     // → undefined

// If the input is already a valid NCIC code, it's returned as-is.
// This makes the call round-trip safe for callers that may pass either form.
vehicleMake.getCode('GMC')         // → 'GMC'
vehicleMake.getCode('gmc')         // → 'GMC'

// Common-name aliases handle makes whose NIEM raw name is too messy
// for the build-time normalizer (combo strings, "PART OF FCA US LLC",
// etc.) and alternate spellings. See "Make aliases" below.
vehicleMake.getCode('McLaren')          // → 'MCLA'
vehicleMake.getCode('Volkswagen')       // → 'VOLK'
vehicleMake.getCode('Mercedes-Benz')    // → 'MERZ'
vehicleMake.getName('MCLA')             // → 'MCLAREN'  (clean name, not the raw NIEM string)

// Code → name  (e.g. for display purposes)
vehicleMake.getName('NISS')        // → 'NISSAN'
vehicleMake.getName('niss')        // → 'NISSAN'  (case-insensitive)

// Full forward map (code → name)
vehicleMake.all()                  // → Record<string, string>

// Same API on all modules
vehicleColor.getCode('Black')      // → 'BLK'
vehicleColor.getName('BLK')        // → 'BLACK'
vehicleStyle.getName('2D')         // → '2 DOOR SEDAN'
vehicleModel.getName('001')        // → name or undefined
```

## API

All four exports share the same `NcicLookup` interface:

```ts
interface NcicLookup {
  /** Returns the full name for an NCIC code, or undefined if not found. Case-insensitive. */
  getName(code: string): string | undefined;

  /** Returns the NCIC code for a name, or undefined if not found. Case-insensitive.
   *  Matches against normalized names — corporate suffixes and parentheticals stripped.
   *  e.g. getCode('Honda') resolves to 'HOND' even though NIEM stores 'HONDA MOTOR CO., LTD'.
   *  If the input is already a valid NCIC code it is returned as-is (uppercased),
   *  so getCode('gmc') → 'GMC'. */
  getCode(name: string): string | undefined;

  /** Returns the full forward map: code → name */
  all(): Record<string, string>;
}
```

## Code Types

| Export | NCIC Type | Entries | Description |
|--------|-----------|---------|-------------|
| `vehicleMake` | VMA | ~10,177 | Vehicle make / brand name |
| `vehicleModel` | VMO | ~1,630 | Vehicle model |
| `vehicleColor` | VCO | 32 | Vehicle color |
| `vehicleStyle` | VST | 146 | Vehicle style (2D, 4D, PK, MC, etc.) |

## Make aliases

Many NIEM raw names for vehicle makes can't be matched by typing the obvious common name. Examples:

- `"VOLK"` is stored as `"VOLKSWAGEN PART OF FCA US LLC"` — typing `"Volkswagen"` doesn't match.
- `"MCLA"` is stored as `"MCLAREN AUTOMOTIVE, LTD (AKA-MCLAREN) UNITED KINGDOM MCLAREN RACING, MCLAREN GROUP"`.
- `"SCIO"` is stored as `"SCI0N..."` (NIEM data uses **digit zeros** instead of letter O's — likely a data entry error).

To handle these, `vehicleMake` ships a hand-curated alias map at [`src/data/vehicle-make-aliases.ts`](src/data/vehicle-make-aliases.ts). When a key in the alias map is passed to `getCode`, it returns the mapped NCIC code; the matching `displayName` (when set) also overrides what `getName(code)` and `all()[code]` return for that code.

Lookup order for `getCode`:

1. Input is already a valid NCIC code → return it.
2. Input matches an alias key (uppercased) → return the alias's code.
3. Fall back to the auto-generated normalized-name reverse map.

### Currently aliased makes

`Alfa Romeo`, `Chrysler`, `Dodge`, `Genesis`, `Karma`, `Koenigsegg`, `Lucid`, `Maserati`, `McLaren`, `Mercedes` / `Mercedes-Benz`, `Mitsubishi`, `Pagani`, `Plymouth`, `Polestar`, `Rivian`, `Rolls Royce` / `Rolls-Royce`, `Saturn`, `Scion`, `Smart`, `Suzuki`, `Tesla`, `Vinfast`, `Volkswagen`.

### Adding more aliases

Edit `src/data/vehicle-make-aliases.ts` and add an entry like:

```ts
'BENTLEY': { code: 'BENT', displayName: 'BENTLEY' },
```

Keys must be uppercase. The test suite auto-covers every entry in the alias map, so a typo in `code` will fail tests immediately.

### Intentional non-aliases

Some common brands are deliberately **not** aliased because they map to multiple legitimate codes that a clerk should pick explicitly:

- `Fisker` → could be `FISR` (Fisker Inc., 2016+) or `FSKR` (Fisker Automotive, 2008–2012). The year on the title disambiguates. Use the codes directly.

## Data Source

All data is extracted from [`xsd/codes/ncic.xsd`](https://github.com/niemopen/niem-model/blob/6.0-ps02/xsd/codes/ncic.xsd) in the [NIEM 6.0 PS02](https://github.com/niemopen/niem-model/tree/6.0-ps02) release. The generated data file (`src/data/ncic-vehicle.ts`) is committed to this repo so consumers have no build-time dependency on the NIEM GitHub repo.

## Updating to a New NIEM Version

When a new NIEM release includes updated NCIC vehicle codes:

1. Update `NIEM_XSD_URL` in `scripts/build-data.ts` to point to the new release tag
2. Run `yarn build:data` — regenerates `src/data/ncic-vehicle.ts`
3. Commit the updated data file
4. Bump the version in `package.json` and publish

## Contributing

Pull requests welcome. When adding support for new NCIC vehicle code types:

- Add the type prefix to `VEHICLE_CODE_TYPES` in `scripts/build-data.ts`
- Re-run `yarn build:data`
- Add a new module file (`src/vehicle-<type>.ts`) following the existing pattern
- Export it from `src/index.ts`
- Add tests in `test/lookup.test.ts`

## Credits

Inspired by [cityssm/node-ncic-lookup](https://github.com/cityssm/node-ncic-lookup) (MIT) — updated to NIEM 6.0 and narrowed to vehicle-related code types.

## License

MIT
