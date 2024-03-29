const users=[];
//addUser,removeUser,getUser,getUsersInRoom

const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();
    //Validate the data
    if(!username || !room){
        return {
            error:"Username room are required"
        }
    }
    //Check for existence Users
    const exisitingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })
    //Validate username
    if(exisitingUser){
        return {
            error:"Username is in use"
        }
    }
    //Store USer
    const user={id,username,room}
    users.push(user)
    return {user}
}
const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }

}

const getUser=(id)=>{
    return users.find((user)=>user.id==id)
}
const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase();
    return users.filter((user)=>user.room===room)
}
module.exports={
    addUser,
    getUsersInRoom,
    getUser,
    removeUser
}
//!.Create getUser

