import CubeVid from '../assets/cube.mp4';
import cubeShine from '../assets/cubeShine.mp4';
import cubeImg from '../assets/cubeImg.png';

export default function MainOne() {
    return (
        <div id="main">
            <div id="lander">
                <p id="heading">Discovery Engine for Developers</p>
                <p id="sub-heading">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque consectetur quos voluptas eius autem soluta!
                </p>
                <button>Get Started</button>
            </div>

            <div id="cube">
                <video 
                    src={CubeVid} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline // Helps ensure autoplay works on mobile devices
                ></video>
            </div>
        </div>
    );
}
