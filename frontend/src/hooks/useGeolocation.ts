"use client";

import { useEffect, useState } from "react";

type GeolocationState = {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      () => {
        setState((prev) => ({ ...prev, error: "No se pudo obtener tu ubicacion" }));
      },
      { maximumAge: 60_000, timeout: 10_000 },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return state;
}
