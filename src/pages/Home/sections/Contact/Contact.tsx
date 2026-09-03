function Contact() {
    return (
        <section id="contact" aria-labelledby="contact-title">
            <div className="container">
                <h2 id="contact-title">CONTACT</h2>
                <p>함께 이야기하고 싶다면 편하게 연락해주세요.</p>
                <ul>
                    <li>
                        <a href="mailto:dasol_2@naver.com">Email</a>
                    </li>
                    <li>
                        <a href="https://github.com/dasolsee"
                            target="_blank"
                            rel="noreferrer">
                            GitHub
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default Contact