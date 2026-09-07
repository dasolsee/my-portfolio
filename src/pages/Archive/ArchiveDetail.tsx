import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../../components/common/Header/Header'
import Footer from '../../components/common/Footer/Footer'
import { supabase } from '../../lib/supabaseClient'
import styles from './ArchiveDetail.module.css'
import ContactButton from '../../components/common/ContactButton/ContactButton'
import TopButton from '../../components/common/TopButton/TopButton'

type ArchiveRecord = {
    id: number
    created_at: string
    title: string
    content: string
    code_language: string | null
    code: string | null
    tags: string | null
    resolved: boolean
}

type Reply = {
    id: string
    recordId: number
    content: string
    createdAt: string
}

function ArchiveDetail() {
    // 주소에서 가져온 id는 문자열이므로 숫자로 바꿔 기록 번호와 비교한다.
    const { id } = useParams()

    const [record, setRecord] = useState<ArchiveRecord | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [replyText, setReplyText] = useState('')
    const [replies, setReplies] = useState<Reply[]>([])

    useEffect(() => {
        async function getRecord() {
            const { data, error } = await supabase
                .from('archive_records')
                .select('*')
                .eq('id', Number(id))
                .maybeSingle()

            if (error) {
                console.error('상세 기록 조회 실패:', error)
            }

            setRecord(data)
            setIsLoading(false)
        }

        getRecord()
    }, [id])

    // 다른 기록의 답변이 섞이지 않도록 현재 기록 번호로 구분한다.
    const visibleReplies = replies.filter(
        (reply) => reply.recordId === record?.id
    )

    function addReply(event: FormEvent<HTMLFormElement>) {
        // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막는다.
        event.preventDefault()

        const content = replyText.trim()

        if (!record || content.length === 0) {
            return
        }

        const newReply: Reply = {
            id: crypto.randomUUID(),
            recordId: record.id,
            content,
            createdAt: new Date().toISOString(),
        }

        // 기존 답변을 유지한 채 새 답변을 추가한다.
        setReplies((currentReplies) => [...currentReplies, newReply])
        setReplyText('')
    }

    if (isLoading) {
        return (
            <>
                <Header />

                <main className={styles.detail}>
                    <div className="container">
                        <p>기록을 불러오는 중입니다.</p>
                    </div>
                </main>

                <Footer />
                <ContactButton />
                <TopButton />
            </>
        )
    }

    // 존재하지 않는 번호로 접속하면 안내와 목록으로 돌아가는 링크를 표시한다.
    if (!record) {
        return (
            <>
                <Header />

                <main className={styles.detail}>
                    <div className="container">
                        <h1 className={styles.notFound}>
                            기록을 찾을 수 없습니다.
                        </h1>

                        <Link className={styles.backLink} to="/archive">
                            목록으로
                        </Link>
                    </div>
                </main>
                {/* 기록을 찾지 못한 화면에도 공통 버튼을 표시한다. */}
                <Footer />
                <ContactButton />
                <TopButton />
            </>
        )
    }

    return (
        <>
            <Header />

            <main className={styles.detail}>
                <div className="container">
                    <Link className={styles.backLink} to="/archive">
                        목록으로
                    </Link>

                    {/* 제목, 본문, 코드, 작성 정보를 하나의 기록 카드로 묶는다. */}
                    <article className={styles.card}>
                        <header className={styles.cardHeader}>
                            <h1>{record.title}</h1>

                            <div className={styles.status}>
                                <span
                                    className={`${styles.check} ${
                                        record.resolved
                                            ? styles.resolved
                                            : styles.unresolved
                                    }`}
                                    aria-hidden="true"
                                >
                                    ✓
                                </span>

                                <span>
                                    {record.resolved ? '해결 완료' : '미해결'}
                                </span>
                            </div>
                        </header>

                        <div className={styles.body}>
                            <section className={styles.block}>
                                <h2>본문</h2>
                                <p>{record.content}</p>
                            </section>

                            {/* 코드를 문자열로 표시하므로 HTML 태그가 있어도 실행되지 않는다. */}
                            {record.code && (
                                <div className={styles.codeArea}>
                                    <p className={styles.codeLabel}>
                                        {record.code_language
                                            ? `관련 코드 · ${record.code_language}`
                                            : '관련 코드'}
                                    </p>

                                    <pre className={styles.codeBlock}>
                                        <code>{record.code}</code>
                                    </pre>
                                </div>
                            )}
                        </div>

                        <footer className={styles.cardFooter}>
                            {record.tags && (
                                <ul className={styles.tags} aria-label="기술 태그">
                                    {record.tags
                                        .split(',')
                                        .map((tag) => tag.trim())
                                        .filter((tag) => tag.length > 0)
                                        .map((tag) => (
                                            <li key={tag}>#{tag}</li>
                                        ))}
                                </ul>
                            )}

                            <time dateTime={record.created_at}>
                                작성일{' '}
                                {new Date(
                                    record.created_at
                                ).toLocaleDateString('ko-KR')}
                            </time>
                        </footer>
                    </article>

                    <section
                        className={styles.replies}
                        aria-labelledby="replies-title"
                    >
                        <h2 id="replies-title">답변</h2>

                        <form className={styles.replyForm} onSubmit={addReply}>
                            <input
                                className={styles.replyInput}
                                type="text"
                                aria-label="답변 내용"
                                placeholder="답변을 작성해주세요."
                                value={replyText}
                                onChange={(event) =>
                                    setReplyText(event.target.value)
                                }
                                required
                                maxLength={1000}
                            />

                            <button
                                className={styles.saveButton}
                                type="submit"
                                disabled={replyText.trim().length === 0}
                            >
                                저장
                            </button>
                        </form>

                        <p className={styles.notice}>
                            답변은 현재 화면에서만 유지됩니다.
                        </p>

                        <p className={styles.replyCount} aria-live="polite">
                            답변 {visibleReplies.length}개
                        </p>

                        <div className={styles.replyList}>
                            {visibleReplies.map((reply) => (
                                <article
                                    className={styles.replyCard}
                                    key={reply.id}
                                >
                                    <time dateTime={reply.createdAt}>
                                        {new Date(
                                            reply.createdAt
                                        ).toLocaleDateString('ko-KR')}
                                    </time>

                                    <p>{reply.content}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Archive 상세 내용이 끝난 뒤 공통 Footer와 버튼 들을 표시한다. */}
            <Footer />
            <ContactButton />
            <TopButton/>
        </>
    )
}

export default ArchiveDetail