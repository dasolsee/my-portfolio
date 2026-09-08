import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/common/Header/Header'
import Footer from '../../components/common/Footer/Footer'
import ContactButton from '../../components/common/ContactButton/ContactButton'
import TopButton from '../../components/common/TopButton/TopButton'
import {
    AdminPasswordError,
    archiveKeys,
    createArchiveReply,
    deleteArchiveRecord,
    deleteArchiveReply,
    getArchiveRecord,
    getArchiveReplies,
    updateArchiveReply,
    updateArchiveStatus,
} from '../../api/archive'
import type { ArchiveRecord, Reply, ReplyInput } from '../../api/archive'
import ArchiveRecordCard from './components/ArchiveRecordCard'
import DeleteDialog from './components/DeleteDialog'
import ReplyEditDialog from './components/ReplyEditDialog'
import ReplySection from './components/ReplySection'
import StatusDialog from './components/StatusDialog'
import styles from './ArchiveDetail.module.css'

function ArchiveDetail() {
    const navigate = useNavigate()

    // 주소에서 가져온 id는 문자열이므로 숫자로 바꿔 사용한다.
    const { id } = useParams()
    const recordId = Number(id)
    const isValidRecordId = !Number.isNaN(recordId)
    const queryClient = useQueryClient()
    const { data: record, isLoading } = useQuery({
        queryKey: archiveKeys.record(recordId),
        queryFn: () => getArchiveRecord(recordId),
        enabled: isValidRecordId,
    })
    const {
        data: replies = [],
        isLoading: isReplyLoading,
        isError: isReplyError,
    } = useQuery({
        queryKey: archiveKeys.replies(recordId),
        queryFn: () => getArchiveReplies(recordId),
        enabled: isValidRecordId,
    })

    const [replyText, setReplyText] = useState('')
    const [replyCodeLanguage, setReplyCodeLanguage] = useState('')
    const [replyCode, setReplyCode] = useState('')
    const [replyError, setReplyError] = useState('')

    // 수정할 답변과 수정 창에 입력되는 내용을 관리한다.
    const [editingReply, setEditingReply] = useState<Reply | null>(null)
    const [editReplyText, setEditReplyText] = useState('')
    const [editReplyCodeLanguage, setEditReplyCodeLanguage] = useState('')
    const [editReplyCode, setEditReplyCode] = useState('')
    const [editReplyPassword, setEditReplyPassword] = useState('')
    const [editReplyError, setEditReplyError] = useState('')
    const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)

    // 해결 상태를 변경할 때 필요한 관리자 확인 창의 상태를 관리한다.
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    // 글 또는 답변을 삭제할 때 사용할 관리자 확인창의 상태를 관리한다.
    const [deleteTarget, setDeleteTarget] = useState<
        'record' | 'reply' | null
    >(null)
    const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null)
    const [deletePassword, setDeletePassword] = useState('')
    const [deleteError, setDeleteError] = useState('')

    const createReplyMutation = useMutation({
        mutationFn: ({
            recordId,
            input,
        }: {
            recordId: number
            input: ReplyInput
        }) => createArchiveReply(recordId, input),
        onSuccess: (newReply) => {
            queryClient.setQueryData<Reply[]>(
                archiveKeys.replies(recordId),
                (currentReplies = []) => [...currentReplies, newReply]
            )
        },
    })

    const updateReplyMutation = useMutation({
        mutationFn: ({
            id,
            input,
            password,
        }: {
            id: string
            input: ReplyInput
            password: string
        }) => updateArchiveReply(id, input, password),
        onSuccess: (updatedReply) => {
            queryClient.setQueryData<Reply[]>(
                archiveKeys.replies(recordId),
                (currentReplies = []) =>
                    currentReplies.map((reply) =>
                        reply.id === updatedReply.id ? updatedReply : reply
                    )
            )
        },
    })

    const statusMutation = useMutation({
        mutationFn: ({
            id,
            resolved,
            password,
        }: {
            id: number
            resolved: boolean
            password: string
        }) => updateArchiveStatus(id, resolved, password),
        onSuccess: (updatedRecord) => {
            queryClient.setQueryData(
                archiveKeys.record(updatedRecord.id),
                updatedRecord
            )
            queryClient.setQueryData<ArchiveRecord[]>(
                archiveKeys.records,
                (currentRecords = []) =>
                    currentRecords.map((currentRecord) =>
                        currentRecord.id === updatedRecord.id
                            ? updatedRecord
                            : currentRecord
                    )
            )
        },
    })

    const deleteRecordMutation = useMutation({
        mutationFn: ({ id, password }: { id: number; password: string }) =>
            deleteArchiveRecord(id, password),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: archiveKeys.record(recordId) })
            queryClient.removeQueries({
                queryKey: archiveKeys.replies(recordId),
            })
            return queryClient.invalidateQueries({
                queryKey: archiveKeys.records,
            })
        },
    })

    const deleteReplyMutation = useMutation({
        mutationFn: ({ id, password }: { id: string; password: string }) =>
            deleteArchiveReply(id, password),
        onSuccess: (_, variables) => {
            queryClient.setQueryData<Reply[]>(
                archiveKeys.replies(recordId),
                (currentReplies = []) =>
                    currentReplies.filter(
                        (reply) => reply.id !== variables.id
                    )
            )
        },
    })

    async function addReply(event: FormEvent<HTMLFormElement>) {
        // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막는다.
        event.preventDefault()

        const content = replyText.trim()
        const code = replyCode.trim() || null
        const codeLanguage = code ? replyCodeLanguage || null : null

        if (!record || content.length === 0 || createReplyMutation.isPending) {
            return
        }

        setReplyError('')

        try {
            await createReplyMutation.mutateAsync({
                recordId: record.id,
                input: {
                    content,
                    code_language: codeLanguage,
                    code,
                },
            })
            setReplyText('')
            setReplyCodeLanguage('')
            setReplyCode('')
        } catch (error) {
            console.error('답변 저장 실패:', error)
            setReplyError('답변을 저장하지 못했습니다.')
        }
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

        if (!editingReply || content.length === 0 || updateReplyMutation.isPending) {
            return
        }

        setEditReplyError('')

        try {
            await updateReplyMutation.mutateAsync({
                id: editingReply.id,
                input: {
                    content,
                    code_language: codeLanguage,
                    code,
                },
                password: editReplyPassword,
            })
            closeReplyEditDialog()
        } catch (error) {
            setEditReplyError(
                error instanceof AdminPasswordError
                    ? error.message
                    : '답변을 수정하지 못했습니다.'
            )
        }
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

        if (!record || statusMutation.isPending) {
            return
        }

        setPasswordError('')

        const nextResolved = !record.resolved

        try {
            await statusMutation.mutateAsync({
                id: record.id,
                resolved: nextResolved,
                password,
            })
            closeStatusDialog()
        } catch (error) {
            setPasswordError(
                error instanceof AdminPasswordError
                    ? error.message
                    : '상태를 변경하지 못했습니다.'
            )
        }
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

        if (
            !record ||
            !deleteTarget ||
            deleteRecordMutation.isPending ||
            deleteReplyMutation.isPending
        ) {
            return
        }

        setDeleteError('')

        try {
            if (deleteTarget === 'record') {
                await deleteRecordMutation.mutateAsync({
                    id: record.id,
                    password: deletePassword,
                })
                navigate('/archive')
                return
            }

            if (!selectedReplyId) {
                setDeleteError('삭제할 답변을 찾지 못했습니다.')
                return
            }

            await deleteReplyMutation.mutateAsync({
                id: selectedReplyId,
                password: deletePassword,
            })
            closeDeleteDialog()
        } catch (error) {
            setDeleteError(
                error instanceof AdminPasswordError
                    ? error.message
                    : deleteTarget === 'record'
                      ? '글을 삭제하지 못했습니다.'
                      : '답변을 삭제하지 못했습니다.'
            )
        }
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

                    <ArchiveRecordCard
                        record={record}
                        copiedCodeId={copiedCodeId}
                        onCopyCode={copyCode}
                        onOpenStatusDialog={openStatusDialog}
                        onOpenDeleteDialog={openRecordDeleteDialog}
                    />

                    <ReplySection
                        replies={replies}
                        isLoading={isReplyLoading}
                        isError={isReplyError}
                        errorMessage={replyError}
                        replyText={replyText}
                        replyCodeLanguage={replyCodeLanguage}
                        replyCode={replyCode}
                        copiedCodeId={copiedCodeId}
                        isSaving={createReplyMutation.isPending}
                        onReplyTextChange={(value) => {
                            setReplyText(value)
                            setReplyError('')
                        }}
                        onReplyCodeLanguageChange={setReplyCodeLanguage}
                        onReplyCodeChange={setReplyCode}
                        onSubmit={addReply}
                        onCopyCode={copyCode}
                        onOpenEditDialog={openReplyEditDialog}
                        onOpenDeleteDialog={openReplyDeleteDialog}
                    />
                </div>
                <StatusDialog
                    isOpen={isStatusDialogOpen}
                    isResolved={record.resolved}
                    password={password}
                    errorMessage={passwordError}
                    isSaving={statusMutation.isPending}
                    onPasswordChange={(value) => {
                        setPassword(value)
                        setPasswordError('')
                    }}
                    onSubmit={changeStatus}
                    onCancel={closeStatusDialog}
                />

                <DeleteDialog
                    target={deleteTarget}
                    password={deletePassword}
                    errorMessage={deleteError}
                    isDeleting={
                        deleteRecordMutation.isPending ||
                        deleteReplyMutation.isPending
                    }
                    onPasswordChange={(value) => {
                        setDeletePassword(value)
                        setDeleteError('')
                    }}
                    onSubmit={deleteItem}
                    onCancel={closeDeleteDialog}
                />

                <ReplyEditDialog
                    reply={editingReply}
                    content={editReplyText}
                    codeLanguage={editReplyCodeLanguage}
                    code={editReplyCode}
                    password={editReplyPassword}
                    errorMessage={editReplyError}
                    isSaving={updateReplyMutation.isPending}
                    onContentChange={(value) => {
                        setEditReplyText(value)
                        setEditReplyError('')
                    }}
                    onCodeLanguageChange={setEditReplyCodeLanguage}
                    onCodeChange={setEditReplyCode}
                    onPasswordChange={(value) => {
                        setEditReplyPassword(value)
                        setEditReplyError('')
                    }}
                    onSubmit={updateReply}
                    onCancel={closeReplyEditDialog}
                />
            </main>

            {/* Archive 상세 내용 뒤에 공통 Footer와 버튼을 표시한다. */}
            <Footer />
            <ContactButton />
            <TopButton />
        </>
    )
}

export default ArchiveDetail
