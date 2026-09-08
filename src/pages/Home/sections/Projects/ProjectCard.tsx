import type { Project } from '../../../../data/projects'
import styles from './Projects.module.css'

type ProjectCardProps = {
    project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
    return (
        <article className={styles.card}>
            <header className={styles.cardHeader}>
                <div>
                    <span className={styles.period}>{project.period}</span>
                    <h3>{project.title}</h3>
                </div>
                {project.award && (
                    <span className={styles.badge}>{project.award}</span>
                )}
            </header>

            <p className={styles.summary}>{project.summary}</p>

            <dl className={styles.info}>
                <div>
                    <dt>담당 역할</dt>
                    <dd>{project.role}</dd>
                </div>
                <div>
                    <dt>참여 인원</dt>
                    <dd>{project.members}</dd>
                </div>
            </dl>

            <div className={styles.features}>
                <h4>{project.featuresTitle}</h4>
                <ul>
                    {project.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                    ))}
                </ul>
            </div>

            <div className={styles.technologies}>
                <h4>기술 스택</h4>
                <ul>
                    {project.technologies.map((technology) => (
                        <li key={technology.name} className={styles[technology.color]}>
                            {technology.name}
                        </li>
                    ))}
                </ul>
            </div>

            {(project.github || project.readme) && (
                <footer className={styles.links}>
                    {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer">
                            GitHub ↗
                        </a>
                    )}
                    {project.readme && (
                        <a href={project.readme} target="_blank" rel="noreferrer">
                            README ↗
                        </a>
                    )}
                </footer>
            )}
        </article>
    )
}

export default ProjectCard
