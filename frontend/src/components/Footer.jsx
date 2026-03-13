import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer>
      <div className="container footer-container">
        <div className="footer-col">
          <Link to="/" className="footer-logo-link">
            <img
              src={logo}
              alt="Success Mantra Logo"
              className="footer-logo-img"
            />
            <div className="footer-logo-text">
              <div>
                <span className="footer-brand-main">Success</span>
                <span className="footer-brand-sub">मंत्रा</span>
              </div>
              <span className="footer-brand-tag">INSTITUTE</span>
            </div>
          </Link>
          <p>
            <strong>Directed by:</strong> Mr. Vikas Sir
            <br />
            <strong>Managing Director:</strong> Mr. Himanshu (Alok) Sir
          </p>
          <p className="footer-desc">
            Empowering students from Class 1st to 12th.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/faculty">Faculty</Link>
            </li>
            <li>
              <Link to="/videos">Lectures</Link>
            </li>
            <li>
              <Link to="/quiz">Quiz</Link>
            </li>
            <li>
              <Link to="/contests">Contest</Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link to="/admin">Admin Panel</Link>
              </li>
            )}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Programs</h4>
          <ul>
            <li>
              <Link to="/enroll" onClick={() => window.scrollTo(0, 0)}>Junior Wing (1-5)</Link>
            </li>
            <li>
              <Link to="/enroll" onClick={() => window.scrollTo(0, 0)}>Middle Wing (6-8)</Link>
            </li>
            <li>
              <Link to="/enroll" onClick={() => window.scrollTo(0, 0)}>Senior Wing (9-12)</Link>
            </li>
            <li>
              <Link to="/enroll" onClick={() => window.scrollTo(0, 0)}>Competitive Exams</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="contact-list">
            <li className="contact-li">
              <i className="fas fa-map-marker-alt contact-icon"></i>
              <a
                href="https://maps.app.goo.gl/aZaMJdJ5wNy2oJXU7"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link address-link"
              >
                <span className="contact-text">
                  Adarsh Shiksha Niketan School,
                  <br />
                  GGIC Road, Ram Lila Tiraha,
                  <br />
                  Deeh - Raebareli
                </span>
              </a>
            </li>
            <li className="contact-li">
              <i className="fas fa-phone-alt contact-icon"></i>
              <div className="contact-text">
                <a href="tel:+916391171731" className="contact-link">
                  +91 63911 71731 (Vikas Sir)
                </a>
                <a href="tel:+917081431511" className="contact-link">
                  +91 70814 31511 (Himanshu Sir)
                </a>
              </div>
            </li>
            <li className="contact-li">
              <i className="fas fa-envelope contact-icon"></i>
              <a
                href="mailto:mysuccessmantrainstitute@gmail.com"
                className="contact-link"
              >
                <span className="contact-text">
                  mysuccessmantrainstitute@gmail.com
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright-text">
          &copy; 2025 <span className="text-white-bold">Success</span>{' '}
          <span className="text-accent-bold">मंत्रा</span> Institute. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
