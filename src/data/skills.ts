import awsIcon from '../assets/icons/aws.svg'
import cssIcon from '../assets/icons/css.svg'
import dockerIcon from '../assets/icons/docker.svg'
import figmaIcon from '../assets/icons/figma.svg'
import gitIcon from '../assets/icons/git.svg'
import githubIcon from '../assets/icons/github.svg'
import htmlIcon from '../assets/icons/html.svg'
import javaIcon from '../assets/icons/java.svg'
import javascriptIcon from '../assets/icons/javascript.svg'
import linuxIcon from '../assets/icons/linux.svg'
import mysqlIcon from '../assets/icons/mysql.svg'
import nginxIcon from '../assets/icons/nginx.svg'
import nodejsIcon from '../assets/icons/nodejs.svg'
import notionIcon from '../assets/icons/notion.svg'
import postgresqlIcon from '../assets/icons/postgresql.svg'
import postmanIcon from '../assets/icons/postman.svg'
import reactIcon from '../assets/icons/react.svg'
import springBootIcon from '../assets/icons/spring-boot.svg'
import supabaseIcon from '../assets/icons/supabase.svg'
import typescriptIcon from '../assets/icons/typescript.svg'
import vercelIcon from '../assets/icons/vercel.svg'
import viteIcon from '../assets/icons/vite.svg'

type Skill = {
    name: string
    icon: string
}

type SkillGroup = {
    title: string
    skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
    {
        title: 'Language',
        skills: [
            { name: 'Java', icon: javaIcon },
            { name: 'JavaScript', icon: javascriptIcon },
            { name: 'TypeScript', icon: typescriptIcon },
        ],
    },
    {
        title: 'Frontend',
        skills: [
            { name: 'HTML5', icon: htmlIcon },
            { name: 'CSS3', icon: cssIcon },
            { name: 'React', icon: reactIcon },
            { name: 'Vite', icon: viteIcon },
        ],
    },
    {
        title: 'Backend',
        skills: [
            { name: 'Spring Boot', icon: springBootIcon },
            { name: 'Node.js', icon: nodejsIcon },
        ],
    },
    {
        title: 'Database',
        skills: [
            { name: 'MySQL', icon: mysqlIcon },
            { name: 'PostgreSQL', icon: postgresqlIcon },
            { name: 'Supabase', icon: supabaseIcon },
        ],
    },
    {
        title: 'DevOps & Cloud',
        skills: [
            { name: 'Linux', icon: linuxIcon },
            { name: 'Docker', icon: dockerIcon },
            { name: 'Nginx', icon: nginxIcon },
            { name: 'AWS', icon: awsIcon },
            { name: 'Vercel', icon: vercelIcon },
        ],
    },
    {
        title: 'Tools',
        skills: [
            { name: 'Git', icon: gitIcon },
            { name: 'GitHub', icon: githubIcon },
            { name: 'Postman', icon: postmanIcon },
            { name: 'Figma', icon: figmaIcon },
            { name: 'Notion', icon: notionIcon },
        ],
    },
]
