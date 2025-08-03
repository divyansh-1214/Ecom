import React, { useState, useEffect } from 'react';
import { getProductAll } from '../api/product';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, HeadphonesIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
const Home = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProductAll().then(data => setProducts(data));
  }, []);
  const features = [
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your data is protected with industry-standard encryption'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $50. Express delivery available'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Our customer service team is here to help anytime'
    },
    {
      icon: Star,
      title: 'Quality Guarantee',
      description: '30-day money-back guarantee on all products'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient min-h-[80vh] flex items-center justify-center"  style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(25 95% 53%) 100%)' }}>
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Discover Amazing
              <span className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-2 mt-4 inline-block">
                Products
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              Shop the latest trends and discover premium quality products at unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <button className=" text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg inline-flex items-center transition-all duration-300 rounded-lg shadow-medium hover:shadow-large">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
              <Link to="/about">
                <button className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg border inline-flex items-center transition-all duration-300 rounded-lg group">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that our customers love most.
          </p>
        </div>

        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <Link to="/products">
            <button className="mt-8 px-8 py-4 border border-primary/30 hover:bg-primary/10 font-semibold text-lg inline-flex items-center transition-all duration-300 rounded-lg group">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </section>



      {/* CTA Section */}
      <section className="bg-card">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their shopping needs.
              Discover quality products at amazing prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <button className="px-8 py-4 bg-primary hover:bg-primary/90 font-semibold text-lg inline-flex items-center text-white transition-all duration-300 rounded-lg shadow-medium hover:shadow-large group">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
              <Link to="/login">
                <button className="px-8 py-4 border border-primary/30 hover:bg-primary/10 font-semibold text-lg inline-flex items-center transition-all duration-300 rounded-lg group">
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;