import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../../components/common/Header/Header'
import Footer from '../../components/common/Footer/Footer'
import { archiveRecords } from './ArchiveRecords'
import styles from './ArchiveDetail.module.css'

type Reply = {
    id: string
    recordId: number
    content: string
    createdAt: string
}

// 상세 화면의 코드 블록과 태그에 사용할 예시다.
// 실제 저장 기능을 연결할 때 기록 데이터에 함께 포함할 수 있다.
const examples: Record<number, { code: string; tags: string[] }> = {
    1: {
        code: 'npm ci\nnpm run lint\nnpm run build',
        tags: ['Vite', 'npm', '오류 해결'],
    },
    2: {
        code: '<path fill="#4F76C4" ... />',
        tags: ['SVG', 'CSS', '아이콘'],
    },
    3: {
        code: '<h3 className={styles.projectName}>\n    프로젝트 이름\n</h3>',
        tags: ['React', 'CSS Modules'],
    },
    4: {
        code: 'node -v\nnpm -v\nnpm run dev',
        tags: ['Node.js', '개발 환경'],
    },
}

function ArchiveDetail() {
    // 주소에서 가져온 id는 문자열이므로 숫자로 바꿔 기록 번호와 비교한다.
    const { id } = useParams()
    const record = archiveRecords.find((item) => item.id === Number(id))

    const [replyText, setReplyText] = useState('')
    const [replies, setReplies] = useState<Reply[]>([])

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

                <Footer />
            </>
        )
    }

    const example = examples[record.id]

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
                                <h2>발생한 문제</h2>
                                <p>{record.problem}</p>
                            </section>

                            <section className={styles.block}>
                                <h2>확인과 시도</h2>

                                {/* 확인한 순서가 중요하므로 번호가 있는 목록을 사용한다. */}
                                <ol className={styles.attempts}>
                                    {record.attempts.map((attempt, index) => (
                                        <li key={index}>{attempt}</li>
                                    ))}
                                </ol>
                            </section>

                            <section className={styles.block}>
                                <h2>
                                    {record.resolved
                                        ? '해결 방법'
                                        : '현재 진행 상황'}
                                </h2>

                                <p>{record.solution}</p>
                            </section>

                            {/* 코드를 문자열로 표시하므로 HTML 태그가 있어도 실행되지 않는다. */}
                            {example && (
                                <div className={styles.codeArea}>
                                    <p className={styles.codeLabel}>
                                        관련 코드 · 예시
                                    </p>

                                    <pre className={styles.codeBlock}>
                                        <code>{example.code}</code>
                                    </pre>
                                </div>
                            )}

                            <section className={styles.block}>
                                <h2>배운 점</h2>
                                <p>{record.learned}</p>
                            </section>
                        </div>

                        <footer className={styles.cardFooter}>
                            <ul className={styles.tags} aria-label="기술 태그">
                                {example?.tags.map((tag) => (
                                    <li key={tag}>#{tag}</li>
                                ))}
                            </ul>

                            <time dateTime={record.date}>
                                작성일 {record.date}
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

            {/* Archive 상세 내용이 끝난 뒤 공통 Footer를 표시한다. */}
            <Footer />
        </>
    )
}

export default ArchiveDetail
