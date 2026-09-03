import ProjectCard from './ProjectCard';

function Projects() {
    return (
        <section id ="projects" aria-labelledby="projects-title">
            <div className="container">
                <h2 id ="projects-title">PROJECTS</h2>

                <div>
                    <ProjectCard />
                </div>
            </div>
        </section>
    )
}

export default Projects;