import styles from './Contact.module.css'
import githubIcon from '../../../../assets/icons/github.svg'
import phoneIcon from '../../../../assets/icons/phone.svg'
import emailIcon from '../../../../assets/icons/email.svg'

function Contact() {
    return (
        <section id="contact" aria-labelledby="contact-title">
            <div className="container">
                <h2 id="contact-title">Contact</h2>

                <div className={styles.intro}>
                    <h3>새로운 기회와 협업을 기다립니다.</h3>

                    <p>
                        프로젝트와 개발에 관한 이야기를 기다리고 있어요.
                        편한 방법으로 연락해주세요.
                    </p>
                </div>

                {/* 연락 방법마다 전체 카드를 클릭할 수 있도록 링크로 구성 */}
                <ul className={styles.contactList}>
                    <li>
                        <a
                            className={styles.contactLink}
                            href="https://github.com/dasolsee"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className={styles.icon}>
                                <img src={githubIcon} alt="" />
                            </span>

                            <span className={styles.label}>GitHub</span>
                            <strong>github.com/dasolsee</strong>

                            <span className={styles.description}>
                                프로젝트 코드를 확인해보세요.
                            </span>
                        </a>
                    </li>

                    <li>
                        <a
                            className={styles.contactLink}
                            href="tel:01080172579"
                        >
                            <span className={styles.icon}>
                                <img src={phoneIcon} alt="" />
                            </span>

                            <span className={styles.label}>Phone</span>
                            <strong>010-8017-2579</strong>

                            <span className={styles.description}>
                                편한 시간에 연락해주세요.
                            </span>
                        </a>
                    </li>

                    <li>
                        <a
                            className={styles.contactLink}
                            href="mailto:dasol_2@naver.com"
                        >
                            <span className={styles.icon}>
                                <img src={emailIcon} alt="" />
                            </span>

                            <span className={styles.label}>Email</span>
                            <strong>dasol_2@naver.com</strong>

                            <span className={styles.description}>
                                확인 후 빠르게 답변드릴게요.
                            </span>
                        </a>
                    </li>
                </ul>

                <p className={styles.closing}>
                    언제든 편하게 연락해주세요 :)
                </p>
            </div>
        </section>
    )
}

export default Contact