import dotenv from "dotenv";
import { PeerServer } from "peer";
import { verifyJWT } from "./utils/verifyJWT";

dotenv.config();

process.on("uncaughtException", function (e) {
  console.error("Error: " + e);
});

interface AddressInfo {
  address: string;
  family: string;
  port: number;
}

const server = PeerServer({ port: 9000, path: "/myapp" }, (server) => {
  const { address, port } = server.address() as AddressInfo;

  console.log(
    "Started PeerServer on %s, port: %s, path: %s",
    address,
    port,
    "/myapp"
  );

  const shutdownApp = () => {
    server.close(() => {
      console.log("Http server closed.");

      process.exit(0);
    });
  };

  process.on("SIGINT", shutdownApp);
  process.on("SIGTERM", shutdownApp);
});

server.on("connection", (client) => {
  const peerId = client.getId();
  const peerToken = client.getToken();

  console.log(`Client connected: ${peerId}`);
  console.log(`Client token: ${peerToken}`);
  if (!verifyJWT(peerToken)) {
    const socket = client.getSocket();
    if (!socket) {
      console.log("user doesn't have a socket to disconnect");
      return;
    }
    console.log("disconnecting user");
    socket.close();
    return;
  }
});

server.on("disconnect", (client) => {
  console.log(`Client disconnected: ${client.getId()}`);
});
