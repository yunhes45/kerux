-- +goose Up

create table conversations (
   id              bigint      generated always as identity primary key,
   type            text        not null check (type in ('DIRECT', 'GROUP')),
   direct_key      text        unique,
   last_seq        bigint      not null default 0,
   last_message_at timestamptz,
   created_at      timestamptz not null default now()
);

-- +goose Down

drop table conversations;