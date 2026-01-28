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
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Dream Big, Achieve Bigger</h2>
                        <p className="cta-quote">
                            "Success is not final, failure is not fatal: It is the courage to continue that counts."
                        </p>
                        <p className="cta-highlight">
                            Join Success मंत्रा Institute today!
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;