import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, HeadphonesIcon } from 'lucide-react';
// Assume you have these API functions and components
import { getProductById, getProductAll } from '../api/product';
import ProductCard from '../components/ProductCard';
import { addToCart } from '../api/Cart';
import { toast } from 'react-hot-toast'; 
const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- State Management ---
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('features');

    console.log(localStorage.getItem('user'))
    // --- Data Fetching ---
    useEffect(() => {
        // Reset state on ID change
        setIsLoading(true);
        setProduct(null);
        setError(null);

        // Fetch the main product
        getProductById(id)
            .then(productData => {
                setProduct(productData);
                setSelectedSize(productData.sizes[0]);
                setSelectedColor(productData.colors[0]);
            })
            .then(() => {
                getProductAll().then(allProducts => {
                    setRelatedProducts(allProducts.filter(p => p.category === product.category && p.id !== product.id));
                });
            })
            .catch(err => {
                console.error("Error fetching product details:", err);
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]); // Re-run effect if the product ID changes

    // --- Event Handlers ---
    // In handleAddToCart function
    const handleAddToCart = async () => { // Make the handler async
        if (!localStorage.getItem('user')) {
            toast.error("Please log in to add items to your cart.");
            navigate('/login');
            return; // Stop the function here
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const data = {
                userId: user._id,
                productId: product._id,
                selectedSize, // Shorthand for selectedSize: selectedSize
                selectedColor,
                quantity,
                price: product.price,
            };

            // Show a loading toast while the API call is in progress
            const promise = addToCart(data);

            toast.promise(promise, {
                loading: 'Adding to cart...',
                success: 'Item added successfully!',
                error: 'Could not add item. Please try again.',
            });

        } catch (error) {
            console.error("Failed to add to cart:", error);
            // The error toast is already handled by toast.promise
        }
    };

    // In the Related Products section
    {
        relatedProducts.map((relatedProd) => (
            <ProductCard key={relatedProd._id} product={relatedProd} />
        ))
    }

    if (isLoading) {
        return <div className="text-center py-20">Loading product...</div>;
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or there was an error.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const features = [
        { icon: Truck, title: 'Free Shipping', description: 'On orders over $50' },
        { icon: RotateCcw, title: '30-Day Returns', description: 'Easy returns within 30 days' },
        { icon: Shield, title: 'Warranty', description: '1-year manufacturer warranty' },
        { icon: HeadphonesIcon, title: 'Support', description: '24/7 customer support' }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center p-2 rounded-md mb-4 hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </button>
                <nav className="text-sm text-muted-foreground">
                    <Link to="/" className="hover:text-primary">Home</Link> /
                    <Link to="/products" className="hover:text-primary"> Products</Link> /
                    <Link to={`/products?category=${product.category}`} className="hover:text-primary"> {product.category}</Link> /
                    <span className="text-foreground font-medium"> {product.name}</span>
                </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="aspect-square bg-muted rounded-xl overflow-hidden border">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex space-x-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-primary ring-2 ring-primary/50' : 'border-border'
                                        }`}
                                >
                                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {product.isNew && (
                            <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-success text-success-foreground">New</span>
                        )}
                        {product.isSale && discountPercentage > 0 && (
                            <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-destructive text-destructive-foreground">-{discountPercentage}% OFF</span>
                        )}
                        {!product.inStock && (
                            <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">Out of Stock</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
                        </div>
                    </div>
                    <div className="flex items-baseline space-x-4">
                        <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.sizes?.length > 0 && (
                            <div>
                                <label htmlFor="size-select" className="block text-sm font-medium mb-2">Size</label>
                                <select id="size-select" value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="w-full p-2 border rounded-md bg-background">
                                    {product.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
                                </select>
                            </div>
                        )}
                        {product.colors?.length > 0 && (
                            <div>
                                <label htmlFor="color-select" className="block text-sm font-medium mb-2">Color</label>
                                <select id="color-select" value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className="w-full p-2 border rounded-md bg-background">
                                    {product.colors.map((color) => <option key={color} value={color}>{color}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="quantity-select" className="block text-sm font-medium mb-2">Quantity</label>
                        <select id="quantity-select" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-24 p-2 border rounded-md bg-background">
                            {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="flex-1 inline-flex items-center justify-center rounded-md text-lg font-semibold h-12 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button className="inline-flex items-center justify-center rounded-md text-lg font-semibold h-12 px-6 py-3 border border-input hover:bg-accent">
                            <Heart className="h-5 w-5 mr-2" />
                            Wishlist
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mb-16">
                <div className="border-b">
                    <div className="grid w-full grid-cols-3">
                        <button onClick={() => setActiveTab('features')} className={`py-3 font-medium ${activeTab === 'features' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Features</button>
                        <button onClick={() => setActiveTab('shipping')} className={`py-3 font-medium ${activeTab === 'shipping' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Shipping</button>
                        <button onClick={() => setActiveTab('reviews')} className={`py-3 font-medium ${activeTab === 'reviews' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Reviews</button>
                    </div>
                </div>
                <div className="py-6">
                    {activeTab === 'features' && (
                        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                            {product.features.map((feature, index) => <li key={index}>{feature}</li>)}
                        </ul>
                    )}
                    {activeTab === 'shipping' && (
                        <div className="space-y-3 text-muted-foreground">
                            <p><strong>Free Standard Shipping:</strong> 5-7 business days on orders over $50</p>
                            <p><strong>Express Shipping:</strong> 2-3 business days ($9.99)</p>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="space-y-4">
                            <p className="text-muted-foreground">No reviews yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProd) => (
                            <ProductCard key={relatedProd.id} product={relatedProd} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
