package handler

import (
	"errors"
	"net/http"
	"strconv"
)

func currentMember(r *http.Request) (int64, error) {
	id, err := strconv.ParseInt(r.URL.Query().Get("member"), 10, 64)
	if err != nil || id <= 0 {
		return 0, errors.New("member 쿼리 필요")
	}

	return id, nil
}
