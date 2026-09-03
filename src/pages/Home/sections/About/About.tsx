function About() {
    return (
        <section id ="about" aria-labelledby="about-title"> {/* aria-labelledby는 웹전근성을 위한 aria 속성 */}
            <div className="container">
                <h1 id ="about-title">ABOUT ME</h1>
                <h1>
                    안녕하세요.
                    <br />
                    백엔드 개발자 신다솔입니다.
                </h1>
                <p>
                    사용자의 경험을 바탕으로 더 나은 세상을 만들고자 합니다.
                </p>
                <p>
                    Spring Boot와 Java를 학습하며
                    <br />
                    직접 구현하는 예비 개발자입니다.
                </p>
                <div>
                    <a href="mailto:dasol_2@naver.com">
                        Email
                    </a>
                    <a href="https://github.com/dasolsee"
                        target="_blank"
                        rel="noreferrer">GitHub</a>
                </div>
                <div role="img" aria-label="신다솔 프로필 이미지">
                    프로필 이미지
                </div>
            </div>
        </section>
    )
}

export default About;