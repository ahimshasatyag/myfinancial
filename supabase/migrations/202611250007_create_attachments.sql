-- 202611250007_create_attachments.sql
create table if not exists public.transaction_attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_id uuid not null,
  storage_path text not null,
  file_name varchar(255) not null,
  mime_type varchar(120) not null,
  size_bytes bigint,
  created_at timestamptz not null default now(),
  constraint transaction_attachments_size_positive check (size_bytes is null or size_bytes > 0),
  constraint transaction_attachments_user_path_unique unique (user_id, storage_path),
  constraint transaction_attachments_transaction_same_user_fk foreign key (transaction_id, user_id) references public.transactions(id, user_id) on delete cascade
);

create index if not exists transaction_attachments_transaction_idx on public.transaction_attachments (transaction_id);
