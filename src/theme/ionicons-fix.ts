import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

export function registerIonicons() {
  const icons = Object.entries(allIcons).reduce((acc, [key, value]) => {
    if (key.endsWith('Outline')) {
      const name = key.replace('Outline', '').toLowerCase();
      acc[name] = value;
    }
    return acc;
  }, {} as any);
  
  addIcons(icons);
}