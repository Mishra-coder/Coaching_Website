import React from 'react';
import Hero from './Hero';
import Stats from './Stats';
import Testimonials from './Testimonials';
import FAQ from './FAQ';



const Home = () => {
    return (
        <>
            <Hero />
            <Stats />
            <Testimonials />
            <FAQ />

            <section className="cta-section" style={{ background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', padding: '80px 0', textAlign: 'center', color: '#fff' }}>
                <div className="container">
                    <div className="cta-content">
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Dream Big, Achieve Bigger</h2>
                        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 30px', opacity: 0.9 }}>
                            "Success is not final, failure is not fatal: It is the courage to continue that counts."
                        </p>
                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffab00' }}>
                            Join Success मंत्रा Institute today!
                        </p>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Home;
