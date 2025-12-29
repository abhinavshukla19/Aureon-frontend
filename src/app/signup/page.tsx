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

        <Link className="signin-btn" href="/signin">Sign In</Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="signup-main">
        <section className="signup-card">
          <Signup_form />

          <footer className="signup-card-footer">
            <p>
              Already used {Appname}? <Link href="/signin">Sign in</Link>
            </p>
            <p className="terms">
              By signing up, you agree to our Terms and Conditions.
            </p>
          </footer>
        </section>
      </main>

      {/* BOTTOM TEXT */}
      <footer className="signup-bottom">
        Questions? Call 000-800-919-1743
      </footer>

    </div>
  );
};

export default Signup;
