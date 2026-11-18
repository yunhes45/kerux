package service

import (
	"context"
	"errors"
	"fmt"
)

var ErrInvalidRequest = errors.New("잘못된 요청")

type Opened struct {
	ID      int64
	Created bool
}

type RoomTx interface {
	InsertDirect(ctx context.Context, directKey string) (id int64, inserted bool, err error)
	FindDirect(ctx context.Context, directKey string) (int64, error)
	AddMember(ctx context.Context, conversationID, memberID int64) error
}

type RoomStore interface {
	InTx(ctx context.Context, fn func(tx RoomTx) error) error
}

func OpenDirect(ctx context.Context, store RoomStore, me, other int64) (Opened, error) {
	if me <= 0 || other <= 0 || me == other {
		return Opened{}, ErrInvalidRequest
	}

	lo, hi := me, other
	if lo > hi {
		lo, hi = hi, lo
	}
	key := fmt.Sprintf("%d:%d", lo, hi)

	var opened Opened

	err := store.InTx(ctx, func(tx RoomTx) error {
		id, inserted, err := tx.InsertDirect(ctx, key)
		if err != nil {
			return err
		}

		if !inserted {
			id, err = tx.FindDirect(ctx, key)
			if err != nil {
				return err
			}
			opened = Opened{ID: id}
			return nil
		}

		for _, memberID := range []int64{lo, hi} {
			if err := tx.AddMember(ctx, id, memberID); err != nil {
				return err
			}
		}
		opened = Opened{ID: id, Created: true}
		return nil
	})
	if err != nil {
		return Opened{}, err
	}

	return opened, nil
}
