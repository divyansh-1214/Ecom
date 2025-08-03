import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { getCart, addToCart, removeFromCart } from '../api/Cart'; // Assuming removeFromCart API function exists
 
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Memoize the user ID to avoid re-parsing on every render
    const userId = useMemo(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)._id : null;
    }, []);

    const fetchCart = async () => {
        if (!userId) {
            setCartItems([]);
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const cartData = await getCart(userId);
            // Set the 'items' array from the response, defaulting to an empty array
            setCartItems(cartData?.items || []);
        } catch (err) {
            setError('Failed to fetch cart items. Please try again.');
            console.error('Failed to fetch cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [userId]);

    const handleUpdateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1 || !userId) return;

        const originalItems = [...cartItems];
        // Optimistically update the UI
        setCartItems(prevItems =>
            prevItems.map(i =>
                i.productId._id === item.productId._id ? { ...i, quantity: newQuantity } : i
            )
        );

        try {
            // Use the 'addToCart' endpoint which likely handles quantity updates (upsert logic)
            await addToCart({
                userId: userId,
                productId: item.productId._id,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                quantity: newQuantity
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
            // Revert UI on error
            setCartItems(originalItems);
            setError('Failed to update cart.');
        }
    };

    const handleRemoveFromCart = async (productId) => {
        if (!userId) return;
        
        const originalItems = [...cartItems];
        // Optimistically update UI
        setCartItems(prevItems => prevItems.filter(item => item.productId._id !== productId));

        try {
            // Assumes you have a removeFromCart function in your API file
            await removeFromCart(userId, productId);
        } catch (error) {
            console.error('Error removing item:', error);
            // Revert UI on error
            setCartItems(originalItems);
            setError('Failed to remove item.');
        }
    };

    // Calculate totals using useMemo for efficiency
    const { subtotal, totalItems } = useMemo(() => {
        if (!cartItems || cartItems.length === 0) {
            return { subtotal: 0, totalItems: 0 };
        }
        const currentSubtotal = cartItems.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
        const currentTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        return { subtotal: currentSubtotal, totalItems: currentTotalItems };
    }, [cartItems]);

    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    // --- Render Logic ---

    if (isLoading) {
        return <div className="text-center py-20">Loading Your Cart...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={fetchCart}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                    <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8">
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <Link to="/products">
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-12 px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Shopping
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
                    <p className="text-muted-foreground">
                        {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
                    </p>
                </div>
                <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium p-2 hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item._id} className="bg-card rounded-lg border overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-24 h-48 sm:h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.productId.image} alt={item.productId.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h3 className="font-semibold text-lg">{item.productId.name}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="text-xl font-bold">${item.productId.price.toFixed(2)}</div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                    className="inline-flex items-center justify-center rounded-md border h-8 w-8 p-0 hover:bg-accent disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                    className="inline-flex items-center justify-center rounded-md border h-8 w-8 p-0 hover:bg-accent"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col justify-between sm:justify-start items-end sm:items-end">
                                        <div className="text-lg font-bold sm:mb-2">${(item.productId.price * item.quantity).toFixed(2)}</div>
                                        <button
                                            onClick={() => handleRemoveFromCart(item.productId._id)}
                                            className="p-2 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-card rounded-lg border sticky top-24">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold">Order Summary</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                                    {shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : `$${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            {shipping > 0 && subtotal < 50 && (
                                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                                </div>
                            )}
                            <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t">
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-12 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
