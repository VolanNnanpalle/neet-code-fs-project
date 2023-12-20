'use client'

import Image from "next/image"; //react element
import styles from "./navbar.module.css";
import Link from "next/link";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
export default function Navbar() {
    //init user state
    const [user,setUser] = useState<User| null>(null)

    useEffect(() =>{
        const unsubscribed = onAuthStateChangedHelper((user)=>{
            setUser(user)
        })
        //cleanup subscription on unmount
        return () => unsubscribed();    
    })

    return (
        <nav className={styles.nav}>
            <Link href="/" className= {styles.logoContainer}>
                <Image width={90} height={20}
                    src="/youtube-logo.svg" alt="Youtube Logo">
                </Image>
            </Link>
            {
                //  TODO: Add upload button 
            }
            <SignIn user={user}/>
        </nav>
    );
}