import { describe, it, expect } from 'vitest';
import { vehicleMake, vehicleModel, vehicleColor, vehicleStyle } from '../src/index.js';

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

  it('all() returns map with over 1000 entries', () => {
    const all = vehicleMake.all();
    expect(Object.keys(all).length).toBeGreaterThan(1000);
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
