package handler

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/yunhes45/kerux/internal/service"
)

type roomItem struct {
	ConversationID int64      `json:"conversation_id"`
	Type           string     `json:"type"`
	PeerID         int64      `json:"peer_id,omitempty"`
	Unread         int64      `json:"unread"`
	LastMessageAt  *time.Time `json:"last_message_at"`
}

func RegisterRoomList(mux *http.ServeMux, lister service.RoomLister) {
	mux.HandleFunc("GET /rooms", listRooms(lister))
}

func listRooms(lister service.RoomLister) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		me, err := currentMember(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		rooms, err := service.ListRooms(r.Context(), lister, me)
		if errors.Is(err, service.ErrInvalidRequest) {
			http.Error(w, "잘못된 요청", http.StatusBadRequest)
			return
		}
		if err != nil {
			log.Printf("list rooms: %v", err)
			http.Error(w, "서버 오류", http.StatusInternalServerError)
			return
		}

		items := make([]roomItem, 0, len(rooms))
		for _, room := range rooms {
			items = append(items, roomItem{
				ConversationID: room.ID,
				Type:           room.Type,
				PeerID:         room.PeerID,
				Unread:         room.Unread(),
				LastMessageAt:  room.LastMessageAt,
			})
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(items)
	}
}
