import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header/Header'
import Footer from '../../components/common/Footer/Footer'
import ContactButton from '../../components/common/ContactButton/ContactButton'
import TopButton from '../../components/common/TopButton/TopButton'
import { supabase } from '../../lib/supabaseClient'
import styles from './ArchiveWrite.module.css'

function ArchiveWrite() {
    // 저장이 끝나면 Archive 목록으로 이동할 때 사용한다.
    const navigate = useNavigate()

    async function saveRecord(event: FormEvent<HTMLFormElement>) {
        // form 제출로 페이지가 새로고침되는 것을 막는다.
        event.preventDefault()

        // 입력창의 name을 이용해 작성한 값을 가져온다.
        const formData = new FormData(event.currentTarget)

        const title = String(formData.get('title')).trim()
        const password = String(formData.get('password'))
        const content = String(formData.get('content')).trim()
        const codeLanguage =
            String(formData.get('codeLanguage')).trim() || null
        const code = String(formData.get('code')).trim() || null
        const tags = String(formData.get('tags')).trim() || null

        // 입력한 비밀번호로 Supabase 관리자 로그인을 시도한다.
        const { error: loginError } =
            await supabase.auth.signInWithPassword({
                email: import.meta.env.VITE_ARCHIVE_ADMIN_EMAIL,
                password: password,
            })

        if (loginError) {
            alert('관리자 비밀번호가 일치하지 않습니다.')
            return
        }

        // 로그인이 성공하면 입력한 기록을 Supabase에 저장한다.
        const { error: saveError } = await supabase
            .from('archive_records')
            .insert({
                title: title,
                content: content,
                code_language: codeLanguage,
                code: code,
                tags: tags,
            })

        if (saveError) {
            await supabase.auth.signOut()
            console.error('기록 저장 실패:', saveError)
            alert('기록을 저장하지 못했습니다.')
            return
        }

        // 저장이 끝나면 관리자 로그인을 해제한다.
        await supabase.auth.signOut()

        alert('기록이 저장되었습니다.')
        navigate('/archive')
    }

    return (
        <>
            <Header />

            <main className={styles.write}>
                <div className="container">
                    <div className={styles.heading}>
                        <h1>기록 작성</h1>

                        <Link to="/archive">목록으로</Link>
                    </div>

                    {/* 문제 해결 기록 입력 폼 */}
                    <form
                        className={styles.form}
                        onSubmit={saveRecord}
                    >
                        {/* React에서는 for 대신 htmlFor를 사용한다. */}
                        <label htmlFor="title">제목</label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="제목을 작성해주세요."
                            required
                        />

                        <label htmlFor="password">관리자 비밀번호</label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            required
                        />

                        <label htmlFor="content">본문</label>

                        {/* 기본적으로 약 8줄 정도 높이로 설정한다. */}
                        <textarea
                            id="content"
                            name="content"
                            placeholder="문제 상황을 작성해주세요."
                            rows={8}
                            required
                        />

                        <label htmlFor="code-language">코드 언어</label>

                        {/* 사용자가 코드 언어 하나를 선택하는 메뉴다. */}
                        <select
                            id="code-language"
                            name="codeLanguage"
                            defaultValue=""
                        >
                            <option value="">언어 선택</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="sql">SQL</option>
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="c">C</option>
                            <option value="csharp">C#</option>
                            <option value="cpp">C++</option>
                        </select>

                        <label htmlFor="code">코드</label>

                        <textarea
                            id="code"
                            name="code"
                            placeholder="관련 코드를 작성해주세요."
                            rows={8}
                        />

                        <label htmlFor="tags">해시태그</label>

                        <input
                            id="tags"
                            name="tags"
                            type="text"
                            placeholder="예: Spring Boot, Redis, 캐시"
                        />

                        <div className={styles.actions}>
                            <Link
                                className={styles.cancelButton}
                                to="/archive"
                            >
                                취소
                            </Link>

                            <button
                                className={styles.saveButton}
                                type="submit"
                            >
                                저장
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

export default ArchiveWrite