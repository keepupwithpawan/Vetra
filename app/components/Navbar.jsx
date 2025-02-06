"use client"
import '../styles/Navbar.css'
import { useRouter } from 'next/navigation';

export default function Navbar() {
 const router = useRouter();
    const ContactRedirect = ()=>{
        router.push('/contact')
    }
    const aboutRedirect = () =>{
        router.push('/about')
    }
        return (
            <div id="nav">
                <div id="left">
                    <p>V</p>
                </div>

                <div id="floating-bar">
                    <div id="right">
                        <ul>
                            <li>Pricing</li>
                            <li onClick={aboutRedirect}>About</li>
                            <li onClick={ContactRedirect}>Contact</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }