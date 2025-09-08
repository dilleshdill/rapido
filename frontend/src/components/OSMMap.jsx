
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import {io} from "socket.io-client";
const defaultCenter = [20.5937, 78.9629];

const FitBounds = ({ route }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(route);
    }
  }, [route, map]);
  return null;
};

const OSMMap = () => {
  const [address1, setAddress1] = useState("etcherla");
  const [address2, setAddress2] = useState("srikakulam");
  const [location1, setLocation1] = useState(null);
  const [location2, setLocation2] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [latAndLong, setLatAndLong] = useState({ lat: 0, lon: 0 });

  // useEffect(() => {

  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLatAndLong({
  //           lat: position.coords.latitude,
  //           lon: position.coords.longitude,
  //         });
  //       },
  //       (error) => {
  //         console.error(error.message);
  //       }
  //     );
  //   }

  // }, []);
  
  
  useEffect(()=>{
  
    const socket = io("http://localhost:5000");
    socket.on("driverLocation",locationDetails =>{
      console.log(locationDetails)
      setLatAndLong({
      lat:locationDetails.lat,
      lon:locationDetails.lng,
    });
    console.log("dirverLocation socket",latAndLong)
    })
    showLocations(latAndLong.lat,latAndLong.lon)
    return ()=>{
      socket.off("driverLocation");
    }

  },[latAndLong])

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
      setDistance(routeData.distance / 1000); // km
      setDuration(routeData.duration / 60); // minutes
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
    <div className="h-1/2 md:h-full w-full md:w-1/2">

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
          latAndLong.lat === 0 && latAndLong.lon === 0
            ? defaultCenter
            : [latAndLong.lat, latAndLong.lon]
        }
        zoom={10}
        style={{ height: "100vh", width: "50vw" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {latAndLong.lat !== 0 && latAndLong.lon !== 0 && !location1 && !location2 && (
          <Marker position={[latAndLong.lat, latAndLong.lon]}>

            <Popup>Your Location</Popup>
          </Marker>
        )}

        {location1 && (
          <Marker position={[location1.lat, location1.lon]}>
            <Popup>Pickup</Popup>
          </Marker>
        )}

        {location2 && (
          <Marker position={[location2.lat, location2.lon]}>
            <Popup>Drop</Popup>
          </Marker>
        )}

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

export default OSMMap;