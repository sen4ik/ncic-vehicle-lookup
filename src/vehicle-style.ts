import { NCIC_VEHICLE_DATA } from './data/ncic-vehicle.js';
import { createLookup } from './lookup.js';

export const vehicleStyle = createLookup(NCIC_VEHICLE_DATA.VST);
