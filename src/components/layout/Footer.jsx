import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-brand">Zaika Go</div>
      <p className="footer-tagline">Food, delivered to your door.</p>
      <p className="footer-copy">
        © {new Date().getFullYear()} Zaika Go. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;