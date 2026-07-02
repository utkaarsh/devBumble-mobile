import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";

const LAST_LOCATION_KEY = "LAST_LOCATION";

const hasLocationChanged = (oldLoc, newLoc) => {
  if (!oldLoc) return true;

  const latDiff = Math.abs(oldLoc.latitude - newLoc.latitude);
  const longDiff = Math.abs(oldLoc.longitude - newLoc.longitude);

  // roughly ~100m threshold
  return latDiff > 0.001 || longDiff > 0.001;
};

export const syncLocationToBackend = async (location) => {
  try {
    const oldLocationString = await AsyncStorage.getItem(LAST_LOCATION_KEY);

    const oldLocation = oldLocationString
      ? JSON.parse(oldLocationString)
      : null;

    if (!hasLocationChanged(oldLocation, location)) {
      console.log("Location unchanged", oldLocation);
      return;
    }

    console.log("Location cords", {
      latitude: location.latitude,
      longitude: location.longitude,
    });
    console.log("Location hitting");

    await api.put("/users/location", {
      latitude: location.latitude,
      longitude: location.longitude,
    });

    await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));

    console.log("Location Synced");
  } catch (err) {
    console.log("Location Sync Error:", err.message);
  }
};
