// sharan adhikari  24071844
import React from 'react';
import './ProductCard.css';
import { useCart } from '../context/cartContext';
import { useNavigate, Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={`/${product.image_url}`} alt={product.name} loading="lazy" />
      </Link>

      <h3>
        <Link to={`/product/${product.id}`}>{product.name}</Link>
      </h3>

      <p className="price">${product.price}</p>
      <p className="desc">{product.description}</p>
      <p className="tags">
        Size: US {product.size_us} | UK {product.size_uk} | EU {product.size_eu}
      </p>
      <p className="stock">In Stock: {product.stock}</p>

      <button onClick={handleAddToCart} style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "black",
              fontFamily:'Poppins',
              color: "white",
              border: "none",
              cursor: "pointer"
            }} >Add to Cart</button>
    </div>
  );
};

export default ProductCard;
