import type { FormEventHandler } from 'react'
import styles from '../ArchiveDetail.module.css'

type StatusDialogProps = {
    isOpen: boolean
    isResolved: boolean
    password: string
    errorMessage: string
    isSaving: boolean
    onPasswordChange: (value: string) => void
    onSubmit: FormEventHandler<HTMLFormElement>
    onCancel: () => void
}

function StatusDialog({
    isOpen,
    isResolved,
    password,
    errorMessage,
    isSaving,
    onPasswordChange,
    onSubmit,
    onCancel,
}: StatusDialogProps) {
    if (!isOpen) return null

    return (
        <div className={styles.overlay}>
            <form className={styles.confirm} onSubmit={onSubmit}>
                <h2>
                    {isResolved
                        ? '미해결 처리하시겠습니까?'
                        : '해결 완료 처리하시겠습니까?'}
                </h2>
                <p>언제든 다시 상태를 변경할 수 있습니다.</p>

                <label
                    className={styles.statusPasswordLabel}
                    htmlFor="detail-status-password"
                >
                    관리자 비밀번호
                </label>
                <input
                    id="detail-status-password"
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
                        disabled={isSaving}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className={styles.saveButton}
                        disabled={password.length === 0 || isSaving}
                    >
                        {isSaving ? '저장 중...' : '저장'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default StatusDialog
