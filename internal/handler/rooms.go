package handler

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/yunhes45/kerux/internal/service"
)

type createRoomRequest struct {
	PeerID int64 `json:"peer_id"`
}

type createRoomResponse struct {
	ConversationID int64 `json:"conversation_id"`
}

func RegisterRooms(mux *http.ServeMux, store service.RoomStore) {
	mux.HandleFunc("POST /api/v1/rooms", createRoom(store))
}

func createRoom(store service.RoomStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		me, err := currentMember(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var req createRoomRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "잘못된 요청", http.StatusBadRequest)
			return
		}

		opened, err := service.OpenDirect(r.Context(), store, me, req.PeerID)
		if errors.Is(err, service.ErrInvalidRequest) {
			http.Error(w, "잘못된 요청", http.StatusBadRequest)
			return
		}
		if err != nil {
			log.Printf("open direct: %v", err)
			http.Error(w, "서버 오류", http.StatusInternalServerError)
			return
		}

		status := http.StatusOK
		if opened.Created {
			status = http.StatusCreated
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		_ = json.NewEncoder(w).Encode(createRoomResponse{ConversationID: opened.ID})
	}
}
