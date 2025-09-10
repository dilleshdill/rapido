import { useEffect, useState } from "react";
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
import L from "leaflet";
import bike from "../assets/bike3.png";

const defaultCenter = [20.5937, 78.9629]; // India center

// Auto-fit map bounds to the route
const FitBounds = ({ route }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(route);
    }
  }, [route, map]);
  return null;
};

const DriverMap = ({ driverLatLng, pickup }) => {
  const [rideData, setRideData] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  // Load ride data from localStorage only once
  useEffect(() => {
    const rideDataStr = localStorage.getItem("rideConfirmed");
    if (rideDataStr) {
      setRideData(JSON.parse(rideDataStr));
    }
  }, []);

  // Vehicle icons
  const vehicleIcons = {
    cab: new L.Icon({
      iconUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg88nqLNzD8tp2IxGV0POw_PZW_YaoBwWypA&s", // taxi icon
      iconSize: [40, 30],
      iconAnchor: [20, 40],
    }),
    bike: new L.Icon({
      iconUrl:
        bike, // bike icon
      iconSize: [60, 60],
      iconAnchor: [20, 40],
    }),
    auto: new L.Icon({
      iconUrl:
        "https://cdn.imgbin.com/3/22/12/imgbin-computer-icons-auto-rickshaw-khaki-dphgdKsPF84Hqf8fzcbHpHK0u.jpg", // (replace with auto rickshaw icon)
      iconSize: [40, 30],
      iconAnchor: [20, 40],
    }),
  };

  // Fetch route whenever driver or pickup changes
  useEffect(() => {
    if (driverLatLng && pickup) {
      fetchRoute(driverLatLng, pickup);
    }
  }, [driverLatLng, pickup]);

  const fetchRoute = async (loc1, loc2) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${loc1.lon},${loc1.lat};${loc2.lon},${loc2.lat}?overview=full&geometries=geojson&alternatives=false&steps=true&annotations=true`;
      const res = await axios.get(url);
      const routeData = res.data.routes[0];
      const coords = routeData.geometry.coordinates.map((c) => [c[1], c[0]]);
      setRoute(coords);
      setDistance(routeData.distance / 1000); // km
      setDuration(routeData.duration / 60); // minutes
      localStorage.setItem('timer',(routeData.duration / 60));
    } catch (err) {
      console.error("Route error:", err);
    }
  };

  return (
    <div className="h-1/2 md:h-full w-screen ">
      {/* Distance & Time Info */}
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

      {/* Map */}
      <MapContainer
        center={
          driverLatLng
            ? [driverLatLng.lat, driverLatLng.lon]
            : pickup
            ? [pickup.lat, pickup.lon]
            : defaultCenter
        }
        zoom={10}
        style={{ height: "100vh", width: "63vw" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Driver Vehicle Marker */}
        {driverLatLng && rideData && (
          <Marker
            position={[driverLatLng.lat, driverLatLng.lon]}
            icon={vehicleIcons[rideData.vehicle] || vehicleIcons.cab}
          >
            <Popup>
              Driver ({rideData.vehicle?.charAt(0).toUpperCase() +
                rideData.vehicle?.slice(1)})
            </Popup>
          </Marker>
        )}

        {/* Pickup Marker */}
        {pickup && (
          <Marker position={[pickup.lat, pickup.lon]}>
            <Popup>Pickup / Destination</Popup>
          </Marker>
        )}

        {/* Route */}
        {route.length > 0 && (
          <>
            <Polyline positions={route} color="blue" weight={4} />
            <FitBounds route={route} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default DriverMap;
