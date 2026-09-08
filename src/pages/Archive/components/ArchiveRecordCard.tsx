import { Link } from 'react-router-dom'
import type { ArchiveRecord } from '../../../api/archive'
import CodeViewer from './CodeViewer'
import styles from '../ArchiveDetail.module.css'

type ArchiveRecordCardProps = {
    record: ArchiveRecord
    copiedCodeId: string | null
    onCopyCode: (code: string, codeId: string) => void
    onOpenStatusDialog: () => void
    onOpenDeleteDialog: () => void
}

// 기록 자체를 보여 주는 카드로, 상세 페이지의 데이터 처리와 화면 표시를 분리한다.
function ArchiveRecordCard({
    record,
    copiedCodeId,
    onCopyCode,
    onOpenStatusDialog,
    onOpenDeleteDialog,
}: ArchiveRecordCardProps) {
    const tags = (record.tags ?? '')
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

    return (
        <article className={styles.card}>
            <header className={styles.cardHeader}>
                <div className={styles.titleArea}>
                    <h1>{record.title}</h1>
                    <time className={styles.createdAt} dateTime={record.created_at}>
                        작성일 {new Date(record.created_at).toLocaleDateString('ko-KR')}
                    </time>
                </div>

                <div className={styles.cardActions}>
                    <button
                        type="button"
                        className={styles.status}
                        aria-label={`${record.resolved ? '미해결' : '해결'}로 변경`}
                        onClick={onOpenStatusDialog}
                    >
                        <span
                            className={`${styles.check} ${
                                record.resolved ? styles.resolved : styles.unresolved
                            }`}
                            aria-hidden="true"
                        >
                            ✓
                        </span>
                        <span>{record.resolved ? '해결 완료' : '미해결'}</span>
                    </button>
                </div>
            </header>

            <div className={styles.body}>
                <section className={styles.block}>
                    <h2>본문</h2>
                    <p>{record.content}</p>
                </section>

                {record.code && (
                    <CodeViewer
                        code={record.code}
                        language={record.code_language}
                        copyLabel="글 코드 복사"
                        copied={copiedCodeId === 'record'}
                        onCopy={() => onCopyCode(record.code ?? '', 'record')}
                    />
                )}
            </div>

            <footer className={styles.cardFooter}>
                {tags.length > 0 && (
                    <ul className={styles.tags} aria-label="기술 태그">
                        {tags.map((tag) => (
                            <li key={tag}>#{tag}</li>
                        ))}
                    </ul>
                )}

                <div className={styles.recordActions}>
                    <Link className={styles.editButton} to={`/archive/${record.id}/edit`}>
                        수정
                    </Link>
                    <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={onOpenDeleteDialog}
                    >
                        글 삭제
                    </button>
                </div>
            </footer>
        </article>
    )
}

export default ArchiveRecordCard
