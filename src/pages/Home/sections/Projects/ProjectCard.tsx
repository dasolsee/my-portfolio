import styles from './Projects.module.css'

function ProjectCard() {
    return (
        <article className={styles.card}>
            <header className={styles.cardHeader}>
                <div>
                    <span className={styles.period}>
                        2022.10 - 2022.11
                    </span>

                    <h3>프로젝트명</h3>
                </div>

                <span className={styles.badge}>수상</span>
            </header>

            <p className={styles.summary}>
                프로젝트의 목적과 핵심 기능을 한 문장으로 소개합니다.
            </p>

            {/* 프로젝트의 기본 정보를 항목과 내용의 관계로 표현 */}
            <dl className={styles.info}>
                <div>
                    <dt>담당 역할</dt>
                    <dd>백엔드 개발</dd>
                </div>

                <div>
                    <dt>참여 인원</dt>
                    <dd>백엔드 3명, 프론트엔드 2명</dd>
                </div>
            </dl>

            <div className={styles.features}>
                <h4>주요 구현 내용</h4>

                <ul>
                    <li>Spring Security와 JWT를 이용한 인증·인가 구현</li>
                    <li>게시글과 댓글 CRUD API 구현</li>
                    <li>전역 예외 처리와 응답 형식 통일</li>
                </ul>
            </div>

            <div className={styles.technologies}>
                <h4>기술 스택</h4>

                {/* 기술별 색상을 적용할 수 있도록 각각 클래스를 연결 */}
                <ul>
                    <li className={styles.java}>Java</li>
                    <li className={styles.spring}>Spring Boot</li>
                    <li className={styles.mysql}>MySQL</li>
                    <li className={styles.jpa}>JPA</li>
                </ul>
            </div>

            <footer className={styles.links}>
                <a
                    href="https://github.com/dasolsee"
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub ↗
                </a>

                <a
                    href="https://github.com/dasolsee"
                    target="_blank"
                    rel="noreferrer"
                >
                    README ↗
                </a>
            </footer>
        </article>
    )
}

export default ProjectCard