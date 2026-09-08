import { useEffect, useState } from 'react'

function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        function updateActiveSection() {
            const sections = sectionIds
                .map((id) => document.getElementById(id))
                .filter((section) => section !== null)

            if (sections.length === 0) {
                setActiveSection('')
                return
            }

            // 화면 위쪽에서 약 1/3 지점을 지난 섹션을 현재 영역으로 본다.
            const position = window.scrollY + window.innerHeight * 0.35
            let currentSection = sections[0].id

            sections.forEach((section) => {
                if (section.offsetTop <= position) {
                    currentSection = section.id
                }
            })

            setActiveSection(currentSection)
        }

        updateActiveSection()
        window.addEventListener('scroll', updateActiveSection, {
            passive: true,
        })
        window.addEventListener('resize', updateActiveSection)

        return () => {
            window.removeEventListener('scroll', updateActiveSection)
            window.removeEventListener('resize', updateActiveSection)
        }
    }, [sectionIds])

    return activeSection
}

export default useActiveSection
