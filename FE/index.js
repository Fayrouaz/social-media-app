

const socket = io("http://localhost:3000" ,{
 auth:{
    authorization:"Token"
  }

});


socket.on("connect", () => {
  console.log("Connected successfully");
});

socket.on("product", (data , callbach) => {
  console.log({data});
  callbach("I Received Your Message")
});



// socket.emit("sayHi" , "Hello fron FrontEnd" , (res)=>{
//   console.log({res});
  
//   })