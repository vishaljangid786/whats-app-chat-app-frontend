import { getSocket } from "./socket";

export const testSocket = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    // turn off listning to this event
    socket.off("testSocket", payload); //payload is the callback
  } else if (typeof payload == "function") {
    socket.on("testSocket", payload); //payload as callback for this event
  } else {
    socket.emit("testSocket", payload); //sendung payload as data
  }
};


export const updateProfile = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    // turn off listning to this event
    socket.off("updateProfile", payload); //payload is the callback
  } else if (typeof payload == "function") {
    socket.on("updateProfile", payload); //payload as callback for this event
  } else {
    socket.emit("updateProfile", payload); //sendung payload as data
  }
};