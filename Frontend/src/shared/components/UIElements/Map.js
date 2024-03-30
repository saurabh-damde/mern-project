import { useEffect, useRef } from "react";
import "./Map.css";

const Map = (props) => {
  const { className, style, center, zoom } = props;
  const mapRef = useRef();
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });
    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom, mapRef]);
  return <div ref={mapRef} className={`map ${className}`} style={style}></div>;
};

export default Map;
