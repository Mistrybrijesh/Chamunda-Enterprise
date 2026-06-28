import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-body">
        <div className="container">
          <div className="footer-main">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                {/* <span className="footer-logo-icon">🏛️ </span> */}
                <div>
                  <div className="footer-logo-main"> Chamunda Enterprise</div>
                </div>
              </div>
              <p>Premium quality furniture crafted with care and precision. Transform your living spaces with our curated collections of sofas, beds, dining sets, and more.</p>
              <div className="footer-social">
                <a href="#" className="social-icon" aria-label="Facebook">f</a>
                <a href="#" className="social-icon" aria-label="Instagram">ig</a>
                <a href="#" className="social-icon" aria-label="WhatsApp">wa</a>
                <a href="#" className="social-icon" aria-label="YouTube">yt</a>
              </div>
            </div>

            {/* Shop */}
            <div className="footer-col">
              <h3>Shop</h3>
              <ul>
                <li><Link href="/products">All Products</Link></li>
                <li><Link href="/products?category=sofa">Sofas</Link></li>
                <li><Link href="/products?category=bed">Beds</Link></li>
                <li><Link href="/products?category=table">Tables</Link></li>
                <li><Link href="/products?category=chair">Chairs</Link></li>
                <li><Link href="/products?category=wardrobe">Wardrobes</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footer-col">
              <h3>Company</h3>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="#">Blog</Link></li>
                <li><Link href="#">Showroom</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-col">
              <h3>Support</h3>
              <ul>
                <li><Link href="#">Privacy Policy</Link></li>
                <li><Link href="#">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact + Copyright — single row */}
          <div className="footer-bottom">
            <div className="footer-bottom-contacts">
              <span className="contact-item"><span>📞</span><span>+91 98795 00331</span></span>
              <span className="contact-item"><span>📧</span><span>info@chamundaenterprise.com</span></span>
              <span className="contact-item"><span>📍</span><span>Gujarat, India</span></span>
            </div>
            <p>© 2026 Chamunda Enterprise. All rights reserved. Made with ❤️ in India.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
