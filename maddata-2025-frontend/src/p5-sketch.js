import React, { useEffect } from "react";

const P5Wrapper = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./script.js"; // Ensure this path is correct
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup script on unmount
    };
  }, []);

  return <div id="p5-container"></div>;
};

export default P5Wrapper;