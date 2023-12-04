import { io } from "socket.io-client";
const CON_PORT = 'localhost:4047/';

let socket ;
export default socket = io(CON_PORT) 