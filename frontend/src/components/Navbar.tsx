import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mocked Auth/Cart state since hooks were removed

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  //     setSearchQuery('');
  //     setIsMobileMenuOpen(false); // Close mobile menu on search
  //   }
  // };

  const handleLogout = () => {
    // Original logout logic from useAuth was here
    localStorage.removeItem("user");
    alert("User logged out.");
  };

  const navigationLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold bg-hero-gradient bg-clip-text text-transparent">
              ECommerce
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg px-3 py-2 transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form 
          // onSubmit={handleSearch}
           className="hidden md:flex items-center max-w-sm flex-1 mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent hover:bg-accent/10 transition-all duration-200 bg-background"
              />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-md hover:bg-accent/50 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {/* Badge functionality removed */}
            </Link>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {
                localStorage.getItem('user') ? (
                  <Link
                    to="/login"
                    className="block py-2 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg px-3 transition-colors duration-200 font-medium"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="block py-2 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg px-3 transition-colors duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )
              }
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 p-2 hover:bg-accent/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 px-4">
            {/* Mobile Search */}
            <form 
            // onSubmit={handleSearch}
             className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2 mb-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-2 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg px-3 transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile User Menu */}
            <div className="space-y-2 pt-2 border-t">
              {
                localStorage.getItem('user') ? (
                  <Link
                    to="/login"
                    className="block py-2 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg px-3 transition-colors duration-200 font-medium"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="block py-2 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg px-3 transition-colors duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )
              }
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;