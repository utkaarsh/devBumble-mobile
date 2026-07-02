import { requireOptionalNativeModule } from "expo-modules-core";

export const loadExpoLocation = async () => {
  try {
    const nativeLocation = requireOptionalNativeModule("ExpoLocation");

    if (!nativeLocation) {
      console.log(
        "Expo Location native module is unavailable. Rebuild the dev client to enable location."
      );
      return null;
    }

    const locationModule = await import("expo-location");
    const Location = locationModule.default || locationModule;

    if (typeof Location.requestForegroundPermissionsAsync !== "function") {
      console.log("Expo Location JS module did not expose the expected API.");
      return null;
    }

    return Location;
  } catch (err) {
    console.log("Expo Location Module Error:", err);
    return null;
  }
};
