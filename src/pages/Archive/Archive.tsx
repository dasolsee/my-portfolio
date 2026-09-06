// 선택한 필터와 화면에 표시할 기록 상태를 관리한다.
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/common/Header/Header'
import { archiveRecords } from './ArchiveRecords'
import styles from './Archive.module.css'
import Footer from '../../components/common/Footer/Footer'
import ContactButton from '../../components/common/ContactButton/ContactButton'
import TopButton from '../../components/common/TopButton/TopButton'

// 필터에는 아래 세 가지 문자열만 사용할 수 있다.
type Filter = '전체' | '해결' | '미해결'

function Archive() {
    const [filter, setFilter] = useState<Filter>('전체')

    // 해결 여부를 변경하면 화면도 다시 표시되도록 기록 배열을 state로 관리한다.
    const [records, setRecords] = useState(archiveRecords)

    // 상태를 변경할 기록의 번호를 기억한다. null이면 확인 창을 닫는다.
    const [selectedId, setSelectedId] = useState<number | null>(null)

    // 해결 여부는 관리자만 변경할 수 있도록 입력한 비밀번호와 오류 문구를 관리한다.
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const filters: Filter[] = ['전체', '해결', '미해결']

    // 원본 배열은 유지하고 선택한 조건에 맞는 기록만 골라낸다.
    const filteredRecords = records.filter((record) => {
        if (filter === '전체') {
            return true
        }

        return filter === '해결' ? record.resolved : !record.resolved
    })

    // 선택한 번호와 일치하는 기록 하나를 찾아 확인 창에 사용한다.
    const selectedRecord = records.find((record) => record.id === selectedId)

    function openStatusDialog(id: number) {
        setSelectedId(id)
        setPassword('')
        setPasswordError('')
    }

    function closeStatusDialog() {
        setSelectedId(null)
        setPassword('')
        setPasswordError('')
    }

    function changeStatus(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        // 현재는 화면 동작을 확인하는 MVP이므로 Vite 환경 변수의 관리자 비밀번호와 비교한다.
        if (password !== import.meta.env.VITE_ARCHIVE_ADMIN_PASSWORD) {
            setPasswordError('비밀번호가 일치하지 않습니다.')
            return
        }

        // 선택한 기록만 새 객체로 바꾸고 나머지 기록은 그대로 유지한다.
        // !record.resolved는 true와 false를 서로 반대로 바꾼다.
        setRecords((currentRecords) =>
            currentRecords.map((record) =>
                record.id === selectedId
                    ? { ...record, resolved: !record.resolved }
                    : record
            )
        )

        closeStatusDialog()
    }

    return (
        <>
            <Header />

            <main className={styles.archive}>
                <div className="container">
                    <div className={styles.headingRow}>
                        <h1 className={styles.heading}>Archive</h1>

                        <Link className={styles.homeLink} to="/">
                            홈으로 가기
                        </Link>
                    </div>

                    <div className={styles.toolbar}>
                        {/* 서로 관련된 필터 버튼을 하나의 그룹으로 묶는다. */}
                        <div
                            className={styles.filters}
                            role="group"
                            aria-label="해결 여부 필터"
                        >
                            {filters.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={styles.filterButton}
                                    aria-pressed={filter === item}
                                    onClick={() => setFilter(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <Link className={styles.writeButton} to="/archive/new">
                            새 글 작성
                        </Link>
                    </div>

                    {/* 필터 조건을 통과한 기록을 각각 하나의 카드로 표시한다. */}
                    <div className={styles.list}>
                        {filteredRecords.map((record) => (
                            <article className={styles.card} key={record.id}>
                                <div className={styles.cardHeader}>
                                    <h2>
                                        <Link to={`/archive/${record.id}`}>
                                            {record.title}
                                        </Link>
                                    </h2>

                                    {/* 바로 상태를 바꾸지 않고 선택한 기록의 확인 창을 연다. */}
                                    <button
                                        type="button"
                                        className={styles.statusButton}
                                        aria-label={`${record.title}: ${
                                            record.resolved ? '미해결' : '해결'
                                        }로 변경`}
                                        onClick={() => openStatusDialog(record.id)}
                                    >
                                        {/* 체크 모양은 장식이며 상태는 아래 글자로 안내한다. */}
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
                                    </button>
                                </div>

                                <p className={styles.preview}>
                                    {record.problem}
                                </p>

                                <Link
                                    className={styles.moreLink}
                                    to={`/archive/${record.id}`}
                                >
                                    더보기
                                </Link>

                                <div className={styles.cardFooter}>
                                    <span>문제 해결 기록</span>

                                    <time dateTime={record.date}>
                                        작성일 {record.date}
                                    </time>
                                </div>
                            </article>
                        ))}

                        {/* 조건에 맞는 기록이 없을 때 빈 화면 대신 안내를 표시한다. */}
                        {filteredRecords.length === 0 && (
                            <p className={styles.empty}>
                                해당하는 기록이 아직 없습니다.
                            </p>
                        )}
                    </div>
                </div>

                {/* 선택한 기록이 있을 때만 상태 변경 확인 창을 표시한다. */}
                {selectedRecord && (
                    <div className={styles.overlay}>
                        <form className={styles.confirm} onSubmit={changeStatus}>
                            <h2>
                                {selectedRecord.resolved
                                    ? '미해결 처리하시겠습니까?'
                                    : '해결 완료 처리하시겠습니까?'}
                            </h2>

                            <p>언제든 다시 상태를 변경할 수 있습니다.</p>

                            <label
                                className={styles.passwordLabel}
                                htmlFor="status-password"
                            >
                                관리자 비밀번호
                            </label>

                            <input
                                id="status-password"
                                className={styles.passwordInput}
                                type="password"
                                value={password}
                                autoFocus
                                autoComplete="current-password"
                                placeholder="비밀번호를 입력해 주세요."
                                aria-describedby={
                                    passwordError ? 'password-error' : undefined
                                }
                                onChange={(event) => {
                                    setPassword(event.target.value)
                                    setPasswordError('')
                                }}
                            />

                            {passwordError && (
                                <span
                                    id="password-error"
                                    className={styles.passwordError}
                                    role="alert"
                                >
                                    {passwordError}
                                </span>
                            )}

                            <div className={styles.actions}>
                                {/* 취소하면 기록 상태는 유지하고 확인 창만 닫는다. */}
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={closeStatusDialog}
                                >
                                    취소
                                </button>

                                <button
                                    type="submit"
                                    className={styles.saveButton}
                                >
                                    저장
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

            <Footer/>
            <ContactButton />
            <TopButton/>
        </>
    )
}

export default Archive
