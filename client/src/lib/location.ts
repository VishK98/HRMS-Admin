export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

/**
 * Get current location using browser's Geolocation API
 */
export const getCurrentLocation = (
  options: GeolocationOptions = {}
): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: options.enableHighAccuracy ?? true,
      timeout: options.timeout ?? 10000,
      maximumAge: options.maximumAge ?? 60000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };

        resolve(locationData);
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'Unknown location error';
        }
        
        reject(new Error(errorMessage));
      },
      defaultOptions
    );
  });
};

/**
 * Reverse geocode coordinates to get address
 */
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get address');
    }
    
    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error('Error getting address:', error);
    return null;
  }
};

/**
 * Get current location with address
 */
export const getCurrentLocationWithAddress = async (
  options: GeolocationOptions = {}
): Promise<LocationData> => {
  const location = await getCurrentLocation(options);
  
  try {
    const address = await getAddressFromCoordinates(location.latitude, location.longitude);
    if (address) {
      location.address = address;
    }
  } catch (error) {
    console.warn('Could not get address for location:', error);
  }
  
  return location;
};

/**
 * Calculate distance between two coordinates in meters
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Check if location is within a specified radius of a target location
 */
export const isLocationWithinRadius = (
  currentLat: number,
  currentLon: number,
  targetLat: number,
  targetLon: number,
  radiusInMeters: number
): boolean => {
  const distance = calculateDistance(currentLat, currentLon, targetLat, targetLon);
  return distance <= radiusInMeters;
}; 