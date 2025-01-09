import './styles/SignIn.css';
import Vetra from "./assets/Vetra-Demo.mp4";
import VetraLogo from "./assets/Vetra-Logo.png";
import VetraV from "./assets/Vetra-V.jpg";

export default function SignIn() {
    return (
        <>
            <div id="sign-in-container">
                <div id="video-container">
                    <div id="video-content">
                        <img src={VetraV} alt="" />
                    </div>
                </div>

                <div id="auth-container">
                    <img src={VetraLogo} alt="" />
                    <div id="auth-box">
                        <div id="our-creds">
                            <input type="email" name="email" id="email" placeholder='Email' />
                            <input type="password" name="password" id="password" placeholder='Password' />
                        </div>

                        <input type="button" value="Explore Vetra" id='sign-in-btn' />

                        <div id="hr-container">
                            <hr />
                            <p>or</p>
                            <hr />
                        </div>

                        <div id="api-creds">
                            <button id="google" className='api'>
                                <i class="fa-brands fa-google"></i>
                                <p>Sign In with Google</p>
                            </button>
                            <button id="github" className='api'>
                                <i class="fa-brands fa-github"></i>
                                <p>Sign In with Github</p>
                            </button>
                        </div>
                    </div>

                    <p className='create-account'>or <span id='create-acc'>create an account</span></p>
                </div>
            </div>
        </>
    );
}
