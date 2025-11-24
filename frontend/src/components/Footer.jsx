import React from 'react';
import logo from '../assets/logo.png';
const Footer = () => {
    return (
        <footer>
            <div className="container footer-container">
                <div className="footer-col">
                    <a href="#" className="logo" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <img src={logo} alt="Success Mantra Logo" style={{ height: '45px', marginRight: '10px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                            <div>
                                <span style={{
                                    color: '#ffffff',
                                    fontWeight: '800',
                                    fontSize: '24px'
                                }}>Success</span>
                                <span style={{
                                    color: '#ffab00',
                                    fontWeight: '800',
                                    fontSize: '24px',
                                    marginLeft: '5px',
                                    textShadow: '1px 1px 0 #000'
                                }}>मंत्रा</span>
                            </div>
                            <span style={{
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '600',
                                letterSpacing: '1px',
                                marginTop: '2px'
                            }}>INSTITUTE</span>
                        </div>
                    </a>
                    <p><strong>Directed by:</strong> Mr. Vikas Sir<br /><strong>Managing Director:</strong> Mr. Himanshu (Alok) Sir</p>
                    <p style={{ marginTop: '10px' }}>Empowering students from Class 1st to 12th.</p>
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
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <i className="fas fa-map-marker-alt" style={{ color: '#ffab00', marginTop: '5px' }}></i>
                            <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                                Adarsh Shiksha Niketan School,<br />GGIC Road, Ram Lila Tiraha,<br />Deeh - Raebareli
                            </span>
                        </li>
                        <li style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <i className="fas fa-phone-alt" style={{ color: '#ffab00', marginTop: '5px' }}></i>
                            <div style={{ color: 'rgba(255,255,255,0.8)' }}>
                                <div>+91 63911 71731 (Vikas Sir)</div>
                                <div>+91 70814 31511 (Himanshu Sir)</div>
                            </div>
                        </li>
                        <li style={{ display: 'flex', gap: '10px' }}>
                            <i className="fas fa-envelope" style={{ color: '#ffab00', marginTop: '5px' }}></i>
                            <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                                mysuccessmantrainstitute@gmail.com
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    &copy; 2025 <span style={{ color: '#ffffff', fontWeight: 'bold' }}>Success</span> <span style={{ color: '#ffab00', fontWeight: 'bold' }}>मंत्रा</span> Institute. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};
export default Footer;