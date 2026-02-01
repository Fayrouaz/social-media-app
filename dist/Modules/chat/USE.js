"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
useEffect(() => {
    socket.on("successMessage", (data) => {
        console.log("SUCCESS MESSAGE:", data);
    });
    socket.on("newMessage", (data) => {
        console.log("NEW MESSAGE:", data);
    });
    socket.on("custom_error", (error) => {
        console.log("CUSTOM ERROR:", error);
    });
    return () => {
        socket.off("successMessage");
        socket.off("newMessage");
        socket.off("custom_error");
    };
}, []);
