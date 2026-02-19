import "./footer.css";
import Link from "next/link";
import { Appname } from "../Global-exports/global-exports";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">{Appname}</h3>
            <p className="footer-tagline">
              Your ultimate destination for streaming movies and TV shows.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-column-title">Navigation</h4>
              <ul className="footer-list">
                <li>
                  <Link href="/" className="footer-link">Home</Link>
                </li>
                <li>
                  <Link href="/newmovie" className="footer-link">Movies</Link>
                </li>
                <li>
                  <Link href="/my-list" className="footer-link">My List</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Account</h4>
              <ul className="footer-list">
                <li>
                  <Link href="/profile" className="footer-link">Profile</Link>
                </li>
                <li>
                  <Link href="/settings" className="footer-link">Settings</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Legal</h4>
              <ul className="footer-list">
                <li>
                  <Link href="/terms" className="footer-link">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/help" className="footer-link">Help Center</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} {Appname}. All rights reserved.
          </p>
          <div className="footer-social">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Twitter"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
