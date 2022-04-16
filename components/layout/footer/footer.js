import Link from 'next/link'
import styles from '../../../styles/Layout/Footer.module.scss'
import PersonalLink from './personalLink'
import Icon from './icon'
import {
    personalLinkData,
    techsContainerOneIcons,
    techsContainerTwoIcons,
} from './footerData'

export default function Footer() {
    const PersonalLinks = personalLinkData.map((item, idx) => {
        const { id, url, imageSrc, imageAlt, text } = item
        return (
            <PersonalLink
                key={id}
                url={url}
                imageSrc={imageSrc}
                imageAlt={imageAlt}
                text={text}
            />
        )
    })

    const IconsContainerOne = techsContainerOneIcons.map((item, idx) => {
        const { id, imageSrc, imageAlt, widthAndHeight } = item
        return (
            <Icon
                key={id}
                imageSrc={imageSrc}
                imageAlt={imageAlt}
                widthAndHeight={widthAndHeight}
            />
        )
    })

    const IconsContainerTwo = techsContainerTwoIcons.map((item, idx) => {
        const { id, imageSrc, imageAlt, widthAndHeight } = item
        return (
            <Icon
                key={id}
                imageSrc={imageSrc}
                imageAlt={imageAlt}
                widthAndHeight={widthAndHeight}
            />
        )
    })

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.col1} id="iJustWantToFormatThis">
                    <h3 className={styles['contact-info--title']}>
                        Contact Info
                    </h3>
                    {PersonalLinks}
                </div>
                <div className={styles.col2}>
                    <h3 className={styles.pageInfoIntro}>
                        Webpage developed with the technologies:
                    </h3>
                    <div className={styles.techsContainerOne}>
                        {IconsContainerOne}
                    </div>
                    <div className={styles.techsContainerTwo}>
                        {IconsContainerTwo}
                    </div>
                </div>
                <div className={styles.col3}>
                    <h3 className={styles.attributionsTitle}>Icons from:</h3>
                    <Link href="https://icons8.com">
                        <a className={styles.attributionsLink} target="_blank">
                            Icons8
                        </a>
                    </Link>
                    <small>Developed by Maveryck Maya, 2022.</small>
                </div>
            </div>
        </footer>
    )
}
