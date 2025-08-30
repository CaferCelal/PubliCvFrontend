import React, {useRef, useState, useEffect, useLayoutEffect} from "react";
import "./landing-page.css";
import SvgLogo from "../../public/PubliCvLogo.svg";

const LandingPage = () => {
    const scrollRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        if (headerRef.current && scrollRef.current) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            const headerHeight = headerRef.current.getBoundingClientRect().height;
            scrollRef.current.style.height = `calc(100vh - ${headerHeight}px)`;
        }
    }, [location]);


    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element && scrollRef.current && headerRef.current) {
            const headerHeight = headerRef.current.getBoundingClientRect().height;

            scrollRef.current.scrollTo({
                top: element.offsetTop - headerHeight,
                behavior: "smooth",
            });
            setMenuOpen(false); // close menu on mobile after click
        }
    };

    return (
        <div className="landing-page-container">
            <header className="header" ref={headerRef}>
                <img src={SvgLogo} alt="logo" className="logo" />

                {/* Navigation */}
                <nav className="nav">
                    <a href="#features" className="desktop-only" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>Features</a>
                    <a href="#about" className="desktop-only" onClick={(e) => { e.preventDefault(); scrollToSection("about"); }}>About</a>
                    <a href="#contact" className="desktop-only" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}>Contact</a>
                    <a href="/login" className="login-link">Login</a>
                </nav>
            </header>


            <div className="scrollable-content" ref={scrollRef}>
                <section className="hero">
                    <div className="hero-text">
                        <h1>Publish Your CVs, Certificates & Documents</h1>
                        <p>Easily upload your files, generate shareable links, and let anyone view or download them online.</p>
                        <a href="/register" className="cta-button">Get Started</a>
                    </div>
                    <div className="hero-image">
                        <img src={SvgLogo} alt="hero logo" />
                    </div>
                </section>

                <section className="features" id="features">
                    <h2>Why Use PubliCv?</h2>
                    <div className="feature-list">
                        <div className="feature-item">
                            <h3>Upload Once, Share Anywhere</h3>
                            <p>Upload your CVs, certificates, or portfolios and get a unique link to share with employers, colleagues, or clients.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Professional Display</h3>
                            <p>Your documents are presented cleanly and professionally, making it easy for others to view and download them.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Secure & Easy</h3>
                            <p>Only the people with your link can access your files. Safe, fast, and hassle-free sharing.</p>
                        </div>
                    </div>
                </section>

                <section id="about" className="about-section">
                    <h2>About Us</h2>
                    <div className="about-card">
                        <p>
                            PubliCv is a platform designed to streamline document management by reducing redundant or scattered files in the cloud.
                            Instead of having CVs, certificates, and other documents spread across multiple services, PubliCv centralizes everything in one secure, easily shareable location.
                            All uploaded documents can be viewed and downloaded by anyone with the link, ensuring your information is easily accessible when you want it to be.
                            However, account management — including uploading, updating, or removing files — is private and controlled solely by the account owner.
                            This approach gives you full control over your documents while keeping sharing simple and professional.
                            Our mission is to simplify online document sharing, save storage space, and provide a clean interface for individuals and organizations alike.
                        </p>
                    </div>
                </section>

                <section className="contact" id="contact">
                    <h2>Contact</h2>
                    <div className="contact-card">
                        <form>
                            <div className="input-field">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" placeholder="John" />
                            </div>

                            <div className="input-field">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" placeholder="Doe" />
                            </div>

                            <div className="input-field">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="john.doe@example.com" />
                            </div>

                            <div className="input-field">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" rows="5" placeholder="Your message here..."></textarea>
                            </div>

                            <button type="submit" className="submit-button">Send Message</button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LandingPage;
