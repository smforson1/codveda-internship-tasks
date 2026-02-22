import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function ProductManager() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', { name, price: Number(price) });
            setName('');
            setPrice('');
            fetchProducts();
        } catch (err) {
            alert('Error creating product');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert('Error deleting product');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="product-manager">
            <div className="header">
                <h2>Product Manager</h2>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <form onSubmit={handleCreate} className="create-form">
                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <button type="submit">Add Product</button>
            </form>

            <div className="product-list">
                {products.map((p) => (
                    <div key={p.id} className="product-card">
                        <div>
                            <strong>{p.name}</strong> - ${p.price}
                        </div>
                        <button onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductManager;
