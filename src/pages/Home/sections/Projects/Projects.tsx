import ProjectCard from './ProjectCard'
import styles from './Projects.module.css'

function Projects() {
    return (
        <section id="projects" aria-labelledby="projects-title">
            <div className="container">
                <h2 id="projects-title">Projects</h2>

                <div className={styles.intro}>
                    <h3>경험을 코드로 구현한 프로젝트입니다.</h3>

                    <p>
                        프로젝트에서 맡은 역할과 주요 구현 내용을 소개합니다.
                    </p>
                </div>

                {/* 데스크톱 화면에서 프로젝트 카드를 2열로 배치 */}
                <div className={styles.grid}>
                    <ProjectCard />
                    <ProjectCard />
                </div>
            </div>
        </section>
    )
}

export default Projects