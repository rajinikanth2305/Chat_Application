const express= require("express")
const socketio=require("socket.io");
const {
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");
const {addUser,removeUser,getUser,getUsersInRoom}=require("./utils/users")
const http=require("http")
const path=require("path")
const app=express();
const Filter=require("bad-words")
const server=http.createServer(app)
const io=socketio(server);
const port=process.env.PORT || 3000;
const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))
//let count=0
io.on("connection",(socket)=>{
    console.log("New websocket connection")
    // socket.emit("countUpdated",count)
    // socket.on("increment",()=>{
    //     count++;
    //     //socket.emit("countUpdated",count);
    //     io.emit("countUpdated",count);
    // })

    socket.on("join",({username,room},callback)=>{
        const {error,user}=addUser({id:socket.id,username,room});
        if(error){
            return callback(error)

        }
        socket.join(user.room)
         socket.emit("message", generateMessage("Admin","Welcome!"));
         socket.broadcast.to(user.room).emit(
           "message",
           generateMessage("Admin",`A new user ${user.username} has joined`)
         );
         io.to(user.room).emit("roomData",{
             room:user.room,
             users:getUsersInRoom(user.room)
         })
         callback();
        //socket.emit(specific client) io.emit(for eevry connecetd client) socket.broadcast.emit(for all clients excpet this client)
        //io.to.emit, socket.broadcast.to.emit
    })
    socket.on("sendMessage",(message,callback)=>{
        //console.log(message,"Checking at server side")
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback("Profinity is not allowed")
        }
        const user=getUser(socket.id)
        io.to(user.room).emit("message",generateMessage(user.username,message));
        callback();
    })
    socket.on("sendLocation",(cords,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit("location",generateLocationMessage(user.username,`https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
        callback();
    })
    socket.on("disconnect",()=>{
        const user=removeUser(socket.id);
        if(user){
        io.to(user.room).emit("message", generateMessage("Admin",`${user.username} has left`));
        io.to(user.room).emit("roomData",{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        }
    })

})

server.listen(port,()=>{
    console.log(`server is up on port ${port}`)
})