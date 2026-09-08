import type { FormEventHandler } from 'react'
import type { Reply } from '../../../api/archive'
import CodeViewer from './CodeViewer'
import styles from '../ArchiveDetail.module.css'

type ReplySectionProps = {
    replies: Reply[]
    isLoading: boolean
    isError: boolean
    errorMessage: string
    replyText: string
    replyCodeLanguage: string
    replyCode: string
    copiedCodeId: string | null
    isSaving: boolean
    onReplyTextChange: (value: string) => void
    onReplyCodeLanguageChange: (value: string) => void
    onReplyCodeChange: (value: string) => void
    onSubmit: FormEventHandler<HTMLFormElement>
    onCopyCode: (code: string, codeId: string) => void
    onOpenEditDialog: (reply: Reply) => void
    onOpenDeleteDialog: (replyId: string) => void
}

const codeLanguages = [
    ['python', 'Python'],
    ['java', 'Java'],
    ['sql', 'SQL'],
    ['javascript', 'JavaScript'],
    ['typescript', 'TypeScript'],
    ['c', 'C'],
    ['csharp', 'C#'],
    ['cpp', 'C++'],
]

function ReplySection({
    replies,
    isLoading,
    isError,
    errorMessage,
    replyText,
    replyCodeLanguage,
    replyCode,
    copiedCodeId,
    isSaving,
    onReplyTextChange,
    onReplyCodeLanguageChange,
    onReplyCodeChange,
    onSubmit,
    onCopyCode,
    onOpenEditDialog,
    onOpenDeleteDialog,
}: ReplySectionProps) {
    return (
        <section className={styles.replies} aria-labelledby="replies-title">
            <h2 id="replies-title">답변</h2>

            {isLoading && <p className={styles.notice}>답변을 불러오는 중입니다.</p>}
            {(errorMessage || isError) && (
                <p className={styles.notice} role="alert">
                    {errorMessage || '답변을 불러오지 못했습니다.'}
                </p>
            )}

            {!isLoading && (
                <>
                    <p className={styles.replyCount} aria-live="polite">
                        답변 {replies.length}개
                    </p>
                    <div className={styles.replyList}>
                        {replies.map((reply) => (
                            <article className={styles.replyCard} key={reply.id}>
                                <div className={styles.replyHeader}>
                                    <time dateTime={reply.created_at}>
                                        {new Date(reply.created_at).toLocaleDateString('ko-KR')}
                                    </time>
                                    <div className={styles.replyActions}>
                                        <button
                                            type="button"
                                            className={styles.replyEditButton}
                                            onClick={() => onOpenEditDialog(reply)}
                                        >
                                            수정
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.replyDeleteButton}
                                            onClick={() => onOpenDeleteDialog(reply.id)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.replyBody}>
                                    <h3>본문</h3>
                                    <p>{reply.content}</p>
                                </div>

                                {reply.code && (
                                    <CodeViewer
                                        code={reply.code}
                                        language={reply.code_language}
                                        copyLabel="답변 코드 복사"
                                        copied={copiedCodeId === `reply-${reply.id}`}
                                        className={styles.replyCodeArea}
                                        onCopy={() =>
                                            onCopyCode(reply.code ?? '', `reply-${reply.id}`)
                                        }
                                    />
                                )}
                            </article>
                        ))}
                    </div>
                </>
            )}

            <form className={styles.replyForm} onSubmit={onSubmit}>
                <label htmlFor="reply-content">댓글 달기</label>
                <textarea
                    id="reply-content"
                    className={styles.replyInput}
                    placeholder="답변을 작성해주세요."
                    value={replyText}
                    rows={4}
                    onChange={(event) => onReplyTextChange(event.target.value)}
                    required
                    maxLength={1000}
                />

                <div className={styles.replyCodeInputs}>
                    <div>
                        <label htmlFor="reply-code-language">코드 언어</label>
                        <select
                            id="reply-code-language"
                            value={replyCodeLanguage}
                            onChange={(event) =>
                                onReplyCodeLanguageChange(event.target.value)
                            }
                        >
                            <option value="">언어 선택</option>
                            {codeLanguages.map(([value, label]) => (
                                <option value={value} key={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.replyCodeInput}>
                        <label htmlFor="reply-code">코드</label>
                        <textarea
                            id="reply-code"
                            value={replyCode}
                            rows={6}
                            placeholder="관련 코드를 작성해주세요."
                            onChange={(event) => onReplyCodeChange(event.target.value)}
                        />
                    </div>
                </div>

                <button
                    className={styles.saveButton}
                    type="submit"
                    disabled={replyText.trim().length === 0 || isSaving}
                >
                    {isSaving ? '저장 중...' : '저장'}
                </button>
            </form>
        </section>
    )
}

export default ReplySection
