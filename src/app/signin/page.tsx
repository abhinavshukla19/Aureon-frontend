import { Signin_form } from "../../../Combiner/signin-form/signin_form";
import { Appname } from "../../../Global-exports/global-exports";
import Link from "next/link";
import "./signin.css"


const Signin=()=>{
    
    return(
        <div className="main-frame-div">
            <header className="header-div">
                <img src="/aureon-logo-icon.svg" alt="Aureon logo" className="logo" />
                <h1>{Appname}</h1>
            </header>
            <div className="body-div">
                <main className="content-div">
                    <section className="signin-content">
                        <Signin_form/>

                        <footer>
                            <p className="">
                                New to {Appname}?  <Link href="/signup">Create account</Link>
                            </p>
                            <p className="paragraph-text">
                                This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href="#">Learn more.</a>
                            </p>
                        </footer>
                    </section>
                </main>    
            </div>
            <div className="footer">
                <p className="contact">Questions? Call 000-800-919-1743</p>
            <div className="foot">
                <a href="https://help.netflix.com/support/412">FAQ</a>
                <a href="https://help.netflix.com/">Help Center</a>
                <a href="https://help.netflix.com/legal/termsofuse">Terms of Use</a>
                <a href="https://help.netflix.com/legal/privacy">Privacy</a>
            </div>
            <div className="foot2">
                <a href="https://www.netflix.com/login#">Cookies Preferences</a>
                <a id="footer2" href="https://help.netflix.com/legal/corpinfo">Coporate Information</a>
            </div>
            </div>
        </div>     
    )
}    


export default Signin;