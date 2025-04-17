import { useRef, useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

const TiltCard = ({ children, options = {}, className = "" }) => {
  const tiltRef = useRef(null);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 20,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        ...options,
      });
    }

    return () => tiltRef.current?.vanillaTilt?.destroy();
  }, [options]);

  return (
    <div ref={tiltRef} className={className}>
      {children}
    </div>
  );
};

export default TiltCard;
