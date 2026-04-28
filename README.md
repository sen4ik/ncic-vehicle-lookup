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
   *  e.g. getCode('Honda') resolves to 'HOND' even though NIEM stores 'HONDA MOTOR CO., LTD' */
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
