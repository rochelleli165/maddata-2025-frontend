import './App.css';
import ChatModal from './chat-modal';
import P5Wrapper from './p5-sketch';
function App() {
  return (
    
    <div className="App">
      <header>
        <h1>MadPictures</h1>
      </header>
      <ChatModal></ChatModal>
      <footer>
        <p>MadPictures can make mistakes. Check important info</p>
      </footer>
    </div>
  );
}

export default App;
