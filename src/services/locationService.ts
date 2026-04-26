import * as Location from "expo-location";
import i18n from "./i18nService";

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}




export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus === "granted") {
      

      await Location.requestBackgroundPermissionsAsync();
      return true;
    }

    return false;
  } catch (error) {
    console.error(i18n.t("location.permissionDenied"), error);
    return false;
  }
};


export const checkLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error(i18n.t("location.permissionDenied"), error);
    return false;
  }
};


export const getCurrentLocation =
  async (): Promise<LocationCoordinates | null> => {
    try {
      const hasPermission = await checkLocationPermission();

      if (!hasPermission) {
        const granted = await requestLocationPermission();
        if (!granted) {
          throw new Error(i18n.t("location.permissionDenied"));
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude, accuracy } = location.coords;
      return {
        latitude,
        longitude,
        accuracy: accuracy ?? undefined,
      };
    } catch (error) {
      console.error(i18n.t("location.obtainingLocation"), error);
      return null;
    }
  };



export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (results.length > 0) {
      const address = results[0];
      return `${address.street || ""} ${address.city || ""} ${address.country || ""}`.trim();
    }

    return null;
  } catch (error) {
    console.error(i18n.t("note.address"), error);
    return null;
  }
};



export const getCurrentLocationWithAddress =
  async (): Promise<LocationCoordinates | null> => {
    try {
      const location = await getCurrentLocation();

      if (!location) {
        return null;
      }

      // Tenta obter endereço, mas continua mesmo se falhar
      try {
        const address = await getAddressFromCoordinates(
          location.latitude,
          location.longitude,
        );
        location.address = address || undefined;
      } catch (error) {
        console.warn(i18n.t("note.address"), error);
      }

      return location;
    } catch (error) {
      console.error(i18n.t("location.obtainingLocation"), error);
      return null;
    }
  };
