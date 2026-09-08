import { experiences } from '../../../../data/experience'
import styles from './Experience.module.css'

function Experience() {
    return (
        <section id="experience" aria-labelledby="experience-title">
            <div className="container">
                <h2 id="experience-title">EXPERIENCE</h2>

                <ol className={styles.timeline}>
                    {experiences.map((experience) => (
                        <li
                            className={styles.item}
                            key={`${experience.date}-${experience.title}`}
                        >
                            <div className={styles.content}>
                                {/* 연도와 활동명을 한 줄로 묶는다 */}
                                <div className={styles.heading}>
                                    <time className={styles.date}>
                                        {experience.date}
                                    </time>

                                    <h3 className={styles.projectName}>
                                        {experience.title}
                                    </h3>
                                </div>

                                {experience.project && (
                                    <p>{experience.project}</p>
                                )}

                                {experience.award && (
                                    <strong className={styles.award}>
                                        {experience.award}
                                    </strong>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}

export default Experience
