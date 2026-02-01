import { Server as httServer } from "http";
import { Server } from "socket.io";

import { decodedToken, tokenTypeEnum } from "../../Utils/security/token";
import { IAuthSocket } from "./gateway.dto";
import {  ChatGateWay } from "../chat/chat.gateway";





 let io:Server | null= null

export const intialize = (httpServer : httServer)=>{




   io = new Server(httpServer , {
    cors:{
     origin:"*"
    }
  });

 
const connectedSockets = new Map<string, string[]>();
  

// io.use(async (socket: IAuthSocket, next) => { // تغيير Socket لـ any هنا بيحل مشكلة الـ authorization فوراً
//   try {
//     // الوصول للـ token من الـ auth
//     const authHeader = socket.handshake?.auth?.authorization;

//     if (!authHeader) {
//       return next(new Error("No token provided"));
//     }
//     const { user, decode } = await decodedToken({
//       // نستخدم Casting للـ object بالكامل ليتوافق مع النوع الخاطئ
//       authorization: authHeader,
//       tokenType: tokenTypeEnum.ACCESS
//     } as any);

//     // حل مشكلة user._id
//     if (user && (user as any)._id) {
//        const userId = (user as any)._id.toString();
//        connectedSockets.set(userId, socket.id);
//     }
//      socket.creditionals ={ user, decode };
//     next();
//   } catch (error: any) {
//     next(new Error("Authentication failed"));
//   }
// });

io.use(async (socket: IAuthSocket, next) => {
  try {
    const authHeader = socket.handshake?.auth?.authorization;

    if (!authHeader) {
      return next(new Error("No token provided"));
    }

    // التعديل هنا: نمرر المفتاح بالاسم الخاطئ الذي تتوقعه الدالة لضمان وصول القيمة
    const { user, decode } = await (decodedToken as any)({
      authorizition: authHeader, // نرسلها بـ i زائدة كما هي في تعريف الدالة عندك
      tokenType: tokenTypeEnum.ACCESS
    });

    
    //socket.creditionals = { user, decode };
socket.creditionals = { user, decode };
socket.data.userId = user._id.toString(); // 👈 ضيفي السطر ده

    const userTabs = connectedSockets.get(user._id.toString()) || [];
    userTabs.push(socket.id)
    const userId = user?._id?.toString();
    if (userId) {
      connectedSockets.set(userId, userTabs);
    }

    next();
  } catch (error: any) {
    console.error("Socket Middleware Error:", error.message);
    next(new Error("Authentication failed"));
  }
});
 
     

  const chatGateWay :ChatGateWay = new ChatGateWay();
io.on("connection", (socket: IAuthSocket) => {
     console.log(connectedSockets);
     
    const userId = socket.creditionals?.user?._id?.toString();


    if (userId) {
        console.log("✅ User ID Connected:", userId);
         socket.join(userId);
    } else {
        console.log("❌ Failed to get ID. Full User object:", socket.creditionals?.user);
    }
    console.log("User Channel:", socket.id);
    chatGateWay.register(socket ,getIo())
    // socket.on("disconnect", () => {


    //    const userId = socket.creditionals?.user._id?.toString( ) as string  ;
    //    let  remainingTabs =connectedSockets.get(userId)?.filter((tab) =>{
    //       return tab !== socket.id;
    //  }) || []
    //    if(remainingTabs.length){
          
    //       connectedSockets.set(userId , remainingTabs)
    //   }else{
    //    connectedSockets.delete(userId)
         
    //  }

    //     console.log(`After Delete:: ${connectedSockets.get(userId)}`);
    //     console.log(connectedSockets);
        
    // });



socket.on("disconnect", () => {
 const userId = socket.data.userId;
if (!userId) return;


  const remainingTabs =
    connectedSockets.get(userId)?.filter(tab => tab !== socket.id) || [];

  if (remainingTabs.length) {
    connectedSockets.set(userId, remainingTabs);
  } else {
    connectedSockets.delete(userId);
  }

  console.log(`After Delete:: ${connectedSockets.get(userId)}`);
  console.log(connectedSockets);
});

});
  

}


export const getIo = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io; 
};

