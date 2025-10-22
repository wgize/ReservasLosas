// src/hooks/useOverlayControl.js
import { useState } from "react";

export const useOverlayControl = () => {
  const [overlay, setOverlay] = useState(null);
  const openOverlay = (name) => setOverlay(name);
  const closeOverlay = () => setOverlay(null);
  return { overlay, openOverlay, closeOverlay };
};
