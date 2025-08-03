import React from 'react';
import PropTypes from 'prop-types';
import { data, Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
const ProductCard = ({ product }) => {
  //   const { addToCart } = useCart();

  // {
  //   "userId": "688a92594dc7cc587ea86beb",
  //   "productId": "64fabd1234567890abcdef02",
  //   "selectedSize": "L",
  //   "selectedColor": "White",
  //   "quantity": 3
  // }

  // const handleAddToCart = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if(localStorage.getItem('user')){
  //     const user = JSON.parse(localStorage.getItem('user'));
  //     const data = {
  //       userId: user._id,
  //       productId: product.id,
  //       selectedSize: 'L',
  //       selectedColor: 'White',
  //       quantity: 3
  //     }
  //     getCart(data);
  //   }
  // };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="relative bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-medium group-hover:shadow-large">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-success text-success-foreground">New</span>
            )}
            {product.isSale && discountPercentage > 0 && (
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80">-{discountPercentage}%</span>
            )}
            {!product.inStock && (
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">Out of Stock</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Wishlist clicked for:', product.id);
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.rating)
                      ? 'text-warning fill-current'
                      : 'text-muted-foreground'
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    originalPrice: PropTypes.number,
    isNew: PropTypes.bool,
    isSale: PropTypes.bool,
    inStock: PropTypes.bool.isRequired,
    category: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
  }).isRequired
};

export default ProductCard;