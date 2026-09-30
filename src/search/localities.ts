export interface Locality {
  id: number;
  /** Hebrew name; also the Pikud HaOref alert-area key used by scores.json */
  he: string;
  en: string;
  lat: number;
  lng: number;
}

/** What we keep in localStorage and show in the chip. */
export type ChosenLocality = Pick<Locality, 'id' | 'he' | 'en'>;

let loading: Promise<Locality[]> | undefined;

/** Loaded on first use so the initial page stays small. */
export function loadLocalities(): Promise<Locality[]> {
  loading ??= fetch(`${import.meta.env.BASE_URL}localities.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`localities.json: HTTP ${res.status}`);
      return res.json() as Promise<{ localities: Locality[] }>;
    })
    .then((data) => data.localities)
    .catch((err: unknown) => {
      loading = undefined; // allow a retry
      throw err;
    });
  return loading;
}

const EARTH_KM = 6371;
const rad = (deg: number) => (deg * Math.PI) / 180;

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h));
}

/** Nearest locality, or undefined if none is within `maxKm` (e.g. the user is abroad). */
export function nearest(list: Locality[], lat: number, lng: number, maxKm = 20): Locality | undefined {
  let best: Locality | undefined;
  let bestKm = maxKm;
  for (const loc of list) {
    const km = distanceKm(lat, lng, loc.lat, loc.lng);
    if (km <= bestKm) {
      best = loc;
      bestKm = km;
    }
  }
  return best;
}
