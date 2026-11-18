-- name: ListRoomsByMember :many
select
    c.id,
    c.type,
    c.last_seq,
    c.last_message_at,
    m.last_read_seq,
    coalesce(p.member_id, 0)::bigint as peer_id
from conversation_members m
         join conversations c on c.id = m.conversation_id
         left join conversation_members p
                   on p.conversation_id = c.id
                   and p.member_id <> m.member_id
                   and c.type = 'DIRECT'
where m.member_id = $1
order by c.last_message_at desc nulls last, c.id desc;