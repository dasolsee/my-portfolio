import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/common/Header/Header'
import Footer from '../../components/common/Footer/Footer'
import ContactButton from '../../components/common/ContactButton/ContactButton'
import TopButton from '../../components/common/TopButton/TopButton'
import { supabase } from '../../lib/supabaseClient'
import styles from './ArchiveWrite.module.css'

type ArchiveRecord = {
    id: number
    title: string
    content: string
    code_language: string | null
    code: string | null
    tags: string | null
}

function ArchiveEdit() {
    const { id } = useParams()
    const recordId = Number(id)
    const navigate = useNavigate()

    const [record, setRecord] = useState<ArchiveRecord | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function getRecord() {
            if (Number.isNaN(recordId)) {
                setIsLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('archive_records')
                .select('id, title, content, code_language, code, tags')
                .eq('id', recordId)
                .maybeSingle()

            if (error) {
                console.error('수정할 기록 조회 실패:', error)
            }

            setRecord(data)
            setIsLoading(false)
        }

        getRecord()
    }, [recordId])

    async function updateRecord(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!record) {
            return
        }

        const formData = new FormData(event.currentTarget)
        const title = String(formData.get('title')).trim()
        const password = String(formData.get('password'))
        const content = String(formData.get('content')).trim()
        const codeLanguage =
            String(formData.get('codeLanguage')).trim() || null
        const code = String(formData.get('code')).trim() || null
        const tags = String(formData.get('tags')).trim() || null

        const { error: loginError } =
            await supabase.auth.signInWithPassword({
                email: import.meta.env.VITE_ARCHIVE_ADMIN_EMAIL,
                password,
            })

        if (loginError) {
            alert('관리자 비밀번호가 일치하지 않습니다.')
            return
        }

        const { error: updateError } = await supabase
            .from('archive_records')
            .update({
                title,
                content,
                code_language: codeLanguage,
                code,
                tags,
            })
            .eq('id', record.id)

        if (updateError) {
            await supabase.auth.signOut()
            console.error('기록 수정 실패:', updateError)
            alert('기록을 수정하지 못했습니다.')
            return
        }

        await supabase.auth.signOut()
        alert('기록이 수정되었습니다.')
        navigate(`/archive/${record.id}`)
    }

    if (isLoading) {
        return (
            <>
                <Header />
                <main className={styles.write}>
                    <div className="container">
                        <p>기록을 불러오는 중입니다.</p>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    if (!record) {
        return (
            <>
                <Header />
                <main className={styles.write}>
                    <div className="container">
                        <p>수정할 기록을 찾을 수 없습니다.</p>
                        <Link to="/archive">목록으로</Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />

            <main className={styles.write}>
                <div className="container">
                    <div className={styles.heading}>
                        <h1>기록 수정</h1>
                        <Link to={`/archive/${record.id}`}>상세로</Link>
                    </div>

                    <form className={styles.form} onSubmit={updateRecord}>
                        <label htmlFor="edit-title">제목</label>
                        <input
                            id="edit-title"
                            name="title"
                            type="text"
                            defaultValue={record.title}
                            required
                        />

                        <label htmlFor="edit-password">관리자 비밀번호</label>
                        <input
                            id="edit-password"
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            required
                        />

                        <label htmlFor="edit-content">본문</label>
                        <textarea
                            id="edit-content"
                            name="content"
                            rows={8}
                            defaultValue={record.content}
                            required
                        />

                        <label htmlFor="edit-code-language">코드 언어</label>
                        <select
                            id="edit-code-language"
                            name="codeLanguage"
                            defaultValue={record.code_language ?? ''}
                        >
                            <option value="">언어 선택</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="sql">SQL</option>
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="css">CSS</option>
                            <option value="c">C</option>
                            <option value="csharp">C#</option>
                            <option value="cpp">C++</option>
                        </select>

                        <label htmlFor="edit-code">코드</label>
                        <textarea
                            id="edit-code"
                            name="code"
                            rows={8}
                            defaultValue={record.code ?? ''}
                        />

                        <label htmlFor="edit-tags">해시태그</label>
                        <input
                            id="edit-tags"
                            name="tags"
                            type="text"
                            defaultValue={record.tags ?? ''}
                        />

                        <div className={styles.actions}>
                            <Link
                                className={styles.cancelButton}
                                to={`/archive/${record.id}`}
                            >
                                취소
                            </Link>

                            <button
                                className={styles.saveButton}
                                type="submit"
                            >
                                수정 저장
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
            <ContactButton />
            <TopButton />
        </>
    )
}

export default ArchiveEdit
