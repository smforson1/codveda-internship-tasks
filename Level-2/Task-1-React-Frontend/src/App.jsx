import ProductList from './components/ProductList';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>🛒 Product Store</h1>
      <p className="subtitle">Data fetched from the Level 1 REST API</p>
      <ProductList />
    </div>
  );
}

export default App;
