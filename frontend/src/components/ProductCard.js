//sharan adhikari  24071844
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={`/${product.image_url}`} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <p className="desc">{product.description}</p>
      <p className="tags">Size: {product.size} | Age: {product.age_group}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
