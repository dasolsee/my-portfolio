import styles from './Experience.module.css'

function Experience() {
    return (
        <section id="experience" aria-labelledby="experience-title">
            <div className="container">
                <h2 id="experience-title">EXPERIENCE</h2>

                <ol className={styles.timeline}>
                    <li className={styles.item}>
                        <div className={styles.content}>
                            {/* 연도와 활동명을 한 줄로 묶는다 */}
                            <div className={styles.heading}>
                                <time className={styles.date}>2026.09 - 2026.09</time>
                                <h3>프로젝트 이름?이나 활동명</h3>
                            </div>

                            <p>담당했던 역할 경험 등등..</p>
                            <a href="#projects">관련 프로젝트 보기?</a>

                        </div>
                    </li>
                </ol>
            </div>
        </section>
    )
}

export default Experience