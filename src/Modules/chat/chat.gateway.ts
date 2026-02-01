import { Server } from "socket.io";
import { IAuthSocket } from "../gateway/gateway.dto";
import { ChatEvents } from "./chat.events";





export class ChatGateWay{
   private _chatEvent = new ChatEvents();
  constructor(){}



 register = (socket:IAuthSocket ,io:Server)=>{
  this._chatEvent.sayHi(socket ,io);
  this._chatEvent.sendMessage(socket ,io);
 }

}