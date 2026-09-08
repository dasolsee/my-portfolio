import styles from '../ArchiveDetail.module.css'

type CodeViewerProps = {
    code: string
    language: string | null
    copyLabel: string
    copied: boolean
    className?: string
    onCopy: () => void
}

// 글과 답변에서 공통으로 사용하는 코드 표시와 복사 기능을 담당한다.
function CodeViewer({
    code,
    language,
    copyLabel,
    copied,
    className = styles.codeArea,
    onCopy,
}: CodeViewerProps) {
    return (
        <div className={className}>
            <p className={styles.codeLabel}>
                {language ? `관련 코드 · ${language}` : '관련 코드'}
            </p>

            <div className={styles.codeWrapper}>
                <button
                    type="button"
                    className={styles.copyButton}
                    aria-label={copyLabel}
                    onClick={onCopy}
                >
                    <span className={styles.copyIcon} aria-hidden="true" />
                    {copied ? '복사됨' : '복사'}
                </button>

                <pre className={styles.codeBlock}>
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    )
}

export default CodeViewer
