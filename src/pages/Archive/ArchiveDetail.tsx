import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../../components/common/Header/Header'
import Footer from '../../components/common/Footer/Footer'
import ContactButton from '../../components/common/ContactButton/ContactButton'
import TopButton from '../../components/common/TopButton/TopButton'
import { supabase } from '../../lib/supabaseClient'
import styles from './ArchiveDetail.module.css'

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
    record_id: number
    content: string
    created_at: string
}

function ArchiveDetail() {
    // 주소에서 가져온 id는 문자열이므로 숫자로 바꿔 사용한다.
    const { id } = useParams()
    const recordId = Number(id)

    const [record, setRecord] = useState<ArchiveRecord | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const [replyText, setReplyText] = useState('')
    const [replies, setReplies] = useState<Reply[]>([])
    const [isReplyLoading, setIsReplyLoading] = useState(true)
    const [isReplySaving, setIsReplySaving] = useState(false)
    const [replyError, setReplyError] = useState('')

    useEffect(() => {
        async function getRecord() {
            setIsLoading(true)

            if (Number.isNaN(recordId)) {
                setRecord(null)
                setIsLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('archive_records')
                .select('*')
                .eq('id', recordId)
                .maybeSingle()

            if (error) {
                console.error('상세 기록 조회 실패:', error)
            }

            setRecord(data)
            setIsLoading(false)
        }

        getRecord()
    }, [recordId])

    useEffect(() => {
        async function getReplies() {
            setReplies([])
            setReplyError('')
            setIsReplyLoading(true)

            if (Number.isNaN(recordId)) {
                setIsReplyLoading(false)
                return
            }

            // 현재 기록에 작성된 답변만 오래된 순서부터 가져온다.
            const { data, error } = await supabase
                .from('archive_replies')
                .select('id, record_id, content, created_at')
                .eq('record_id', recordId)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('답변 조회 실패:', error)
                setReplyError('답변을 불러오지 못했습니다.')
                setIsReplyLoading(false)
                return
            }

            setReplies(data ?? [])
            setIsReplyLoading(false)
        }

        getReplies()
    }, [recordId])

    async function addReply(event: FormEvent<HTMLFormElement>) {
        // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막는다.
        event.preventDefault()

        const content = replyText.trim()

        if (!record || content.length === 0 || isReplySaving) {
            return
        }

        setIsReplySaving(true)
        setReplyError('')

        // 현재 보고 있는 Archive 기록 번호와 답변을 Supabase에 저장한다.
        const { data, error } = await supabase
            .from('archive_replies')
            .insert({
                record_id: record.id,
                content,
            })
            .select('id, record_id, content, created_at')
            .single()

        if (error) {
            console.error('답변 저장 실패:', error)
            setReplyError('답변을 저장하지 못했습니다.')
            setIsReplySaving(false)
            return
        }

        // 저장된 답변을 기존 목록 끝에 추가해 화면에 바로 표시한다.
        setReplies((currentReplies) => [...currentReplies, data])
        setReplyText('')
        setIsReplySaving(false)
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

    // 존재하지 않는 번호로 접속하면 안내와 목록 이동 링크를 표시한다.
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

                            {/* 코드는 문자열로 표시하므로 HTML 태그가 있어도 실행되지 않는다. */}
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
                                <ul
                                    className={styles.tags}
                                    aria-label="기술 태그"
                                >
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

                        <form
                            className={styles.replyForm}
                            onSubmit={addReply}
                        >
                            <input
                                className={styles.replyInput}
                                type="text"
                                aria-label="답변 내용"
                                placeholder="답변을 작성해주세요."
                                value={replyText}
                                onChange={(event) => {
                                    setReplyText(event.target.value)
                                    setReplyError('')
                                }}
                                required
                                maxLength={1000}
                            />

                            <button
                                className={styles.saveButton}
                                type="submit"
                                disabled={
                                    replyText.trim().length === 0 ||
                                    isReplySaving
                                }
                            >
                                {isReplySaving ? '저장 중...' : '저장'}
                            </button>
                        </form>

                        {isReplyLoading && (
                            <p className={styles.notice}>
                                답변을 불러오는 중입니다.
                            </p>
                        )}

                        {replyError && (
                            <p className={styles.notice} role="alert">
                                {replyError}
                            </p>
                        )}

                        {!isReplyLoading && (
                            <>
                                <p
                                    className={styles.replyCount}
                                    aria-live="polite"
                                >
                                    답변 {replies.length}개
                                </p>

                                <div className={styles.replyList}>
                                    {replies.map((reply) => (
                                        <article
                                            className={styles.replyCard}
                                            key={reply.id}
                                        >
                                            <time dateTime={reply.created_at}>
                                                {new Date(
                                                    reply.created_at
                                                ).toLocaleDateString('ko-KR')}
                                            </time>

                                            <p>{reply.content}</p>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </main>

            {/* Archive 상세 내용 뒤에 공통 Footer와 버튼을 표시한다. */}
            <Footer />
            <ContactButton />
            <TopButton />
        </>
    )
}

export default ArchiveDetail