import React, {useRef, useEffect, useState} from "react";
import "./landing-page.css";
import SvgLogo from "../../public/PubliCvLogo.svg";
import ContactServices from "../services/contact.tsx";
import Toast from "../components/toast.tsx";

const LandingPage = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLElement | null>(null);
    const [toast, setToast] = useState<{ message: string; isPositive: boolean } | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({type: null, message: ''});

    useEffect(() => {
        if (headerRef.current && scrollRef.current) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            const headerHeight = headerRef.current.getBoundingClientRect().height;
            scrollRef.current.style.height = `calc(100vh - ${headerHeight}px)`;
        }
    }, []);
    // Handle toast visibility
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast({ message: 'Something went wrong, please try again later', isPositive: false });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element && scrollRef.current && headerRef.current) {
            const headerHeight = headerRef.current.getBoundingClientRect().height;

            scrollRef.current.scrollTo({
                top: element.offsetTop - headerHeight,
                behavior: "smooth",
            });
        }
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {id, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted!", formData);

        // Basic validation
        if (!formData.firstName.trim() || !formData.lastName.trim() ||
            !formData.email.trim() || !formData.message.trim()) {
            setSubmitStatus({
                type: 'error',
                message: 'Please fill in all fields.'
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setSubmitStatus({
                type: 'error',
                message: 'Please enter a valid email address.'
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({type: null, message: ''});

        try {
            const response = await ContactServices.sendContactMessage(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.message
            );

            if (response.status >= 200 && response.status < 300) {
                setSubmitStatus({
                    type: 'success',
                    message: 'Thank you! Your message has been sent successfully.'
                });
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    message: ''
                });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: response.data || 'Failed to send message. Please try again.'
                });
                setToast({ message: 'Something went wrong, please try again later', isPositive: false });
            }
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'An error occurred. Please try again later.'
            });
            setToast({ message: 'Something went wrong, please try again later', isPositive: false });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="landing-page-container">
            <header className="header" ref={headerRef}>
                <img src={SvgLogo} alt="logo" className="logo"/>

                {/* Navigation */}
                <nav className="nav">
                    <a href="#features" className="desktop-only" onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("features");
                    }}>Features</a>
                    <a href="#about" className="desktop-only" onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("about");
                    }}>About</a>
                    <a href="#contact" className="desktop-only" onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("contact");
                    }}>Contact</a>
                    <a href="/login" className="login-link">Login</a>
                </nav>
            </header>

            <div className="scrollable-content" ref={scrollRef}>
                <section className="hero">
                    <div className="hero-text">
                        <h1>Publish Your CVs, Certificates & Documents</h1>
                        <p>Easily upload your files, generate shareable links, and let anyone view or download them
                            online.</p>
                        <a href="/register" className="cta-button">Get Started</a>
                    </div>
                    <div className="hero-image">
                        <img src={SvgLogo} alt="hero logo"/>
                    </div>
                </section>

                <section className="features" id="features">
                    <h2>Why Use PubliCv?</h2>
                    <div className="feature-list">
                        <div className="feature-item">
                            <h3>Upload Once, Share Anywhere</h3>
                            <p>Upload your CVs, certificates, or portfolios and get a unique link to share with
                                employers, colleagues, or clients.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Professional Display</h3>
                            <p>Your documents are presented cleanly and professionally, making it easy for others to
                                view and download them.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Secure & Easy</h3>
                            <p>Only the people with your link can access your files. Safe, fast, and hassle-free
                                sharing.</p>
                        </div>
                    </div>
                </section>

                <section id="about" className="about-section">
                    <h2>About Us</h2>
                    <div className="about-card">
                        <p>
                            PubliCv is a platform designed to streamline document management by reducing redundant
                            or scattered files in the cloud.
                            Instead of having CVs, certificates, and other documents spread across multiple
                            services, PubliCv centralizes everything in one secure, easily shareable location.
                            All uploaded documents can be viewed and downloaded by anyone with the link, ensuring
                            your information is easily accessible when you want it to be.
                            However, account management — including uploading, updating, or removing files — is
                            private and controlled solely by the account owner.
                            This approach gives you full control over your documents while keeping sharing simple
                            and professional.
                            Our mission is to simplify online document sharing, save storage space, and provide a
                            clean interface for individuals and organizations alike.
                        </p>
                    </div>
                </section>

                <section className="contact" id="contact">
                    <h2>Contact</h2>
                    <div className="contact-card">
                        {submitStatus.type === 'success' ? (
                            <div className="thank-you-message">
                                <h3>Thank you!</h3>
                                <p>
                                    We'll get back to you within 3 days. Please check your mailbox for our reply.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Status message for errors */}
                                {submitStatus.type === 'error' && (
                                    <div className="status-message error">
                                        {submitStatus.message}
                                    </div>
                                )}

                                <div className="input-field">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="john.doe@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Your message here..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </div>
            {/* Toast */}
            {toast && <Toast message={toast.message} isPositive={toast.isPositive}/>}
        </div>
    );
}

export default LandingPage;