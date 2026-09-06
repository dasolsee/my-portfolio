// CSS Module에 작성한 클래스 이름을 styles로 불러온다.
import styles from './Skills.module.css'

function Skills() {
    // Skills 컴포넌트가 화면에 보여줄 JSX를 반환한다.
    return (
        <section
            id="skills"
            aria-labelledby="skills-title"
        >
            {/* 여러 섹션의 너비를 동일하게 맞추는 전역 container 클래스 */}
            <div className="container">
                <h2 id="skills-title">Skills</h2>

                <div className={styles.intro}>
                    <h3>서비스 구현에 필요한 기술을 학습하고 있습니다.</h3>

                    <p>
                        백엔드 개발을 중심으로 프로젝트에 필요한 기술을 익히고 있습니다.
                    </p>
                </div>

                {/* 기술의 사용 목적에 따라 네 가지 카테고리로 구분 */}
                <div className={styles.groups}>
                    <article className={styles.group}>
                        <h3>Language</h3>

                        <p>
                            서버 로직 구현에 사용하는 프로그래밍 언어입니다.
                        </p>

                        {/* 같은 카테고리에 포함된 기술을 목록으로 구성 */}
                        <ul>
                            <li className={styles.java}>Java</li>
                        </ul>
                    </article>

                    <article className={styles.group}>
                        <h3>Backend</h3>

                        <p>
                            웹 애플리케이션의 서버를 구현하는 기술입니다.
                        </p>

                        <ul>
                            <li className={styles.spring}>Spring Boot</li>
                        </ul>
                    </article>

                    <article className={styles.group}>
                        <h3>Database</h3>

                        <p>
                            서비스 데이터를 저장하고 관리하는 기술입니다.
                        </p>

                        <ul>
                            <li className={styles.mysql}>MySQL</li>
                        </ul>
                    </article>

                    <article className={styles.group}>
                        <h3>Tools</h3>

                        <p>
                            코드와 프로젝트 변경 이력을 관리하는 도구입니다.
                        </p>

                        <ul>
                            <li className={styles.git}>Git</li>
                            <li className={styles.github}>GitHub</li>
                        </ul>
                    </article>
                </div>
            </div>
        </section>
    )
}

// 다른 파일에서 Skills 컴포넌트를 불러올 수 있도록 내보낸다.
export default Skills