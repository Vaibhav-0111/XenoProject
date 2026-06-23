import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface WebSocketEvent {
  type: string;
  eventType: string;
  customerName: string;
  campaignName: string;
  channel: string;
}

export function useDashboardWebSocket(onEvent?: (event: WebSocketEvent) => void) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // In dev, assuming the backend is on 8080. In prod, relative path.
    const url = import.meta.env.VITE_API_URL || "http://localhost:8080";

    const client = new Client({
      webSocketFactory: () => new SockJS(`${url}/ws-crm`),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe("/topic/dashboard", (message) => {
          if (message.body) {
            try {
              const event: WebSocketEvent = JSON.parse(message.body);
              if (onEvent) {
                onEvent(event);
              }
            } catch (err) {
              console.error("Failed to parse websocket message", err);
            }
          }
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [onEvent]);

  return { connected };
}
