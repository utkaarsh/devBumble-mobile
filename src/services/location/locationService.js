import { loadExpoLocation } from "./expoLocation";

export const getCurrentLocation = async () => {
  try {
    const Location = await loadExpoLocation();

    if (!Location) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (err) {
    console.log("Location Fetch Error:", err);
    return null;
  }
};
