import githubIcon from '../../../assets/icons/github.svg'
import emailIcon from '../../../assets/icons/email.svg'
import styles from './ContactButton.module.css'

//화면에 플로팅되어 고정될 깃헙,이메일 연락 링크
function ContactButton() {
    return (
        <nav className={styles.floating} aria-label="빠른 연락">
            <a
                className={styles.githubLink}
                href="https://github.com/dasolsee"
                target="_blank"
                rel="noreferrer"
            >
                <img src={githubIcon} alt="" />
                <span>GitHub</span>
            </a>

            <a
                className={styles.emailLink}
                href="mailto:dasol_2@naver.com"
            >
                <img src={emailIcon} alt="" />
                <span>Email</span>
            </a>
        </nav>
    )
}

export default ContactButton