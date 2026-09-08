import type { FormEventHandler } from 'react'
import styles from '../ArchiveDetail.module.css'

type DeleteDialogProps = {
    target: 'record' | 'reply' | null
    password: string
    errorMessage: string
    isDeleting: boolean
    onPasswordChange: (value: string) => void
    onSubmit: FormEventHandler<HTMLFormElement>
    onCancel: () => void
}

function DeleteDialog({
    target,
    password,
    errorMessage,
    isDeleting,
    onPasswordChange,
    onSubmit,
    onCancel,
}: DeleteDialogProps) {
    if (!target) return null

    return (
        <div className={styles.overlay}>
            <form className={styles.confirm} onSubmit={onSubmit}>
                <h2>
                    {target === 'record'
                        ? '글을 삭제하시겠습니까?'
                        : '답변을 삭제하시겠습니까?'}
                </h2>
                <p>삭제한 내용은 다시 복구할 수 없습니다.</p>

                <label
                    className={styles.statusPasswordLabel}
                    htmlFor="delete-password"
                >
                    관리자 비밀번호
                </label>
                <input
                    id="delete-password"
                    className={styles.statusPasswordInput}
                    type="password"
                    value={password}
                    autoFocus
                    autoComplete="current-password"
                    placeholder="비밀번호를 입력해 주세요."
                    onChange={(event) => onPasswordChange(event.target.value)}
                />
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
                        disabled={isDeleting}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className={styles.deleteConfirmButton}
                        disabled={password.length === 0 || isDeleting}
                    >
                        {isDeleting ? '삭제 중...' : '삭제'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default DeleteDialog
