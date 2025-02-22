import { useEffect } from "react";

const P5Wrapper = ({ scriptContent}) => {
  useEffect(() => {
    const script = document.createElement("script");
    //let interText = scriptContent.replace(/```\s*|\s*```/g, "");
    //let cleanText = interText.replace(/javascript\s*|\s*/g, "");
    let cleanText = scriptContent.replace(/```javascript|```/g, '');
    script.innerHTML = `${cleanText}`;

    //script.src = "./script.js"; // Ensure this path is correct
    console.log("Script content: ", cleanText);
    script.async = true;
    script.onload = () => {
      console.log("Script loaded");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup script on unmount
    };

    

  }, []);
  return <div id="p5-container"></div>;
};

export default P5Wrapper;