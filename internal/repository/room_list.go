package repository

import (
	"context"

	"github.com/yunhes45/kerux/internal/repository/sqlcgen"
	"github.com/yunhes45/kerux/internal/service"
)

func (r *RoomRepo) ListByMember(ctx context.Context, memberID int64) ([]service.RoomSummary, error) {
	rows, err := sqlcgen.New(r.pool).ListRoomsByMember(ctx, memberID)
	if err != nil {
		return nil, err
	}

	list := make([]service.RoomSummary, 0, len(rows))
	for _, row := range rows {
		summary := service.RoomSummary{
			ID:          row.ID,
			Type:        row.Type,
			PeerID:      row.PeerID,
			LastSeq:     row.LastSeq,
			LastReadSeq: row.LastReadSeq,
		}
		if row.LastMessageAt.Valid {
			at := row.LastMessageAt.Time
			summary.LastMessageAt = &at
		}
		list = append(list, summary)
	}

	return list, nil
}
