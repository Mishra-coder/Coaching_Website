import React from 'react';
import { Link } from 'react-router-dom';

const FloatingCallButton = () => {
  return (
    <Link to="/demo-booking" className="floating-call-button">
      <i className="fas fa-phone-alt"></i>
      <span className="button-text">Book Demo</span>
    </Link>
  );
};

export default FloatingCallButton;
