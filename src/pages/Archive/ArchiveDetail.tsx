import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
    code_language: string | null
    code: string | null
    created_at: string
}

function ArchiveDetail() {
    const navigate = useNavigate()

    // 주소에서 가져온 id는 문자열이므로 숫자로 바꿔 사용한다.
    const { id } = useParams()
    const recordId = Number(id)

    const [record, setRecord] = useState<ArchiveRecord | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const [replyText, setReplyText] = useState('')
    const [replyCodeLanguage, setReplyCodeLanguage] = useState('')
    const [replyCode, setReplyCode] = useState('')
    const [replies, setReplies] = useState<Reply[]>([])
    const [isReplyLoading, setIsReplyLoading] = useState(true)
    const [isReplySaving, setIsReplySaving] = useState(false)
    const [replyError, setReplyError] = useState('')

    // 수정할 답변과 수정 창에 입력되는 내용을 관리한다.
    const [editingReply, setEditingReply] = useState<Reply | null>(null)
    const [editReplyText, setEditReplyText] = useState('')
    const [editReplyCodeLanguage, setEditReplyCodeLanguage] = useState('')
    const [editReplyCode, setEditReplyCode] = useState('')
    const [editReplyPassword, setEditReplyPassword] = useState('')
    const [editReplyError, setEditReplyError] = useState('')
    const [isReplyEditing, setIsReplyEditing] = useState(false)
    const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)

    // 해결 상태를 변경할 때 필요한 관리자 확인 창의 상태를 관리한다.
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [isStatusSaving, setIsStatusSaving] = useState(false)

    // 글 또는 답변을 삭제할 때 사용할 관리자 확인창의 상태를 관리한다.
    const [deleteTarget, setDeleteTarget] = useState<
        'record' | 'reply' | null
    >(null)
    const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null)
    const [deletePassword, setDeletePassword] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [isDeleteSaving, setIsDeleteSaving] = useState(false)

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
                .select(
                    'id, record_id, content, code_language, code, created_at'
                )
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
        const code = replyCode.trim() || null
        const codeLanguage = code ? replyCodeLanguage || null : null

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
                code_language: codeLanguage,
                code,
            })
            .select(
                'id, record_id, content, code_language, code, created_at'
            )
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
        setReplyCodeLanguage('')
        setReplyCode('')
        setIsReplySaving(false)
    }

    function openReplyEditDialog(reply: Reply) {
        setEditingReply(reply)
        setEditReplyText(reply.content)
        setEditReplyCodeLanguage(reply.code_language ?? '')
        setEditReplyCode(reply.code ?? '')
        setEditReplyPassword('')
        setEditReplyError('')
    }

    function closeReplyEditDialog() {
        setEditingReply(null)
        setEditReplyText('')
        setEditReplyCodeLanguage('')
        setEditReplyCode('')
        setEditReplyPassword('')
        setEditReplyError('')
    }

    async function updateReply(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const content = editReplyText.trim()
        const code = editReplyCode.trim() || null
        const codeLanguage = code ? editReplyCodeLanguage || null : null

        if (!editingReply || content.length === 0 || isReplyEditing) {
            return
        }

        setIsReplyEditing(true)
        setEditReplyError('')

        // 관리자 비밀번호가 맞는지 확인한 뒤 선택한 답변을 수정한다.
        const { error: loginError } =
            await supabase.auth.signInWithPassword({
                email: import.meta.env.VITE_ARCHIVE_ADMIN_EMAIL,
                password: editReplyPassword,
            })

        if (loginError) {
            setEditReplyError('비밀번호가 일치하지 않습니다.')
            setIsReplyEditing(false)
            return
        }

        const { error: updateError } = await supabase
            .from('archive_replies')
            .update({
                content,
                code_language: codeLanguage,
                code,
            })
            .eq('id', editingReply.id)

        if (updateError) {
            await supabase.auth.signOut()
            console.error('답변 수정 실패:', updateError)
            setEditReplyError('답변을 수정하지 못했습니다.')
            setIsReplyEditing(false)
            return
        }

        // 수정된 답변만 바꿔 화면에 바로 반영한다.
        setReplies((currentReplies) =>
            currentReplies.map((reply) =>
                reply.id === editingReply.id
                    ? {
                          ...reply,
                          content,
                          code_language: codeLanguage,
                          code,
                      }
                    : reply
            )
        )

        await supabase.auth.signOut()
        setIsReplyEditing(false)
        closeReplyEditDialog()
    }

    async function copyCode(code: string, codeId: string) {
        try {
            // 선택한 코드 문자열만 클립보드에 복사한다.
            await navigator.clipboard.writeText(code)
            setCopiedCodeId(codeId)

            window.setTimeout(() => {
                setCopiedCodeId(null)
            }, 1500)
        } catch (error) {
            console.error('코드 복사 실패:', error)
        }
    }

    function openStatusDialog() {
        setIsStatusDialogOpen(true)
        setPassword('')
        setPasswordError('')
    }

    function closeStatusDialog() {
        setIsStatusDialogOpen(false)
        setPassword('')
        setPasswordError('')
    }

    async function changeStatus(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!record || isStatusSaving) {
            return
        }

        setIsStatusSaving(true)
        setPasswordError('')

        // 입력한 비밀번호로 Supabase 관리자 로그인을 시도한다.
        const { error: loginError } =
            await supabase.auth.signInWithPassword({
                email: import.meta.env.VITE_ARCHIVE_ADMIN_EMAIL,
                password: password,
            })

        if (loginError) {
            setPasswordError('비밀번호가 일치하지 않습니다.')
            setIsStatusSaving(false)
            return
        }

        const nextResolved = !record.resolved

        // 현재 기록의 해결 여부를 반대 상태로 변경한다.
        const { error: updateError } = await supabase
            .from('archive_records')
            .update({
                resolved: nextResolved,
            })
            .eq('id', record.id)

        if (updateError) {
            await supabase.auth.signOut()
            console.error('상태 변경 실패:', updateError)
            setPasswordError('상태를 변경하지 못했습니다.')
            setIsStatusSaving(false)
            return
        }

        // Supabase 변경에 성공하면 화면에 표시되는 상태도 변경한다.
        setRecord({
            ...record,
            resolved: nextResolved,
        })

        await supabase.auth.signOut()
        setIsStatusSaving(false)
        closeStatusDialog()
    }

    function openRecordDeleteDialog() {
        setDeleteTarget('record')
        setSelectedReplyId(null)
        setDeletePassword('')
        setDeleteError('')
    }

    function openReplyDeleteDialog(replyId: string) {
        setDeleteTarget('reply')
        setSelectedReplyId(replyId)
        setDeletePassword('')
        setDeleteError('')
    }

    function closeDeleteDialog() {
        setDeleteTarget(null)
        setSelectedReplyId(null)
        setDeletePassword('')
        setDeleteError('')
    }

    async function deleteItem(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!record || !deleteTarget || isDeleteSaving) {
            return
        }

        setIsDeleteSaving(true)
        setDeleteError('')

        // 관리자 비밀번호가 맞는지 Supabase 로그인으로 확인한다.
        const { error: loginError } =
            await supabase.auth.signInWithPassword({
                email: import.meta.env.VITE_ARCHIVE_ADMIN_EMAIL,
                password: deletePassword,
            })

        if (loginError) {
            setDeleteError('비밀번호가 일치하지 않습니다.')
            setIsDeleteSaving(false)
            return
        }

        if (deleteTarget === 'record') {
            // 글과 연결된 답변을 먼저 삭제한 뒤 글을 삭제한다.
            const { error: repliesDeleteError } = await supabase
                .from('archive_replies')
                .delete()
                .eq('record_id', record.id)

            if (repliesDeleteError) {
                await supabase.auth.signOut()
                console.error('답변 삭제 실패:', repliesDeleteError)
                setDeleteError('글을 삭제하지 못했습니다.')
                setIsDeleteSaving(false)
                return
            }

            const { error: recordDeleteError } = await supabase
                .from('archive_records')
                .delete()
                .eq('id', record.id)

            if (recordDeleteError) {
                await supabase.auth.signOut()
                console.error('글 삭제 실패:', recordDeleteError)
                setDeleteError('글을 삭제하지 못했습니다.')
                setIsDeleteSaving(false)
                return
            }

            await supabase.auth.signOut()
            navigate('/archive')
            return
        }

        if (!selectedReplyId) {
            await supabase.auth.signOut()
            setDeleteError('삭제할 답변을 찾지 못했습니다.')
            setIsDeleteSaving(false)
            return
        }

        const { error: replyDeleteError } = await supabase
            .from('archive_replies')
            .delete()
            .eq('id', selectedReplyId)

        if (replyDeleteError) {
            await supabase.auth.signOut()
            console.error('답변 삭제 실패:', replyDeleteError)
            setDeleteError('답변을 삭제하지 못했습니다.')
            setIsDeleteSaving(false)
            return
        }

        setReplies((currentReplies) =>
            currentReplies.filter((reply) => reply.id !== selectedReplyId)
        )

        await supabase.auth.signOut()
        setIsDeleteSaving(false)
        closeDeleteDialog()
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
                            <div className={styles.titleArea}>
                                <h1>{record.title}</h1>

                                <time
                                    className={styles.createdAt}
                                    dateTime={record.created_at}
                                >
                                    작성일{' '}
                                    {new Date(
                                        record.created_at
                                    ).toLocaleDateString('ko-KR')}
                                </time>
                            </div>

                            <div className={styles.cardActions}>
                                {/* 상태 표시를 누르면 관리자 확인 창을 연다. */}
                                <button
                                    type="button"
                                    className={styles.status}
                                    aria-label={`${
                                        record.resolved ? '미해결' : '해결'
                                    }로 변경`}
                                    onClick={openStatusDialog}
                                >
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
                                        {record.resolved
                                            ? '해결 완료'
                                            : '미해결'}
                                    </span>
                                </button>

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

                                    <div className={styles.codeWrapper}>
                                        <button
                                            type="button"
                                            className={styles.copyButton}
                                            aria-label="글 코드 복사"
                                            onClick={() =>
                                                copyCode(
                                                    record.code ?? '',
                                                    'record'
                                                )
                                            }
                                        >
                                            <span
                                                className={styles.copyIcon}
                                                aria-hidden="true"
                                            />
                                            {copiedCodeId === 'record'
                                                ? '복사됨'
                                                : '복사'}
                                        </button>

                                        <pre className={styles.codeBlock}>
                                            <code>{record.code}</code>
                                        </pre>
                                    </div>
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

                            <div className={styles.recordActions}>
                                <Link
                                    className={styles.editButton}
                                    to={`/archive/${record.id}/edit`}
                                >
                                    수정
                                </Link>

                                <button
                                    type="button"
                                    className={styles.deleteButton}
                                    onClick={openRecordDeleteDialog}
                                >
                                    글 삭제
                                </button>
                            </div>
                        </footer>
                    </article>

                    <section
                        className={styles.replies}
                        aria-labelledby="replies-title"
                    >
                        <h2 id="replies-title">답변</h2>

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
                                            <div className={styles.replyHeader}>
                                                <time dateTime={reply.created_at}>
                                                    {new Date(
                                                        reply.created_at
                                                    ).toLocaleDateString('ko-KR')}
                                                </time>

                                                <div className={styles.replyActions}>
                                                    <button
                                                        type="button"
                                                        className={styles.replyEditButton}
                                                        onClick={() =>
                                                            openReplyEditDialog(
                                                                reply
                                                            )
                                                        }
                                                    >
                                                        수정
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={styles.replyDeleteButton}
                                                        onClick={() =>
                                                            openReplyDeleteDialog(
                                                                reply.id
                                                            )
                                                        }
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
                                                <div className={styles.replyCodeArea}>
                                                    <p className={styles.codeLabel}>
                                                        {reply.code_language
                                                            ? `관련 코드 · ${reply.code_language}`
                                                            : '관련 코드'}
                                                    </p>

                                                    <div className={styles.codeWrapper}>
                                                        <button
                                                            type="button"
                                                            className={styles.copyButton}
                                                            aria-label="답변 코드 복사"
                                                            onClick={() =>
                                                                copyCode(
                                                                    reply.code ?? '',
                                                                    `reply-${reply.id}`
                                                                )
                                                            }
                                                        >
                                                            <span
                                                                className={styles.copyIcon}
                                                                aria-hidden="true"
                                                            />
                                                            {copiedCodeId ===
                                                            `reply-${reply.id}`
                                                                ? '복사됨'
                                                                : '복사'}
                                                        </button>

                                                        <pre className={styles.codeBlock}>
                                                            <code>{reply.code}</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}

                        <form
                            className={styles.replyForm}
                            onSubmit={addReply}
                        >
                            <label htmlFor="reply-content">댓글 달기</label>

                            <textarea
                                id="reply-content"
                                className={styles.replyInput}
                                placeholder="답변을 작성해주세요."
                                value={replyText}
                                rows={4}
                                onChange={(event) => {
                                    setReplyText(event.target.value)
                                    setReplyError('')
                                }}
                                required
                                maxLength={1000}
                            />

                            <div className={styles.replyCodeInputs}>
                                <div>
                                    <label htmlFor="reply-code-language">
                                        코드 언어
                                    </label>

                                    <select
                                        id="reply-code-language"
                                        value={replyCodeLanguage}
                                        onChange={(event) =>
                                            setReplyCodeLanguage(
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="">언어 선택</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="sql">SQL</option>
                                        <option value="javascript">
                                            JavaScript
                                        </option>
                                        <option value="typescript">
                                            TypeScript
                                        </option>
                                        <option value="c">C</option>
                                        <option value="csharp">C#</option>
                                        <option value="cpp">C++</option>
                                    </select>
                                </div>

                                <div className={styles.replyCodeInput}>
                                    <label htmlFor="reply-code">코드</label>

                                    <textarea
                                        id="reply-code"
                                        value={replyCode}
                                        rows={6}
                                        placeholder="관련 코드를 작성해주세요."
                                        onChange={(event) =>
                                            setReplyCode(event.target.value)
                                        }
                                    />
                                </div>
                            </div>

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
                    </section>
                </div>
                {/* 관리자 비밀번호를 확인한 뒤 해결 상태를 변경한다. */}
                {isStatusDialogOpen && (
                    <div className={styles.overlay}>
                        <form
                            className={styles.confirm}
                            onSubmit={changeStatus}
                        >
                            <h2>
                                {record.resolved
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
                                onChange={(event) => {
                                    setPassword(event.target.value)
                                    setPasswordError('')
                                }}
                            />

                            {passwordError && (
                                <span
                                    className={styles.passwordError}
                                    role="alert"
                                >
                                    {passwordError}
                                </span>
                            )}

                            <div className={styles.statusActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={closeStatusDialog}
                                    disabled={isStatusSaving}
                                >
                                    취소
                                </button>

                                <button
                                    type="submit"
                                    className={styles.saveButton}
                                    disabled={
                                        password.length === 0 ||
                                        isStatusSaving
                                    }
                                >
                                    {isStatusSaving ? '저장 중...' : '저장'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 관리자 비밀번호를 확인한 뒤 글 또는 답변을 삭제한다. */}
                {deleteTarget && (
                    <div className={styles.overlay}>
                        <form
                            className={styles.confirm}
                            onSubmit={deleteItem}
                        >
                            <h2>
                                {deleteTarget === 'record'
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
                                value={deletePassword}
                                autoFocus
                                autoComplete="current-password"
                                placeholder="비밀번호를 입력해 주세요."
                                onChange={(event) => {
                                    setDeletePassword(event.target.value)
                                    setDeleteError('')
                                }}
                            />

                            {deleteError && (
                                <span
                                    className={styles.passwordError}
                                    role="alert"
                                >
                                    {deleteError}
                                </span>
                            )}

                            <div className={styles.statusActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={closeDeleteDialog}
                                    disabled={isDeleteSaving}
                                >
                                    취소
                                </button>

                                <button
                                    type="submit"
                                    className={styles.deleteConfirmButton}
                                    disabled={
                                        deletePassword.length === 0 ||
                                        isDeleteSaving
                                    }
                                >
                                    {isDeleteSaving ? '삭제 중...' : '삭제'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 관리자 비밀번호를 확인한 뒤 답변 내용을 수정한다. */}
                {editingReply && (
                    <div className={styles.overlay}>
                        <form
                            className={`${styles.confirm} ${styles.replyEditConfirm}`}
                            onSubmit={updateReply}
                        >
                            <h2>답변을 수정하시겠습니까?</h2>

                            <div className={styles.editReplyFields}>
                                <label htmlFor="edit-reply-content">본문</label>

                                <textarea
                                    id="edit-reply-content"
                                    value={editReplyText}
                                    rows={4}
                                    maxLength={1000}
                                    onChange={(event) => {
                                        setEditReplyText(event.target.value)
                                        setEditReplyError('')
                                    }}
                                    required
                                />

                                <div className={styles.editReplyCodeInputs}>
                                    <div>
                                        <label htmlFor="edit-reply-code-language">
                                            코드 언어
                                        </label>

                                        <select
                                            id="edit-reply-code-language"
                                            value={editReplyCodeLanguage}
                                            onChange={(event) =>
                                                setEditReplyCodeLanguage(
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <option value="">언어 선택</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                            <option value="sql">SQL</option>
                                            <option value="javascript">
                                                JavaScript
                                            </option>
                                            <option value="typescript">
                                                TypeScript
                                            </option>
                                            <option value="c">C</option>
                                            <option value="csharp">C#</option>
                                            <option value="cpp">C++</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="edit-reply-code">
                                            코드
                                        </label>

                                        <textarea
                                            id="edit-reply-code"
                                            value={editReplyCode}
                                            rows={6}
                                            placeholder="관련 코드를 작성해주세요."
                                            onChange={(event) =>
                                                setEditReplyCode(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <label htmlFor="edit-reply-password">
                                    관리자 비밀번호
                                </label>

                                <input
                                    id="edit-reply-password"
                                    type="password"
                                    value={editReplyPassword}
                                    autoComplete="current-password"
                                    placeholder="비밀번호를 입력해 주세요."
                                    onChange={(event) => {
                                        setEditReplyPassword(event.target.value)
                                        setEditReplyError('')
                                    }}
                                />
                            </div>

                            {editReplyError && (
                                <span
                                    className={styles.passwordError}
                                    role="alert"
                                >
                                    {editReplyError}
                                </span>
                            )}

                            <div className={styles.statusActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={closeReplyEditDialog}
                                    disabled={isReplyEditing}
                                >
                                    취소
                                </button>

                                <button
                                    type="submit"
                                    className={styles.saveButton}
                                    disabled={
                                        editReplyText.trim().length === 0 ||
                                        editReplyPassword.length === 0 ||
                                        isReplyEditing
                                    }
                                >
                                    {isReplyEditing
                                        ? '수정 중...'
                                        : '수정 저장'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

            {/* Archive 상세 내용 뒤에 공통 Footer와 버튼을 표시한다. */}
            <Footer />
            <ContactButton />
            <TopButton />
        </>
    )
}

export default ArchiveDetail
