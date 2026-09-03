import About from './sections/About/About.tsx'
import Experience from "./sections/Experience/Experience.tsx";
import Skills from './sections/Skills/Skills.tsx'
import Projects from './sections/Projects/Projects.tsx'
import Contact from './sections/Contact/Contact.tsx'
import Header from '../../components/common/Header/Header'

function Home() {
    return (
        <>
        <Header />

        <main>
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Contact />
        </main>
    </>
    )
}

export default Home;