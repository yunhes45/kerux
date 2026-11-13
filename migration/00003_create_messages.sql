-- +goose Up

create table messages (
      id              bigint      generated always as identity primary key,
      conversation_id bigint      not null references conversations (id) on delete cascade,
      seq             bigint      not null,
      sender_id       bigint      not null,
      client_msg_id   uuid        not null,
      body            text        not null,
      created_at      timestamptz not null default now(),
      unique (conversation_id, seq),
      unique (conversation_id, sender_id, client_msg_id)
);

-- +goose Down

drop table messages;