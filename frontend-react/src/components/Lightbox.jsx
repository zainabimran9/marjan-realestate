import { createContext, useContext, useState } from "react";

const LightboxContext = createContext(null);

export function LightboxProvider({ children }) {
  const [src, setSrc] = useState(null);
  return (
    <LightboxContext.Provider value={{ open: setSrc }}>
      {children}
      <div className={`lightbox-overlay${src ? " open" : ""}`} onClick={(e) => {
        if (e.target.classList.contains("lightbox-overlay") || e.target.classList.contains("lightbox-close")) setSrc(null);
      }}>
        <button className="lightbox-close" aria-label="Close">&times;</button>
        {src && <img className="lightbox-img" src={src} alt="" />}
      </div>
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  return useContext(LightboxContext);
}
