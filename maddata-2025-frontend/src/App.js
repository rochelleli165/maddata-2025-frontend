import './App.css';
import ChatModal from './chat-modal';
import P5Wrapper from './p5-sketch';
function App() {
  return (
    <div className="App">
      <P5Wrapper scriptContent={`
        let x = 50;
let y = 50;

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("p5-container"); // Attach to div with id="p5-container"
}

function draw() {
  background(220);
  ellipse(x, y, 50, 50);
  x += 1; // Move the circle
}`} />
      <ChatModal></ChatModal>
    </div>
  );
}

export default App;
