import React from 'react';
import Canvas from './components/Canvas';
import Predictions from './components/Predictions';
import Timer from './components/Timer';
import Instructions from './components/Instructions';
import './App.css';

function App() {
  const targetWord = "candle"; // Example target word

  return (
    <div className="app-container">
      <header className="app-header">
        <Instructions targetWord={targetWord} />
        <Timer initialTime={20} /> {/* Example initial time in seconds */}
        <div className="header-icons">
          {/* You can add icons for settings, help, etc. here */}
          <div className="icon">💾</div>
          <div className="icon">❓</div>
          <div className="icon">❌</div>
        </div>
      </header>
      <main className="app-main">
        <Canvas />
        <Predictions predictions={["I see suitcase", "square"]} /> {/* Example predictions */}
      </main>
    </div>
  );
}

export default App;