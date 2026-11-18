package service

import (
	"context"
	"time"
)

type RoomSummary struct {
	ID            int64
	Type          string
	PeerID        int64
	LastSeq       int64
	LastReadSeq   int64
	LastMessageAt *time.Time
}

func (s RoomSummary) Unread() int64 {
	unread := s.LastSeq - s.LastReadSeq
	if unread < 0 {
		return 0
	}
	return unread
}

type RoomLister interface {
	ListByMember(ctx context.Context, memberID int64) ([]RoomSummary, error)
}

func ListRooms(ctx context.Context, lister RoomLister, memberID int64) ([]RoomSummary, error) {
	if memberID <= 0 {
		return nil, ErrInvalidRequest
	}

	return lister.ListByMember(ctx, memberID)
}
