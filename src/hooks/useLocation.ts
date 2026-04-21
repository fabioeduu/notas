import { useCallback, useState } from "react";
import {
    checkLocationPermission,
    getCurrentLocation,
    getCurrentLocationWithAddress,
    LocationCoordinates,
    requestLocationPermission,
} from "../services/locationService";

/**
 * Hook para usar localização de forma fácil
 */
export const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationCoordinates | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const granted = await requestLocationPermission();
      if (!granted) {
        setError("Permissão de localização negada");
        return false;
      }
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      return await checkLocationPermission();
    } catch (err) {
      console.error("Erro ao verificar permissão:", err);
      return false;
    }
  }, []);

  const getLocation = useCallback(
    async (withAddress = false) => {
      try {
        setLoading(true);
        setError(null);

        const hasPermission = await checkPermission();
        if (!hasPermission) {
          const granted = await requestPermission();
          if (!granted) {
            throw new Error("Permissão não concedida");
          }
        }

        const coords = withAddress
          ? await getCurrentLocationWithAddress()
          : await getCurrentLocation();

        if (coords) {
          setLocation(coords);
          return coords;
        } else {
          throw new Error("Não foi possível obter a localização");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, requestPermission],
  );

  return {
    location,
    loading,
    error,
    getLocation,
    requestPermission,
    checkPermission,
  };
};
