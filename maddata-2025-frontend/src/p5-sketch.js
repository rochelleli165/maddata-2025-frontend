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
    
    // let wrappedScript = `
     
    //     ${cleanText
    //       .replace(/canvas.parent\('p5-container'\)/g, `canvas.parent(containerRef.current)`) // Use containerRef)
    //       .replace(/canvas.parent\("p5-container"\)/g, `canvas.parent(containerRef.current)`) // Use containerRef)
    //     }
      
    // `;

    let wrappedScript = 
    ` (p) => {
  p.setup = function() {
    let canvas = p.createCanvas(710, 400, p.WEBGL);
    //canvas.parent(containerRef.current); // Attach to div with id="p5-container"
    p.angleMode(p.DEGREES);
    p.strokeWeight(5);
    p.noFill();
    p.stroke(32, 8, 64);
    p.describe(
      'Users can click on the screen and drag to adjust their perspective in 3D space. The space contains a sphere of dark purple cubes on a light pink background.'
    );
  };

  p.draw = function() {
    p.background(250, 180, 200);
    p.orbitControl();

    for (let zAngle = 0; zAngle < 180; zAngle += 30) {
      for (let xAngle = 0; xAngle < 360; xAngle += 30) {
        p.push();
        p.rotateZ(zAngle);
        p.rotateX(xAngle);
        p.translate(0, 400, 0);
        p.box();
        p.pop();
      }
    }
  };
}
 `
    try {

      if (p5Instance.current) {
        p5Instance.current.remove();
      }
      console.log(wrappedScript);
      const sketchFunction = eval(wrappedScript); // Convert script string into function
      console.log('container ref current' + containerRef.current);
      p5Instance.current = new p5(sketchFunction, containerRef.current);
    } catch (error) {
      console.error("Error executing p5.js code:", error);
    }

  }, [scriptContent, container_id]);
  return <div ref={containerRef} id={container_id} style={{ width: "400px", height: "400px" }}></div>;
};

export default P5Wrapper;