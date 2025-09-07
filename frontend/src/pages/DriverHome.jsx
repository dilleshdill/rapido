import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const defaultCenter = [20.5937, 78.9629]; // India center

// Component to auto-fit map bounds
const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points);
    }
  }, [points, map]);
  return null;
};

const DriverHome = () => {
  const [ride, setRide] = useState(null);
  const [driverPos, setDriverPos] = useState({ lat: 0, lon: 0 });
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // ---------------- SOCKET ----------------
  useEffect(() => {
    socket.emit("driverId", 4);

    socket.on("newRide", (rideData) => {
      console.log("New Ride:", rideData);
      setRide(rideData);
    });

    socket.on("rideConfirmed", (rideData) => {
      console.log("Ride Confirmed:", rideData);
      setRide(rideData);

      socket.on("driverLocation", (locationDetails) => {
        setDriverPos({
          lat: locationDetails.driver.lat,
          lon: locationDetails.driver.lon,
        });
      });
    });

    return () => {
      socket.off("driverId");
      socket.off("newRide");
      socket.off("rideConfirmed");
      socket.off("driverLocation");
    };
  }, []);

  // ---------------- HELPERS ----------------
  const fetchRoute = async (loc1, loc2) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${loc1.lon},${loc1.lat};${loc2.lon},${loc2.lat}?overview=full&geometries=geojson`;
      const res = await axios.get(url);
      const routeData = res.data.routes[0];
      const coords = routeData.geometry.coordinates.map((c) => [c[1], c[0]]);
      setRoute(coords);
      setDistance(routeData.distance / 1000); // km
      setDuration(routeData.duration / 60); // minutes
    } catch (err) {
      console.error("Route error:", err);
    }
  };

  const showLocations = async (rideData) => {
    if (
      rideData.pickup_lat &&
      rideData.pickup_lon &&
      rideData.drop_lat &&
      rideData.drop_lon
    ) {
      const loc1 = {
        lat: parseFloat(rideData.pickup_lat),
        lon: parseFloat(rideData.pickup_lon),
      };
      const loc2 = {
        lat: parseFloat(rideData.drop_lat),
        lon: parseFloat(rideData.drop_lon),
      };

      setPickup(loc1);
      setDrop(loc2);
      fetchRoute(loc1, loc2);
    } else {
      alert("Ride missing coordinates.");
    }
  };

  // ---------------- ACCEPT RIDE ----------------
  const handleAccept = () => {
    socket.emit("rideAccepted", ride.rideId || ride.id);
    setShowMap(true);
    showLocations(ride);
  };

  return (
    <>
      {!showMap ? (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Driver Home</h1>

          {ride && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
                <h2 className="text-2xl font-bold mb-4">New Ride Request</h2>
                <p className="mb-2">
                  <strong>Pickup Location:</strong>{" "}
                  {ride.pickup || `${ride.pickup_lat}, ${ride.pickup_lon}`}
                </p>
                <p className="mb-2">
                  <strong>Drop Location:</strong>{" "}
                  {ride.drop || `${ride.drop_lat}, ${ride.drop_lon}`}
                </p>
                <p className="mb-2">
                  <strong>Distance:</strong> {ride.distance} km
                </p>
                <p className="mb-4">
                  <strong>Estimated Price:</strong> ₹{ride.amount}
                </p>

                <div className="flex justify-end gap-4">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={handleAccept}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      socket.emit("rideDeclined", ride.rideId || ride.id);
                      setRide(null);
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-screen w-full relative">
          {distance && duration && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                background: "white",
                padding: "10px 15px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                zIndex: 1000,
              }}
            >
              <strong>Distance:</strong> {distance.toFixed(2)} km <br />
              <strong>Duration:</strong> {Math.round(duration)} mins
            </div>
          )}

          <MapContainer
            center={
              driverPos.lat === 0 && driverPos.lon === 0
                ? defaultCenter
                : [driverPos.lat, driverPos.lon]
            }
            zoom={10}
            style={{ height: "100vh", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {driverPos.lat !== 0 && driverPos.lon !== 0 && (
              <Marker position={[driverPos.lat, driverPos.lon]}>
                <Popup>Driver Location</Popup>
              </Marker>
            )}

            {pickup && (
              <Marker position={[pickup.lat, pickup.lon]}>
                <Popup>Pickup</Popup>
              </Marker>
            )}

            {drop && (
              <Marker position={[drop.lat, drop.lon]}>
                <Popup>Drop</Popup>
              </Marker>
            )}

            {route.length > 0 && (
              <>
                <Polyline positions={route} color="blue" weight={4} />
                <FitBounds
                  points={[
                    [pickup.lat, pickup.lon],
                    [drop.lat, drop.lon],
                    ...(driverPos.lat && driverPos.lon
                      ? [[driverPos.lat, driverPos.lon]]
                      : []),
                  ]}
                />
              </>
            )}
          </MapContainer>
        </div>
      )}
    </>
  );
};

export default DriverHome;
