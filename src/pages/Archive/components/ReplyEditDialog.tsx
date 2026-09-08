import type { FormEventHandler } from 'react'
import type { Reply } from '../../../api/archive'
import styles from '../ArchiveDetail.module.css'

type ReplyEditDialogProps = {
    reply: Reply | null
    content: string
    codeLanguage: string
    code: string
    password: string
    errorMessage: string
    isSaving: boolean
    onContentChange: (value: string) => void
    onCodeLanguageChange: (value: string) => void
    onCodeChange: (value: string) => void
    onPasswordChange: (value: string) => void
    onSubmit: FormEventHandler<HTMLFormElement>
    onCancel: () => void
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

function ReplyEditDialog({
    reply,
    content,
    codeLanguage,
    code,
    password,
    errorMessage,
    isSaving,
    onContentChange,
    onCodeLanguageChange,
    onCodeChange,
    onPasswordChange,
    onSubmit,
    onCancel,
}: ReplyEditDialogProps) {
    if (!reply) return null

    return (
        <div className={styles.overlay}>
            <form
                className={`${styles.confirm} ${styles.replyEditConfirm}`}
                onSubmit={onSubmit}
            >
                <h2>답변을 수정하시겠습니까?</h2>
                <div className={styles.editReplyFields}>
                    <label htmlFor="edit-reply-content">본문</label>
                    <textarea
                        id="edit-reply-content"
                        value={content}
                        rows={4}
                        maxLength={1000}
                        onChange={(event) => onContentChange(event.target.value)}
                        required
                    />

                    <div className={styles.editReplyCodeInputs}>
                        <div>
                            <label htmlFor="edit-reply-code-language">코드 언어</label>
                            <select
                                id="edit-reply-code-language"
                                value={codeLanguage}
                                onChange={(event) =>
                                    onCodeLanguageChange(event.target.value)
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

                        <div>
                            <label htmlFor="edit-reply-code">코드</label>
                            <textarea
                                id="edit-reply-code"
                                value={code}
                                rows={6}
                                placeholder="관련 코드를 작성해주세요."
                                onChange={(event) => onCodeChange(event.target.value)}
                            />
                        </div>
                    </div>

                    <label htmlFor="edit-reply-password">관리자 비밀번호</label>
                    <input
                        id="edit-reply-password"
                        type="password"
                        value={password}
                        autoComplete="current-password"
                        placeholder="비밀번호를 입력해 주세요."
                        onChange={(event) => onPasswordChange(event.target.value)}
                    />
                </div>

                {errorMessage && (
                    <span className={styles.passwordError} role="alert">
                        {errorMessage}
                    </span>
                )}

                <div className={styles.statusActions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className={styles.saveButton}
                        disabled={
                            content.trim().length === 0 ||
                            password.length === 0 ||
                            isSaving
                        }
                    >
                        {isSaving ? '수정 중...' : '수정 저장'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ReplyEditDialog
