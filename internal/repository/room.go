package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/yunhes45/kerux/internal/repository/sqlcgen"
	"github.com/yunhes45/kerux/internal/service"
)

type Rooms struct {
	pool *pgxpool.Pool
}

func NewRooms(pool *pgxpool.Pool) *Rooms {
	return &Rooms{pool: pool}
}

func (r *Rooms) InTx(ctx context.Context, fn func(tx service.RoomTx) error) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if err := fn(&roomTx{q: sqlcgen.New(tx)}); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

type roomTx struct {
	q *sqlcgen.Queries
}

func (t *roomTx) InsertDirect(ctx context.Context, directKey string) (int64, bool, error) {
	id, err := t.q.CreateDirectConversation(ctx, directKey)
	if errors.Is(err, pgx.ErrNoRows) {
		return 0, false, nil
	}
	if err != nil {
		return 0, false, err
	}
	return id, true, nil
}

func (t *roomTx) FindDirect(ctx context.Context, directKey string) (int64, error) {
	return t.q.FindDirectConversation(ctx, directKey)
}

func (t *roomTx) AddMember(ctx context.Context, conversationID, memberID int64) error {
	return t.q.AddMember(ctx, sqlcgen.AddMemberParams{ConversationID: conversationID, MemberID: memberID})
}
