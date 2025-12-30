import Link from "next/link";
import { Signup_form } from "../../../Combiner/signup_form/signup_form";
import { Appname } from "../../../Global-exports/global-exports";
import "./signup.css";

const Signup = () => {
  return (
    <div className="signup-page">
      {/* HEADER */}
      <header className="signup-header">
        <div className="brand">
          <img src="/aureon-logo-icon.svg" alt="Aureon logo" className="logo" />
          <span>{Appname}</span>
        </div>
        <Link className="signin-btn" href="/signin" aria-label="Sign in to your account">
          Sign In
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="signup-main">
        <section className="signup-card" aria-labelledby="signup-heading">
          <Signup_form />

          <footer className="signup-card-footer">
            <p className="signup-footer-text">
              Already have an account? <Link href="/signin" className="signup-link">Sign in</Link>
            </p>
            <p className="terms">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.{" "}
              <a href="#" className="terms-link" aria-label="Learn more about reCAPTCHA">Learn more</a>.
            </p>
            <p className="terms">
              By signing up, you agree to our{" "}
              <a href="#" className="terms-link">Terms of Service</a> and{" "}
              <a href="#" className="terms-link">Privacy Policy</a>.
            </p>
          </footer>
        </section>
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="signup-bottom">
        <p className="contact-text">Questions? Call <a href="tel:000-800-919-1743" className="contact-link">000-800-919-1743</a></p>
        <div className="footer-links">
          <div className="footer-links-row">
            <a href="#" className="footer-link">FAQ</a>
            <a href="#" className="footer-link">Help Center</a>
            <a href="#" className="footer-link">Terms of Use</a>
            <a href="#" className="footer-link">Privacy</a>
          </div>
          <div className="footer-links-row">
            <a href="#" className="footer-link">Cookie Preferences</a>
            <a href="#" className="footer-link">Corporate Information</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
