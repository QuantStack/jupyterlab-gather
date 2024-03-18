import { HMSReactiveStore } from '@100mslive/hms-video-store';

export const hmsManager = new HMSReactiveStore();
export const hmsStore = hmsManager.getStore();
export const hmsActions = hmsManager.getActions();
