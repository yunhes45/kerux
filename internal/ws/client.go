package ws

import (
	"context"
	"time"

	"github.com/coder/websocket"
)

const (
	sendQueueSize = 16
	writeTimeout  = 5 * time.Second
)

type Client struct {
	conn *websocket.Conn
	send chan Message
}

func NewClient(conn *websocket.Conn) *Client {
	return &Client{
		conn: conn,
		send: make(chan Message, sendQueueSize),
	}
}

func (c *Client) TrySend(msg Message) bool {
	select {
	case c.send <- msg:
		return true
	default:
		return false
	}
}

func (c *Client) Close() {
	_ = c.conn.CloseNow()
}

func (c *Client) WritePump(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		case msg := <-c.send:
			wctx, cancel := context.WithTimeout(ctx, writeTimeout)
			err := c.conn.Write(wctx, msg.Type, msg.Data)
			cancel()
			if err != nil {
				c.Close()
				return
			}
		}

	}
}
