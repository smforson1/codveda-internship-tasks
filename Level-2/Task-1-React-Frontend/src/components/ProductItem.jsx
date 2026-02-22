function ProductItem({ product }) {
    return (
        <div className="product-item">
            <span className="product-name">{product.name}</span>
            <span className="product-price">${product.price}</span>
        </div>
    );
}

export default ProductItem;
