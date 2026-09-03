

function ProjectCard() {
    return (
        <article>
            <header>
                <h3>프로젝트명</h3>
                <span>수상</span>
            </header>

            <p>프로젝트 설명</p>

            <dl>
                <div>
                    <dt>기간</dt>
                    <dd>2022.10~ 2022.11</dd>
                </div>


                <div>
                    <dt>담당 역할</dt>
                    <dd>백엔드 개발</dd>
                </div>
                <div>
                    <dt>기술 스택</dt>
                    <dd>Java, Spring Boot, MySQL</dd>
                </div>
            </dl>
            <div>
                <h4>주요 구현 내용</h4>
                <ul>
                    <li>주요 구현 내용을 작성해주세요.</li>
                </ul>
            </div>
            <footer>
                <a
                    href="https://github.com/dasolsee/저장소"
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub
                </a>

                <a
                    href="https://example.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    Demo
                </a>
            </footer>
        </article>
    )
}

export default ProjectCard;