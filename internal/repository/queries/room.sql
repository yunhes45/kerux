-- name: CreateDirectConversation :one
insert into conversations (type, direct_key)
values ('DIRECT', $1::text)
on conflict (direct_key) do nothing
returning id;

-- name: FindDirectConversation :one
select id from conversations
where direct_key = $1::text;

-- name: AddMember :exec
insert into conversation_members (conversation_id, member_id)
values ($1, $2);