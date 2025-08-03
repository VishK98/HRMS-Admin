import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, Clock, CheckCircle, XCircle, 
  Loader2, AlertCircle, Map
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { getCurrentLocationWithAddress, LocationData } from "@/lib/location";

interface AttendanceStatus {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  workingHours?: number;
}

export const LocationCheckInOut = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    isCheckedIn: false,
    isCheckedOut: false
  });

  const getLocation = async () => {
    setLocationLoading(true);
    setError(null);
    
    try {
      const location = await getCurrentLocationWithAddress({
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      setCurrentLocation(location);
      setSuccess("Location captured successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to get location");
      console.error("Location error:", err);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user?.company?._id) {
      setError("Company information not available");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get current location first
      const location = await getCurrentLocationWithAddress({
        enableHighAccuracy: true,
        timeout: 10000
      });

      // Check in with location
      const response = await apiClient.checkIn(user._id, location);
      
      if (response.success) {
        setSuccess("Check-in successful with location!");
        setAttendanceStatus({
          isCheckedIn: true,
          isCheckedOut: false,
          checkInTime: new Date().toISOString()
        });
        setCurrentLocation(location);
      } else {
        setError(response.message || "Check-in failed");
      }
    } catch (err: any) {
      setError(err.message || "Check-in failed");
      console.error("Check-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user?.company?._id) {
      setError("Company information not available");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get current location first
      const location = await getCurrentLocationWithAddress({
        enableHighAccuracy: true,
        timeout: 10000
      });

      // Check out with location
      const response = await apiClient.checkOut(user._id, location);
      
      if (response.success) {
        setSuccess("Check-out successful with location!");
        setAttendanceStatus({
          isCheckedIn: true,
          isCheckedOut: true,
          checkOutTime: new Date().toISOString()
        });
        setCurrentLocation(location);
      } else {
        setError(response.message || "Check-out failed");
      }
    } catch (err: any) {
      setError(err.message || "Check-out failed");
      console.error("Check-out error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location-Based Attendance
          </CardTitle>
          <CardDescription>
            Check in and out with your current location for accurate attendance tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Current Location Display */}
          {currentLocation && (
            <Card className="bg-[#843C6D]/5 border-[#843C6D]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Map className="w-4 h-4 text-[#843C6D]" />
                  <span className="font-medium text-[#843C6D]">Current Location</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">Coordinates:</span> {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </div>
                  {currentLocation.address && (
                    <div>
                      <span className="font-medium">Address:</span> {currentLocation.address}
                    </div>
                  )}
                  {currentLocation.accuracy && (
                    <div>
                      <span className="font-medium">Accuracy:</span> ±{Math.round(currentLocation.accuracy)} meters
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={getLocation}
              disabled={locationLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {locationLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {locationLoading ? "Getting Location..." : "Get Current Location"}
            </Button>

            <Button
              onClick={handleCheckIn}
              disabled={loading || attendanceStatus.isCheckedIn}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {loading ? "Checking In..." : "Check In"}
            </Button>

            <Button
              onClick={handleCheckOut}
              disabled={loading || !attendanceStatus.isCheckedIn || attendanceStatus.isCheckedOut}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {loading ? "Checking Out..." : "Check Out"}
            </Button>
          </div>

          {/* Attendance Status */}
          <div className="flex gap-2">
            <Badge 
              variant={attendanceStatus.isCheckedIn ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3" />
              {attendanceStatus.isCheckedIn ? "Checked In" : "Not Checked In"}
            </Badge>
            
            <Badge 
              variant={attendanceStatus.isCheckedOut ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <XCircle className="w-3 h-3" />
              {attendanceStatus.isCheckedOut ? "Checked Out" : "Not Checked Out"}
            </Badge>
          </div>

          {/* Instructions */}
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Instructions:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Allow location access when prompted by your browser</li>
              <li>Click "Get Current Location" to capture your coordinates</li>
              <li>Click "Check In" to record your attendance with location</li>
              <li>Click "Check Out" when leaving (requires check-in first)</li>
              <li>Location data helps verify your attendance location</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 