const {getUserById} = require("../src/app/user/userProvider");
const {postMessage} = require("../src/app/chat/ChatController");


module.exports = function (jwtMiddleware,io){ //io를 index.js에서 매개변수로 받아옴

    io.on("connection", async(socket)=>{
        //console.log(jwtMiddleware.verifiedToken.userId);

        socket.on("sendMessage", async(message,room_id,cb)=>{
                const user = await getUserById(jwtMiddleware.verifiedToken.userId); // jwt 토큰으로 유저 조회
                //socket.verifiedToken.userId로 해야하나??
                // 여기서 sokcet.id 말고 유저 id를 넘겨 받으면 mySQL을 통해 유저를 넘겨줄 수 있는데, 유저 id를 넘겨 받을 수 없나?

                const newMessage = await postMessage(message,room_id,user);

                io.to(user.room.toString()).emit("message", newMessage); // 서버가 프론트에게 소켓을 통해 데이터를 뿌려줌.
                return cb({ ok: true });
        });

        socket.on("disconnect",()=>{ // 소켓 연결이 끊겼을 때 알려준다.
            console.log("user is disconnected");
        });
    });
};