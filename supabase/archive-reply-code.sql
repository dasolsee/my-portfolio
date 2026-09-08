-- Archive 답변에도 코드 언어와 코드를 저장한다.
alter table public.archive_replies
add column if not exists code_language text;

alter table public.archive_replies
add column if not exists code text;
