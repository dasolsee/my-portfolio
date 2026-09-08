-- 관리자 인증을 마친 사용자만 Archive 답변을 수정할 수 있게 한다.
grant update on table public.archive_replies to authenticated;

alter table public.archive_replies enable row level security;

drop policy if exists "archive_replies_update_authenticated"
on public.archive_replies;

create policy "archive_replies_update_authenticated"
on public.archive_replies
for update
to authenticated
using (true)
with check (true);
