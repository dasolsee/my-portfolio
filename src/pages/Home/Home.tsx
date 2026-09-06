import About from './sections/About/About.tsx'
import Experience from "./sections/Experience/Experience.tsx";
import Skills from './sections/Skills/Skills.tsx'
import Projects from './sections/Projects/Projects.tsx'
import Contact from './sections/Contact/Contact.tsx'
import Header from '../../components/common/Header/Header'
import Footer from '../../components/common/Footer/Footer'
import TopButton from '../../components/common/TopButton/TopButton'
import ContactButton from '../../components/common/ContactButton/ContactButton'


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

        {/* 모든 홈 섹션이 끝난 뒤 페이지 하단에 Footer,ContactButton,TopButton을 표시한다. */}
        <Footer />
        <ContactButton/>
        <TopButton />
    </>
    )
}

export default Home;