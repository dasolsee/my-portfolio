-- 로그인한 관리자만 Archive 글과 답변을 삭제할 수 있게 설정한다.
grant delete on table public.archive_records to authenticated;
grant delete on table public.archive_replies to authenticated;

alter table public.archive_records enable row level security;
alter table public.archive_replies enable row level security;

drop policy if exists "archive_records_delete_authenticated"
on public.archive_records;

create policy "archive_records_delete_authenticated"
on public.archive_records
for delete
to authenticated
using (true);

drop policy if exists "archive_replies_delete_authenticated"
on public.archive_replies;

create policy "archive_replies_delete_authenticated"
on public.archive_replies
for delete
to authenticated
using (true);
