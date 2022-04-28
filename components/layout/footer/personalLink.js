import Link from 'next/link'
import Image from 'next/image'
import styles from '../../../styles/Layout/Footer.module.scss'

export default function PersonalLink({ url, imageSrc, imageAlt, text }) {
    return (
        <div className={styles.linkContainer}>
            <Link href={url}>
                <a
                    className={styles.footerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width={30}
                        height={30}
                        className={styles.icon}
                    />
                    <p className={styles.linkText}>{text}</p>
                </a>
            </Link>
        </div>
    )
}
