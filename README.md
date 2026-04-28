# ncic-vehicle-lookup

Synchronous NCIC vehicle code lookups (make, model, color, style) from NIEM 6.0.

Supports both directions: **code → name** and **name → code**.

## Install

```bash
npm install ncic-vehicle-lookup
# or
yarn add ncic-vehicle-lookup
```

## Usage

```ts
import { vehicleMake, vehicleColor, vehicleStyle, vehicleModel } from 'ncic-vehicle-lookup';

// Name → code  (e.g. after VIN decode: corgi returns 'Nissan', DMV needs 'NISS')
vehicleMake.getCode('Nissan')    // → 'NISS'
vehicleMake.getCode('toyota')    // → 'TOYT'  (case-insensitive)
vehicleMake.getCode('Unknown')   // → undefined

// Code → name  (e.g. for display)
vehicleMake.getName('NISS')      // → 'NISSAN'
vehicleMake.getName('niss')      // → 'NISSAN'  (case-insensitive)

// Full map
vehicleMake.all()                // → Record<string, string>

// Same API on all modules
vehicleColor.getCode('Black')    // → 'BLK'
vehicleColor.getName('BLK')      // → 'BLACK'
vehicleStyle.getName('2D')       // → '2 DOOR SEDAN'
```

## Code Types

| Export | NCIC Type | Entries | Description |
|--------|-----------|---------|-------------|
| `vehicleMake` | VMA | ~10,177 | Vehicle make / brand name |
| `vehicleModel` | VMO | ~1,630 | Vehicle model |
| `vehicleColor` | VCO | 32 | Vehicle color |
| `vehicleStyle` | VST | 146 | Vehicle style (2D, 4D, etc.) |

## Data Source

Built from [NIEM 6.0 PS02](https://github.com/niemopen/niem-model/tree/6.0-ps02) (`xsd/codes/ncic.xsd`).

## Updating to a New NIEM Version

1. Update the `NIEM_XSD_URL` constant in `scripts/build-data.ts`
2. Run `yarn build:data`
3. Commit the updated `src/data/ncic-vehicle.ts`
4. Bump version in `package.json` and publish

## Credits

Inspired by [cityssm/node-ncic-lookup](https://github.com/cityssm/node-ncic-lookup) (MIT).

## License

MIT
