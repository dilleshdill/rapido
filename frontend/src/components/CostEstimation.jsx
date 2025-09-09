import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const CostEstimation = ({getCost}) => {
  const [address1, setAddress1] = useState(localStorage.getItem("pickup-address") || "");
  const [address2, setAddress2] = useState(localStorage.getItem("drop-address") || "");
  const [location1, setLocation1] = useState(null);
  const [location2, setLocation2] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    showLocations();
  }, []);

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: address, format: "json", limit: 1 },
      });
      if (response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon),
        };
      }
      return null;
    } catch (err) {
      console.error("Geocode error:", err);
      return null;
    }
  };

  const fetchRoute = async (loc1, loc2) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${loc1.lon},${loc1.lat};${loc2.lon},${loc2.lat}?overview=full&geometries=geojson&alternatives=false&steps=true&annotations=true`;
      const res = await axios.get(url);
      const routeData = res.data.routes[0];
      const coords = routeData.geometry.coordinates.map((c) => [c[1], c[0]]);
      setRoute(coords);
      console.log("Route data:", routeData);
      setDistance(routeData.distance / 1000); 
      setDuration(routeData.duration / 60); 
      getCost(routeData.distance/1000); 
    } catch (err) {
      console.error("Route error:", err);
    }
  };

  const showLocations = async () => {
    const loc1 = await getCoordinates(address1);    
    const loc2 = await getCoordinates(address2);
    if (loc1 && loc2) {
      setLocation1(loc1);
      setLocation2(loc2);
      fetchRoute(loc1, loc2);
    } else {
      alert("Could not find one or both locations. Please enter valid addresses.");
    }
  };

  return (
    <>
    </>
  );
};

export default CostEstimation;
