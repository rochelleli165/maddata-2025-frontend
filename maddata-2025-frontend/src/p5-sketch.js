import { useEffect, useRef } from "react";
import p5 from "p5";

const P5Wrapper = ({ scriptContent, container_id}) => {
  const containerRef = useRef(null);
  let p5Instance = useRef(null);

  useEffect(() => {
    if (!scriptContent || !containerRef.current) return;

    const containerElement = document.getElementById(container_id);

    if (!containerElement) {
      console.error(`Container element with id ${container_id} not found!`);
      return;
    }
  
    let cleanText = scriptContent.replace(/```javascript|```/g, '');
    
    let wrappedScript = `
     
        ${cleanText
          .replace(/canvas.parent\('p5-container'\)/g, `canvas.parent(containerRef.current)`) // Use containerRef)
          .replace(/canvas.parent\("p5-container"\)/g, `canvas.parent(containerRef.current)`) // Use containerRef)
        }
      
    `;
    try {

      if (p5Instance.current) {
        p5Instance.current.remove();
      }
      const sketchFunction = eval(wrappedScript); // Convert script string into function

      p5Instance.current = new p5(sketchFunction, containerRef.current);
    } catch (error) {
      console.error("Error executing p5.js code:", error);
    }

  }, [scriptContent, container_id]);
  return <div ref={containerRef} id={container_id} style={{ width: "400px", height: "400px", borderRadius: "16px" }}></div>;
};

export default P5Wrapper;