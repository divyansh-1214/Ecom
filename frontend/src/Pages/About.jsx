import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Award, Globe, ShoppingBag, Star, Code } from 'lucide-react';

const About = () => {
    // Data for the statistics section
    const stats = [
        { icon: Users, value: '50K+', label: 'Happy Customers' },
        { icon: ShoppingBag, value: '100K+', label: 'Orders Delivered' },
        { icon: Award, value: '5 Years', label: 'In Business' },
        { icon: Globe, value: '25+', label: 'Countries Served' }
    ];

    // Core values of the platform
    const values = [
        {
            icon: Heart,
            title: 'Customer First',
            description: 'We put our customers at the heart of everything we do, ensuring exceptional service and satisfaction.'
        },
        {
            icon: Star,
            title: 'Quality Products',
            description: 'We curate only the finest products that meet our high standards for quality and durability.'
        },
        {
            icon: Code,
            title: 'Innovative Technology',
            description: 'Leveraging modern web technologies to create a seamless and enjoyable user experience.'
        },
        {
            icon: Award,
            title: 'Commitment to Excellence',
            description: 'Striving for excellence in every aspect of our business, from the user interface to customer service.'
        }
    ];

    // Team section, highlighting you as the creator
    const team = [
        {
            name: 'Priyanshu', // Your Name Here
            role: 'Founder & Lead Developer',
            image: 'https://placehold.co/400x400/7c3aed/ffffff?text=P', // A placeholder image
            description: 'The visionary creator and developer behind this platform, based in Lucknow. Passionate about building modern, user-friendly e-commerce solutions.'
        }
    ];

    return (
        <div className="space-y-16 bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="container mx-auto px-4 py-20 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            The Story Behind This Project
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                            This platform was built with a passion for web development and a commitment to creating high-quality, modern e-commerce experiences.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <stat.icon className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-3xl font-bold mb-2">{stat.value}</div>
                            <div className="text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Our Story */}
            <section className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">My Vision</h2>
                        <p className="text-lg text-muted-foreground">
                            Crafted in Lucknow with a simple mission: to build a premium, accessible, and modern e-commerce platform from the ground up.
                        </p>
                    </div>
                    <div className="prose prose-lg max-w-none text-muted-foreground space-y-6 text-left">
                        <p>
                            It all started with a simple idea: what does it take to build a truly great online shopping experience? I wanted to move beyond the ordinary and create a platform that was not only functional but also a pleasure to use. This project is my answer to that question.
                        </p>
                        <p>
                            As the sole developer, I envisioned a place where every component would be carefully crafted, every user interaction would be meaningful, and the underlying technology would be robust and scalable. This platform is a showcase of modern web development practices, from its responsive design to its efficient data handling.
                        </p>
                        <p>
                            Today, I'm proud to present this project as a testament to the power of passion and dedication. Every feature you see is the result of countless hours of coding and a relentless pursuit of quality. Thank you for visiting and exploring my creation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="bg-muted/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Core Values</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            These core values guided the development of this project and shape the experience I aim to create.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center bg-card rounded-xl shadow-sm p-6">
                                <div className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <value.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet the Creator</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        The passionate individual behind the code, working tirelessly to bring this shopping experience to life.
                    </p>
                </div>
                <div className="flex justify-center">
                    {team.map((member, index) => (
                        <div key={index} className="text-center bg-card rounded-xl shadow-sm overflow-hidden max-w-sm">
                            <div className="aspect-square bg-muted">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/7c3aed/ffffff?text=P'; }}
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                                <p className="text-primary font-medium mb-3">{member.role}</p>
                                <p className="text-sm text-muted-foreground">{member.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-card py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Experience the Difference?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers and discover the quality and service that sets this platform apart.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/products">
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-12 px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                                    Start Shopping
                                </button>
                            </Link>
                            <Link to="/contact">
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-12 px-8 py-3 border border-input hover:bg-accent w-full sm:w-auto">
                                    Contact Me
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
