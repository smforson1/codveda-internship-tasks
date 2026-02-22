import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';

const API_URL = 'http://localhost:3000/products';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
        } catch (err) {
            setError('Failed to load products. Make sure the API server is running on port 3000.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <p className="status-msg">Loading products...</p>;
    if (error) return <p className="status-msg error">{error}</p>;
    if (products.length === 0) return <p className="status-msg">No products found.</p>;

    return (
        <div>
            <div className="product-list">
                {products.map(product => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
            <button onClick={fetchProducts} className="refresh-btn">Refresh</button>
        </div>
    );
}

export default ProductList;
