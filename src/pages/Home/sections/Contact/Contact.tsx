import styles from './Contact.module.css'

function Contact() {
    return (
        <section id="contact" aria-labelledby="contact-title">
            <div className="container">
                <h2 id="contact-title">CONTACT</h2>

                <p className={styles.intro}>
                    개발 관련 문의사항은 편하게 연락주세요.
                </p>

                {/* 연락 수단 목록 */}
                <ul className={styles.contactList}>
                    <li>
                        <a
                            className={styles.contactLink}
                            href="https://github.com/dasolsee"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span
                                className={styles.icon}
                                aria-hidden="true"
                            >
                                G
                            </span>
                            <span>GitHub</span>
                        </a>
                    </li>

                    <li>
                        <a
                            className={styles.contactLink}
                            href="tel:010-0000-0000"
                        >
                            <span
                                className={styles.icon}
                                aria-hidden="true"
                            >
                                T
                            </span>
                            <span>010-0000-0000</span>
                        </a>
                    </li>

                    <li>
                        <a
                            className={styles.contactLink}
                            href="mailto:dasol_2@naver.com"
                        >
                            <span
                                className={styles.icon}
                                aria-hidden="true"
                            >
                                E
                            </span>
                            <span>dasol_2@naver.com</span>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default Contact