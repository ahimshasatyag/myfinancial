-- 202611250008_create_tags.sql
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name varchar(50) not null,
  created_at timestamptz not null default now(),
  constraint tags_name_not_blank check (length(trim(name)) > 0),
  constraint tags_user_id_id_unique unique (id, user_id)
);

create unique index if not exists tags_user_name_unique on public.tags (user_id, lower(name));

create table if not exists public.transaction_tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_id uuid not null,
  tag_id uuid not null,
  created_at timestamptz not null default now(),
  constraint transaction_tags_unique unique (user_id, transaction_id, tag_id),
  constraint transaction_tags_transaction_same_user_fk foreign key (transaction_id, user_id) references public.transactions(id, user_id) on delete cascade,
  constraint transaction_tags_tag_same_user_fk foreign key (tag_id, user_id) references public.tags(id, user_id) on delete cascade
);

create index if not exists transaction_tags_transaction_idx on public.transaction_tags (transaction_id);
create index if not exists transaction_tags_tag_idx on public.transaction_tags (tag_id);
