import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, MapPin, User } from 'lucide-react';
import { getCart } from '../api/Cart'; // Assuming createOrder API function exists
import { toast } from 'react-toastify';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        // Personal Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        // Shipping Address
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        // Payment Information
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
    });

    const [processing, setProcessing] = useState(false);

    // Fetch cart data on component mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?._id) {
            getCart(user._id)
                .then(cartData => {
                    const itemsArray = cartData?.items || [];
                    if (itemsArray.length === 0) {
                        // If cart is empty after fetching, redirect
                        navigate('/products');
                    }
                    setCartItems(itemsArray);
                })
                .catch(err => {
                    console.error("Failed to fetch cart for checkout:", err);
                    toast.error("Could not load your cart.");
                    navigate('/cart');
                })
                .finally(() => setIsLoading(false));
        } else {
            // If no user, redirect to login
            navigate('/login');
        }
    }, [navigate]);

    // Calculate totals based on fetched cart items
    const { subtotal } = useMemo(() => {
        const currentSubtotal = cartItems.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
        return { subtotal: currentSubtotal };
    }, [cartItems]);

    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?._id) {
                toast.error("You must be logged in to place an order.");
                setProcessing(false);
                return;
            }

            // Simulate payment processing and create order
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // This is where you would call your createOrder API
            // await createOrder(user._id, formData, cartItems);

            toast.success('Order placed successfully! Thank you for your purchase.');
            navigate('/'); // Redirect to home or an order success page
        
        } catch (error) {
            console.error("Order submission failed:", error);
            toast.error('Payment failed. Please check your details and try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (isLoading) {
        return <div className="text-center py-20">Loading Checkout...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Secure and encrypted checkout</span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <div className="bg-card rounded-lg border">
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-semibold flex items-center space-x-2">
                                    <User className="h-5 w-5" />
                                    <span>Contact Information</span>
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name *</label>
                                        <input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name *</label>
                                        <input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address *</label>
                                    <input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-card rounded-lg border">
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-semibold flex items-center space-x-2">
                                    <MapPin className="h-5 w-5" />
                                    <span>Shipping Address</span>
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium mb-1">Street Address *</label>
                                    <input id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium mb-1">City *</label>
                                        <input id="city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium mb-1">State *</label>
                                        <input id="state" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                    </div>
                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-medium mb-1">ZIP Code *</label>
                                        <input id="zipCode" value={formData.zipCode} onChange={(e) => handleInputChange('zipCode', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-card rounded-lg border">
                             <div className="p-6 border-b">
                                <h2 className="text-lg font-semibold flex items-center space-x-2">
                                    <CreditCard className="h-5 w-5" />
                                    <span>Payment Information</span>
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="cardName" className="block text-sm font-medium mb-1">Name on Card *</label>
                                    <input id="cardName" value={formData.cardName} onChange={(e) => handleInputChange('cardName', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                </div>
                                <div>
                                    <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number *</label>
                                    <input id="cardNumber" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={(e) => handleInputChange('cardNumber', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">Expiry Date *</label>
                                        <input id="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={(e) => handleInputChange('expiryDate', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                    </div>
                                    <div>
                                        <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV *</label>
                                        <input id="cvv" placeholder="123" value={formData.cvv} onChange={(e) => handleInputChange('cvv', e.target.value)} required className="w-full p-2 border rounded-md bg-background" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-12 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-75"
                                disabled={processing}
                                onClick={handleSubmit}
                            >
                                {processing ? (
                                    <>
                                        <span className="animate-spin">Loading</span>
                                        <span className="sr-only">Loading</span>
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-lg border sticky top-24">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-semibold">Order Summary</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.productId.image} alt={item.productId.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">{item.productId.name}</div>
                                                <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                                            </div>
                                            <div className="text-sm font-medium">${(item.productId.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                                <hr className="border-border" />
                                <div className="space-y-2">
                                    <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : `$${shipping.toFixed(2)}`}</span></div>
                                    <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                                    <hr className="border-border" />
                                    <div className="flex justify-between text-lg font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-12 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-75"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4 mr-2" />
                                            Complete Order
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
