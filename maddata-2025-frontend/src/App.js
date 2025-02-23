import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ChatModal from "./chat-modal";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<HomePage />} />

        <Route 
          path="/chat" 
          element={
            <div className="App">
              <header>
                <h1>MadPictures</h1>
              </header>
              <ChatModal />
              <footer>
                <p>MadPictures can make mistakes. Check important info</p>
              </footer>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
} 

export default App;
