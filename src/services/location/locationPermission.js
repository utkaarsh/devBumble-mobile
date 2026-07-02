import { loadExpoLocation } from "./expoLocation";

export const requestLocationPermission = async () => {
  try {
    const Location = await loadExpoLocation();

    if (!Location) return false;

    const { status } = await Location.requestForegroundPermissionsAsync();

    return status === "granted";
  } catch (err) {
    console.log("Permission Error:", err);
    return false;
  }
};
