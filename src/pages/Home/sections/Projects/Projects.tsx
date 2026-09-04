import ProjectCard from './ProjectCard';
import styles from './Projects.module.css'

function Projects() {
    return (
        <section id ="projects" aria-labelledby="projects-title">
            <div className="container">
                <h2 id ="projects-title">PROJECTS</h2>

                <div className={styles.grid}>
                    <ProjectCard />
                </div>
            </div>
        </section>
    )
}

export default Projects;