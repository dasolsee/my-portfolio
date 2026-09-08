import { Link } from 'react-router-dom'
import styles from './About.module.css'

function About() {
    return (
        <section id="about" aria-labelledby="about-title">
            <div className="container">
                <h1 id="about-title">ABOUT ME</h1>

                {/* 소개 글과 프로필 이미지를 하나의 콘텐츠 영역으로 구성 */}
                <div className={styles.content}>
                    <div className={styles.text}>
                        <h2>
                            안녕하세요.
                            <br />
                            백엔드 개발자 신다솔입니다.
                        </h2>

                        <p className={styles.message}>
                            사용자의 경험을 바탕으로 더 나은 세상을 만들고자 합니다.
                        </p>

                        <p>
                            Spring Boot와 Java를 학습하며
                            <br />
                            직접 구현하는 예비 개발자입니다.
                        </p>

                        {/* 성격이 같은 개인 정보를 2열 정보 영역으로 구성 */}
                        <div className={styles.info}>
                            <div>
                                <strong>이메일</strong>
                               {/*눌렀을 때 실행할 동작 메일 연결*/}
                                <a href="mailto:dasol_2@naver.com">
                                {/*화면에 보이는 메일 주소*/}
                                    dasol_2@naver.com
                                </a>
                            </div>

                            <div>
                                <strong>자기계발</strong>
                                <span>정보처리기사, Sqld, 지능형홈관리사</span>
                            </div>

                            <div>
                                <strong>연락처</strong>
                                <a href="tel:010-8017-2579">
                                    010-8017-2579
                                </a>
                            </div>

                            <div>
                                <strong>Git</strong>

                {/*rel="noreferrer"은 새 창으로 외부 사이트 열 때, 현재 페이지의 주소정보를 외부 사이트에 전달하지 않도록하는 속성*/}
                                <a
                                    href="https://github.com/dasolsee"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    github.com/dasolsee
                                </a>
                            </div>

                            <div>
                                <strong>위치</strong>
                                <span>서울특별시 강남구</span>
                            </div>
                        </div>
                    </div>

                    <div
                        className={styles.profile}
                        role="img"
                        aria-label="신다솔 프로필 이미지"
                    >
                        프로필 이미지
                    </div>
                </div>

                {/* Archive 페이지로 이동하는 카드형 링크 */}
                <Link className={styles.archiveCard} to="/archive">
                    <div>
                        <strong>ARCHIVE</strong>
                        <p>개발 문제 해결 기록</p>
                    </div>

                    <span>보러가기 →</span>
                </Link>
            </div>
        </section>
    )
}

export default About
