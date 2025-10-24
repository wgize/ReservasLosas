import { Box } from "@chakra-ui/react";
import MapGL, { Marker } from "react-map-gl";
import { useState } from "react";

export default function PageMap() {
  const [viewport, setViewport] = useState({
    latitude: -12.0464,
    longitude: -77.0428,
    zoom: 12,
  });

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  console.log("Token Mapbox:", MAPBOX_TOKEN);

  return (
    <Box
      w="100%"
      h="500px"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      mt={4}
    >
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN} // <-- CORRECTO EN v6
      >
        <Marker
          latitude={-12.0464}
          longitude={-77.0428}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <div style={{ color: "red", fontSize: "24px" }}>📍</div>
        </Marker>
      </MapGL>
    </Box>
  );
}
