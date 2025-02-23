import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import P5Wrapper from "./p5-sketch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./HomePage.css";

const googleAPIKEY = process.env.REACT_APP_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(googleAPIKEY); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const HomePage = () => {
  const [sketchCode, setSketchCode] = useState("");
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    async function fetchSketch() {
      const prompt = "Make something cool using p5js." + "Please surround the code with [[[ and ]]] tags and the explanation with <<< and >>> tags." + 
      "it should return in the format similar to  (p) => { " +
      `
          let x = 50;
          let y = 50;

          p.setup = function() {
            let canvas = p.createCanvas(400, 400);
            canvas.parent(containerRef.current); // Attach to div with id="p5-container"
          }

          p.draw = function() {
            p.background(220);
            p.ellipse(x, y, 50, 50);
            x += 1; // Move the circle
          }
    }` + "Ensure the setup functions contains these items: " + ` 
        canvas.style("position", "absolute");
        canvas.style("top", "0");
        canvas.style("left", "0");
        canvas.style("z-index", "-1");` + `Use window.innerWidth and window.innerHeight to set the canvas size dynamically in setup:  
        let canvas = p.createCanvas(${windowSize.width}, ${windowSize.height});` + "finally, ensure the background is always black"; 
      try {
        const result = await model.generateContent(prompt);
        const story = result.response.text();

        // Extract p5.js code from response
        const regex_code = /\[\[\[(.*?)\]\]\]/s;
        const match = story.match(regex_code);

        console.log("Match:", match[1]);

        if (match) {
          setSketchCode(match[1]); // Store p5.js code for rendering
        }
      } catch (error) {
        console.error("Error fetching p5.js sketch:", error);
      }
    }

    fetchSketch();
  }, []);

  return (
    <div className="home-container"> 
      <h1 className="welcome-text">Welcome to Promatheus</h1>
      <button 
        onClick={() => navigate("/chat")}
        className="nav-button">
        Get Started
      </button>
      <P5Wrapper scriptContent={sketchCode} container_id="p5-home-sketch" />
    
    </div>
  );
};

export default HomePage;
