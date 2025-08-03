import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProductAll } from '../api/product';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Component State
    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('featured');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]); // Increased default max
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Fetch products on component mount
    useEffect(() => {
        getProductAll().then(data => {
            setProducts(data);
            // Optional: Set price range dynamically based on fetched products
            if (data.length > 0) {
                const maxPrice = Math.max(...data.map(p => p.price));
                setPriceRange([0, Math.ceil(maxPrice / 100) * 100]); // Round up to nearest 100
            }
        });
    }, []);

    // Derive categories dynamically from products
    const categoriesArray = useMemo(() => {
        const uniqueCategories = new Set(products.map(product => product.category));
        return ['All', ...uniqueCategories];
    }, [products]);

    // Get search query from URL
    const searchQuery = searchParams.get('search') || '';
    const categoryParam = searchParams.get('category') || '';

    // Initialize filters from URL params
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategories([categoryParam]);
        }
    }, [categoryParam]);

    // **FIXED**: Filter and sort products logic
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...products];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter (if any category is selected)
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        // Apply price filter
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Apply stock filter
        if (showInStockOnly) {
            filtered = filtered.filter(product => product.inStock);
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                // Assuming `createdAt` or similar field exists for more accurate sorting
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default: // 'featured'
                break;
        }

        return filtered;
    }, [products, searchQuery, selectedCategories, priceRange, showInStockOnly, sortBy]);

    // **FIXED**: Category change handler
    const handleCategoryChange = (category, checked) => {
        if (category === 'All') {
            // Clicking "All" clears all other selections
            setSelectedCategories([]);
        } else {
            setSelectedCategories(prev =>
                checked
                    ? [...prev, category] // Add category if checked
                    : prev.filter(c => c !== category) // Remove category if unchecked
            );
        }
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        // Reset price range based on current product data if available
        const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;
        setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
        setShowInStockOnly(false);
        setSortBy('featured');
        setSearchParams({});
    };

    const FilterContent = () => (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                    {categoriesArray.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`filter-${category}`}
                                // **FIXED**: Checkbox checked logic
                                checked={
                                    category === 'All'
                                        ? selectedCategories.length === 0
                                        : selectedCategories.includes(category)
                                }
                                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`filter-${category}`} className="text-sm cursor-pointer">
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {/* ... other filters ... */}
             <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                    {/* Note: This is a simplified slider. A library like noUiSlider would be better for a two-thumb range. */}
                    <input
                        type="range"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                        max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000}
                        min={0}
                        step={10}
                        className="w-full"
                    />
                </div>
            </div>
            <div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="in-stock"
                        checked={showInStockOnly}
                        onChange={(e) => setShowInStockOnly(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="in-stock" className="text-sm cursor-pointer">
                        In stock only
                    </label>
                </div>
            </div>
            <button onClick={clearFilters} className="w-full p-2 border rounded-md hover:bg-muted/50 transition-colors">
                Clear All Filters
            </button>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
                </h1>
                <p className="text-muted-foreground">
                    {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Sidebar Filters */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-24 bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Filter className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">Filters</h2>
                        </div>
                        <FilterContent />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-card border border-border rounded-lg">
                        <div className="lg:hidden">
                            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center p-2 border rounded-md hover:bg-muted/50">
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </button>
                        </div>
                        <div className="flex items-center space-x-4 ml-auto">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Sort by:</span>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-40 p-2 border rounded-md bg-background">
                                    <option value="featured">Featured</option>
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-1 border border-border rounded-md">
                                <button
                                    aria-label="Grid View"
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-r-none ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}
                                >
                                    <Grid className="h-4 w-4" />
                                </button>
                                <button
                                    aria-label="List View"
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-l-none ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* ... rest of the component ... */}
                     {filteredAndSortedProducts.length > 0 ? (
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                            {filteredAndSortedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                            <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
                            <button onClick={clearFilters} className="p-2 bg-primary text-primary-foreground rounded-md">Clear All Filters</button>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Sheet Overlay */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileFilterOpen(false)}></div>
                    <aside className="relative z-10 w-80 h-full bg-background p-6 shadow-xl animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Filters</h2>
                            <button onClick={() => setIsMobileFilterOpen(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <div className="overflow-y-auto h-[calc(100%-4rem)]">
                           <FilterContent />
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default Products;