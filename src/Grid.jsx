import React from "react";

const images = [
    "https://i.pinimg.com/236x/57/5c/1c/575c1c16f7638db8ed5a5dac4cdb434a.jpg",
    "https://i.pinimg.com/474x/e2/06/12/e2061205117bf8b0212cb92701daf257.jpg",
    "https://i.pinimg.com/474x/87/d4/2e/87d42e0cbd8107d5e62a6421d07431ae.jpg",
    "https://i.pinimg.com/474x/c6/3e/65/c63e654185b56558fb6d84460ef058f2.jpg",
    "https://i.pinimg.com/236x/ed/22/95/ed229537f5cb0652e27aaddd76a3e174.jpg",
    "https://i.pinimg.com/474x/27/06/8c/27068c587a3f0101b5f2773eee1aa5ad.jpg",
    "https://i.pinimg.com/236x/b4/8d/81/b48d81657d26a49292278ccf4011d168.jpg",
    "https://i.pinimg.com/474x/01/11/b7/0111b72edb489ee6aba96f3e8287dc77.jpg",
    "https://i.pinimg.com/236x/02/e4/77/02e4771b051185d0cb900798ea612da1.jpg",
    "https://i.pinimg.com/236x/36/ab/ae/36abaed69bd5b4e84bf31d2ddc348a96.jpg",
    "https://i.pinimg.com/474x/9f/c4/ab/9fc4ab4451cb7a4a9a296eeed999e2b6.jpg",
    "https://i.pinimg.com/236x/c0/19/75/c019751c7491a631753e617c0bf345df.jpg",
    "https://i.pinimg.com/236x/4b/5a/ce/4b5acefbd891517243c447bcb1854187.jpg",
    "https://i.pinimg.com/236x/cd/f3/12/cdf31245fb9430ea31311181abd0ae11.jpg",
    "https://i.pinimg.com/474x/f1/ad/91/f1ad911a2c262549913b21e318313ad8.jpg",
    "https://i.pinimg.com/474x/e3/55/5b/e3555bba6c3f4587105a9650b50f6438.jpg",
    "https://i.pinimg.com/474x/c9/2f/15/c92f15d2e5aabf851698b0bb7927aea1.jpg",
    "https://i.pinimg.com/474x/bd/1c/56/bd1c5628b26db143dff37bef1f2609a9.jpg",
    "https://i.pinimg.com/474x/38/8d/62/388d623fad4165ded25eb6e64bfe64ab.jpg",
    "https://i.pinimg.com/236x/ce/f2/40/cef240a79e2fd87bb493381e474a5271.jpg",
];

export default function Grid() {
    return (
        <>
                <div id="nav">
            <div id="left">
                <p>VETRA</p>
            </div>

            <div id="right">
                <ul>
                    <li>Pricing</li>
                    <li>About</li>
                    <li>Contact</li>
                </ul>
            </div>
        </div>
        <div className="scrollable-container">
            <div className="pinterest-grid">
                {images.map((image, index) => (
                    <div className="grid-item" key={index}>
                        <img src={image} alt={`Pinterest Grid Item ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
        </>

    )
}