import { NCIC_VEHICLE_DATA } from './data/ncic-vehicle.js';
import { createLookup } from './lookup.js';

export const vehicleMake = createLookup(NCIC_VEHICLE_DATA.VMA);
