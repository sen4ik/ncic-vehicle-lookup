import { describe, it, expect } from 'vitest';
import { vehicleMake, vehicleModel, vehicleColor, vehicleStyle } from '../src/index.js';
import { VEHICLE_MAKE_ALIASES } from '../src/data/vehicle-make-aliases.js';

describe('vehicleMake', () => {
  it('getName returns full name for known uppercase code', () => {
    expect(vehicleMake.getName('NISS')).toBe('NISSAN');
  });

  it('getName is case-insensitive', () => {
    expect(vehicleMake.getName('niss')).toBe('NISSAN');
    expect(vehicleMake.getName('Niss')).toBe('NISSAN');
  });

  it('getCode returns NCIC code for known make name', () => {
    expect(vehicleMake.getCode('NISSAN')).toBe('NISS');
  });

  it('getCode is case-insensitive', () => {
    expect(vehicleMake.getCode('nissan')).toBe('NISS');
    expect(vehicleMake.getCode('Nissan')).toBe('NISS');
  });

  it('getCode resolves names with stripped corporate suffixes', () => {
    expect(vehicleMake.getCode('Honda')).toBe('HOND');
    expect(vehicleMake.getCode('HONDA')).toBe('HOND');
  });

  it('getCode resolves other common makes', () => {
    expect(vehicleMake.getCode('Toyota')).toBe('TOYT');
    expect(vehicleMake.getCode('Ford')).toBe('FORD');
    expect(vehicleMake.getCode('Chevrolet')).toBe('CHEV');
    expect(vehicleMake.getCode('BMW')).toBe('BMW');
  });

  it('getName returns undefined for unknown code', () => {
    expect(vehicleMake.getName('ZZZZZ')).toBeUndefined();
  });

  it('getCode returns undefined for unknown name', () => {
    expect(vehicleMake.getCode('NotARealMake')).toBeUndefined();
  });

  it('getCode returns the code as-is when the input is already a valid NCIC code', () => {
    expect(vehicleMake.getCode('GMC')).toBe('GMC');
    expect(vehicleMake.getCode('gmc')).toBe('GMC');
    expect(vehicleMake.getCode('GM')).toBe('GM');
    expect(vehicleMake.getCode('NISS')).toBe('NISS');
    expect(vehicleMake.getCode('TOYT')).toBe('TOYT');
  });

  it('all() returns map with over 1000 entries', () => {
    const all = vehicleMake.all();
    expect(Object.keys(all).length).toBeGreaterThan(1000);
  });
});

describe('vehicleMake aliases', () => {
  // Source-of-truth: every alias entry is exercised in both directions.
  // Adding a new alias to VEHICLE_MAKE_ALIASES will cause this test to
  // automatically cover it; an inconsistent or non-existent code will fail.
  for (const [name, alias] of Object.entries(VEHICLE_MAKE_ALIASES)) {
    it(`alias "${name}" → ${alias.code}`, () => {
      expect(vehicleMake.getCode(name)).toBe(alias.code);
      expect(vehicleMake.getCode(name.toLowerCase())).toBe(alias.code);
      // The aliased code must exist in the underlying NIEM forward map,
      // otherwise the alias is pointing at a nonexistent code (typo).
      expect(vehicleMake.getName(alias.code)).toBeDefined();
    });
  }

  it('display-name override applies to getName for aliased codes', () => {
    expect(vehicleMake.getName('MCLA')).toBe('MCLAREN');
    expect(vehicleMake.getName('mcla')).toBe('MCLAREN');
    expect(vehicleMake.getName('MERZ')).toBe('MERCEDES-BENZ');
    expect(vehicleMake.getName('SCIO')).toBe('SCION');
    expect(vehicleMake.getName('VOLK')).toBe('VOLKSWAGEN');
  });

  it('display-name override applies to all() for aliased codes', () => {
    const all = vehicleMake.all();
    expect(all['MCLA']).toBe('MCLAREN');
    expect(all['MERZ']).toBe('MERCEDES-BENZ');
    expect(all['SCIO']).toBe('SCION');
  });

  it('Mercedes / Mercedes-Benz / Mercedes Benz all resolve to MERZ', () => {
    expect(vehicleMake.getCode('Mercedes')).toBe('MERZ');
    expect(vehicleMake.getCode('Mercedes-Benz')).toBe('MERZ');
    expect(vehicleMake.getCode('mercedes-benz')).toBe('MERZ');
    // 'MERCEDES BENZ' (with space) was already in NIEM reverse map
    expect(vehicleMake.getCode('Mercedes Benz')).toBe('MERZ');
  });

  it('Rolls Royce / Rolls-Royce both resolve to ROL', () => {
    expect(vehicleMake.getCode('Rolls Royce')).toBe('ROL');
    expect(vehicleMake.getCode('Rolls-Royce')).toBe('ROL');
  });

  it('Fisker is intentionally NOT aliased (ambiguous)', () => {
    // FISR (modern Fisker Inc) and FSKR (original Fisker Automotive,
    // suspended 2012) are distinct legal entities. Aliasing either one
    // would silently get the wrong code for half of real-world Fisker
    // titles. Direct code lookup still works.
    expect(vehicleMake.getCode('Fisker')).toBeUndefined();
    expect(vehicleMake.getCode('FISR')).toBe('FISR');
    expect(vehicleMake.getCode('FSKR')).toBe('FSKR');
  });

  it('aliases do not break unrelated lookups', () => {
    expect(vehicleMake.getCode('Honda')).toBe('HOND');
    expect(vehicleMake.getCode('NISSAN')).toBe('NISS');
    expect(vehicleMake.getCode('NotARealMake')).toBeUndefined();
  });
});

