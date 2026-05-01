import { NCIC_VEHICLE_DATA } from './data/ncic-vehicle.js';
import { VEHICLE_MAKE_ALIASES } from './data/vehicle-make-aliases.js';
import { createLookup } from './lookup.js';

export const vehicleMake = createLookup(NCIC_VEHICLE_DATA.VMA, {
  aliases: VEHICLE_MAKE_ALIASES,
});
