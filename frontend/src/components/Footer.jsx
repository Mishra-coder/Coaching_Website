import React from 'react';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer>
            <div className="container footer-container">
                <div className="footer-col">
                    <a href="#" className="footer-logo-link">
                        <img src={logo} alt="Success Mantra Logo" className="footer-logo-img" />
                        <div className="footer-logo-text">
                            <div>
                                <span className="footer-brand-main">Success</span>
                                <span className="footer-brand-sub">मंत्रा</span>
                            </div>
                            <span className="footer-brand-tag">INSTITUTE</span>
                        </div>
                    </a>
                    <p><strong>Directed by:</strong> Mr. Vikas Sir<br /><strong>Managing Director:</strong> Mr. Himanshu (Alok) Sir</p>
                    <p className="footer-desc">Empowering students from Class 1st to 12th.</p>
                </div>

                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#programs">Courses</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Programs</h4>
                    <ul>
                        <li><a href="#">Junior Wing (1-5)</a></li>
                        <li><a href="#">Middle Wing (6-8)</a></li>
                        <li><a href="#">Senior Wing (9-12)</a></li>
                        <li><a href="#">JEE/NEET Foundation</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Contact Us</h4>
                    <ul className="contact-list">
                        <li className="contact-li">
                            <i className="fas fa-map-marker-alt contact-icon"></i>
                            <span className="contact-text">
                                Adarsh Shiksha Niketan School,<br />GGIC Road, Ram Lila Tiraha,<br />Deeh - Raebareli
                            </span>
                        </li>
                        <li className="contact-li">
                            <i className="fas fa-phone-alt contact-icon"></i>
                            <div className="contact-text">
                                <div>+91 63911 71731 (Vikas Sir)</div>
                                <div>+91 70814 31511 (Himanshu Sir)</div>
                            </div>
                        </li>
                        <li className="contact-li">
                            <i className="fas fa-envelope contact-icon"></i>
                            <span className="contact-text">
                                mysuccessmantrainstitute@gmail.com
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright-text">
                    &copy; 2025 <span className="text-white-bold">Success</span> <span className="text-accent-bold">मंत्रा</span> Institute. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;