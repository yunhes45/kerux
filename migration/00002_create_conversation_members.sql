-- +goose Up

create table conversation_members (
      id              bigint      generated always as identity primary key,
      conversation_id bigint      not null references conversations (id) on delete cascade,
      member_id       bigint      not null,
      last_read_seq   bigint      not null default 0,
      joined_at       timestamptz not null default now(),
      unique (conversation_id, member_id)
);

create index conversation_members_member_idx on conversation_members (member_id);

-- +goose Down

drop table conversation_members;