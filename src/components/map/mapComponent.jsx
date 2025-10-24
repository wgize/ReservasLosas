import React, { useEffect, useRef } from "react";

const MapkickMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Esperar a que Mapkick esté disponible globalmente
    if (window.Mapkick && window.Mapkick.Map) {
      // Genera el mapa dentro del div referenciado
      new window.Mapkick.Map(mapRef.current, [
        { latitude: -12.0464, longitude: -77.0428, label: "Cancha Lima" },
        { latitude: -16.409, longitude: -71.5375, label: "Cancha Arequipa" },
      ]);
    } else {
      console.error("Mapkick no está disponible aún");
    }
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
};

export default MapkickMap;
