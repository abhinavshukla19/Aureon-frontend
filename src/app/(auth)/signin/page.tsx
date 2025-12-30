import { Signin_form } from "../../../../Combiner/signin-form/signin_form";
import { Appname } from "../../../../Global-exports/global-exports";
import Link from "next/link";
import "./signin.css";

const Signin = () => {
  return (
    <div className="main-frame-div">
      {/* HEADER */}
      <header className="header-div">
        <div className="brand">
          <img src="/aureon-logo-icon.svg" alt="Aureon logo" className="logo" />
          <span>{Appname}</span>
        </div>
        <Link className="signup-btn" href="/signup" aria-label="Create a new account">
          Sign Up
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <div className="body-div">
        <main className="content-div">
          <section className="signin-content" aria-labelledby="signin-heading">
            <Signin_form />

            <footer className="signin-card-footer">
              <p className="signin-footer-text">
                New to {Appname}? <Link href="/signup" className="signin-link">Create account</Link>
              </p>
              <p className="paragraph-text">
                This page is protected by Google reCAPTCHA to ensure you're not a bot.{" "}
                <a href="#" className="terms-link" aria-label="Learn more about reCAPTCHA">Learn more</a>.
              </p>
            </footer>
          </section>
        </main>
      </div>

      {/* BOTTOM FOOTER */}
      <footer className="footer">
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

export default Signin;