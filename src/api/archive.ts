import { supabase } from '../lib/supabaseClient'

export type ArchiveRecord = {
    id: number
    created_at: string
    title: string
    content: string
    code_language: string | null
    code: string | null
    tags: string | null
    resolved: boolean
}

export type Reply = {
    id: string
    record_id: number
    content: string
    code_language: string | null
    code: string | null
    created_at: string
}

export type RecordInput = Pick<
    ArchiveRecord,
    'title' | 'content' | 'code_language' | 'code' | 'tags'
>

export type ReplyInput = Pick<Reply, 'content' | 'code_language' | 'code'>

export class AdminPasswordError extends Error {}

export const archiveKeys = {
    records: ['archiveRecords'] as const,
    record: (id: number) => ['archiveRecord', id] as const,
    replies: (recordId: number) => ['archiveReplies', recordId] as const,
}

async function withAdminSession<T>(
    password: string,
    request: () => Promise<T>
) {
    const { error } = await supabase.auth.signInWithPassword({
        email: import.meta.env.VITE_ARCHIVE_ADMIN_EMAIL,
        password,
    })

    if (error) {
        throw new AdminPasswordError('관리자 비밀번호가 일치하지 않습니다.')
    }

    try {
        return await request()
    } finally {
        await supabase.auth.signOut()
    }
}

export async function getArchiveRecords() {
    const { data, error } = await supabase
        .from('archive_records')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as ArchiveRecord[]
}

export async function getArchiveRecord(id: number) {
    const { data, error } = await supabase
        .from('archive_records')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) throw error
    return data as ArchiveRecord | null
}

export async function getArchiveReplies(recordId: number) {
    const { data, error } = await supabase
        .from('archive_replies')
        .select('id, record_id, content, code_language, code, created_at')
        .eq('record_id', recordId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data as Reply[]
}

export async function createArchiveRecord(input: RecordInput, password: string) {
    return withAdminSession(password, async () => {
        const { data, error } = await supabase
            .from('archive_records')
            .insert(input)
            .select('*')
            .single()

        if (error) throw error
        return data as ArchiveRecord
    })
}

export async function updateArchiveRecord(
    id: number,
    input: RecordInput,
    password: string
) {
    return withAdminSession(password, async () => {
        const { data, error } = await supabase
            .from('archive_records')
            .update(input)
            .eq('id', id)
            .select('*')
            .single()

        if (error) throw error
        return data as ArchiveRecord
    })
}

export async function updateArchiveStatus(
    id: number,
    resolved: boolean,
    password: string
) {
    return withAdminSession(password, async () => {
        const { data, error } = await supabase
            .from('archive_records')
            .update({ resolved })
            .eq('id', id)
            .select('*')
            .single()

        if (error) throw error
        return data as ArchiveRecord
    })
}

export async function deleteArchiveRecord(id: number, password: string) {
    return withAdminSession(password, async () => {
        const { error: repliesError } = await supabase
            .from('archive_replies')
            .delete()
            .eq('record_id', id)

        if (repliesError) throw repliesError

        const { error } = await supabase
            .from('archive_records')
            .delete()
            .eq('id', id)

        if (error) throw error
    })
}

export async function createArchiveReply(recordId: number, input: ReplyInput) {
    const { data, error } = await supabase
        .from('archive_replies')
        .insert({ record_id: recordId, ...input })
        .select('id, record_id, content, code_language, code, created_at')
        .single()

    if (error) throw error
    return data as Reply
}

export async function updateArchiveReply(
    id: string,
    input: ReplyInput,
    password: string
) {
    return withAdminSession(password, async () => {
        const { data, error } = await supabase
            .from('archive_replies')
            .update(input)
            .eq('id', id)
            .select('id, record_id, content, code_language, code, created_at')
            .single()

        if (error) throw error
        return data as Reply
    })
}

export async function deleteArchiveReply(id: string, password: string) {
    return withAdminSession(password, async () => {
        const { error } = await supabase
            .from('archive_replies')
            .delete()
            .eq('id', id)

        if (error) throw error
    })
}
