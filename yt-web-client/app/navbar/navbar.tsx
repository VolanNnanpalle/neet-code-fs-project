import Image from "next/image"; //react element
import styles from "./navbar.module.css";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/" className= {styles.logoContainer}>
                <Image width={90} height={20}
                    src="/youtube-logo.svg" alt="Youtube Logo">
                </Image>
            </Link>
        </nav>
    );
}