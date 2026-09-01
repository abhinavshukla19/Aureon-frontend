import { Signin_form } from "./component/signin_form";
import { Appname } from "@/components/Global-exports/global-exports";
import Link from "next/link";
import "../auth-cosmic-shell.css";
import "./signin.css";



const Signin = () => {

  
  return (
    <div className="main-frame-div">
      {/* HEADER */}
      <header className="header-div">
        <Link href="/" className="brand" aria-label={`${Appname} home`}>
          <img src="/aureon-logo-icon.svg" alt="" className="logo" />
          <span>{Appname}</span>
        </Link>
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
            </footer>
          </section>
        </main>
      </div>

      {/* BOTTOM FOOTER */}
      <footer className="footer">
        <div className="footer-links">
          <div className="footer-links-row">
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