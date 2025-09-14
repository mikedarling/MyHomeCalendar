export type Location = {
  name: string;
  lat: number | null;
  lng: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
};

const parseGoogleEventLocation = (event: any): Location | null => {
  if (!event.location) {
    return null;
  }
  // Expected format:
  // "Goldfish Swim School - Bedford, 5 Colby Ct Suite 5, Bedford, NH 03110, USA"
  const locStr = event.location.trim();
  // Split by commas
  const parts = locStr.split(",").map((s: string) => s.trim());
  // Name is always first part (may contain dashes)
  const name = parts[0] || "";
  // Address is second part if present
  const address = parts.length > 1 ? parts[1] : null;
  // City is third part if present
  const city = parts.length > 2 ? parts[2] : null;
  // State and zip are in the fourth part, e.g. 'NH 03110'
  let state: string | null = null;
  let zip: string | null = null;
  if (parts.length > 3) {
    const stateZip = parts[3].split(" ");
    state = stateZip[0] || null;
    zip = stateZip.length > 1 ? stateZip[1] : null;
  }
  // lat/lng are not available from the string
  const location: Location = {
    name,
    lat: null,
    lng: null,
    address,
    city,
    state,
    zip,
  };
  return location;
};

export default {
  parseGoogleEventLocation,
};
