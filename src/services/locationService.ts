import * as Location from "expo-location";

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

/**
 * Solicita permissão de localização
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus === "granted") {
      // Opcional: solicitar permissão de background se necessário
      await Location.requestBackgroundPermissionsAsync();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erro ao solicitar permissão de localização:", error);
    return false;
  }
};

/**
 * Verifica se a permissão de localização foi concedida
 */
export const checkLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Erro ao verificar permissão de localização:", error);
    return false;
  }
};

/**
 * Obtém a localização atual do dispositivo
 */
export const getCurrentLocation =
  async (): Promise<LocationCoordinates | null> => {
    try {
      const hasPermission = await checkLocationPermission();

      if (!hasPermission) {
        const granted = await requestLocationPermission();
        if (!granted) {
          throw new Error("Permissão de localização negada");
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
      console.error("Erro ao obter localização:", error);
      return null;
    }
  };

/**
 * Converte coordenadas em endereço (geocoding reverso)
 * Opcional: use isso para mostrar endereço legível
 */
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
    console.error("Erro ao obter endereço:", error);
    return null;
  }
};

/**
 * Obtém a localização atual com endereço
 */
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
        console.warn("Não foi possível obter endereço:", error);
      }

      return location;
    } catch (error) {
      console.error("Erro ao obter localização com endereço:", error);
      return null;
    }
  };