describe('vehicleColor', () => {
  it('getName returns color name for known code', () => {
    expect(vehicleColor.getName('BLK')).toBe('BLACK');
    expect(vehicleColor.getName('WHI')).toBe('WHITE');
    expect(vehicleColor.getName('RED')).toBe('RED');
  });

  it('getName is case-insensitive', () => {
    expect(vehicleColor.getName('blk')).toBe('BLACK');
  });

  it('getCode returns code for known color', () => {
    expect(vehicleColor.getCode('BLACK')).toBe('BLK');
    expect(vehicleColor.getCode('WHITE')).toBe('WHI');
  });

  it('getCode returns the code as-is when the input is already a valid NCIC code', () => {
    expect(vehicleColor.getCode('BLK')).toBe('BLK');
    expect(vehicleColor.getCode('blk')).toBe('BLK');
  });

  it('getCode is case-insensitive', () => {
    expect(vehicleColor.getCode('black')).toBe('BLK');
    expect(vehicleColor.getCode('Black')).toBe('BLK');
  });

  it('getName returns undefined for unknown code', () => {
    expect(vehicleColor.getName('ZZZ')).toBeUndefined();
  });

  it('all() returns non-empty map', () => {
    expect(Object.keys(vehicleColor.all()).length).toBeGreaterThan(10);
  });
});

describe('vehicleStyle', () => {
  it('getName returns style name for known code', () => {
    expect(vehicleStyle.getName('2D')).toBe('2 DOOR SEDAN');
  });

  it('getName is case-insensitive', () => {
    expect(vehicleStyle.getName('2d')).toBe('2 DOOR SEDAN');
  });

  it('getCode returns code for known style name', () => {
    expect(vehicleStyle.getCode('2 DOOR SEDAN')).toBe('2D');
  });

  it('getCode is case-insensitive', () => {
    expect(vehicleStyle.getCode('2 door sedan')).toBe('2D');
  });

  it('getName returns undefined for unknown code', () => {
    expect(vehicleStyle.getName('ZZ')).toBeUndefined();
  });

  it('all() returns map with over 10 entries', () => {
    expect(Object.keys(vehicleStyle.all()).length).toBeGreaterThan(10);
  });
});

describe('vehicleModel', () => {
  it('all() returns map with over 100 entries', () => {
    expect(Object.keys(vehicleModel.all()).length).toBeGreaterThan(100);
  });

  it('getName returns undefined for unknown code', () => {
    expect(vehicleModel.getName('ZZZZZ')).toBeUndefined();
  });
});
