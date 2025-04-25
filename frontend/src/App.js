import logo from './cat.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Esto es una prueba de entorno
        </p>
        <a
          className="App-link"
          href="https://www.youtube.com/watch?v=42CVIuY6nFo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Miau
        </a>
      </header>
    </div>
  );
}

export default App;
