
// 웹 소켓(통신)과 관련된 코드 모음
//const usercontroller = require("../controllers/usercontroller")
//const chatcontroller = require("../controllers/chatcontroller")
//const roomcontroller = require("../controllers/roomcontroller")

module.exports = function (io){ //io를 index.js에서 매개변수로 받아옴
    /*
    // 소켓에는 말하는 함수 .emit(), 듣는 함수 .on()이 있다.
    io.on("connection", async(socket)=>{ // 연결된 사람의 정보를 socket 매개변수로 받아 온다.
        console.log("client is connected", socket.id); // 소켓의 id값도 함께 출력해준다.

        socket.emit("rooms", await roomcontroller.getallrooms()); // 룸 리스트 보내기

        socket.on("login",async (username,callback)=>{
            //"login"으로 들었을 때 실행할 코드 부분 즉, 유저가 로그인을 했을 때 실행하는 코드다.
            // 받은 유저정보를 저장하고 소켓 아이디 정보를 저장한다.
            //유저 정보에 관한 코드는 io.js(통신 관련 파일)에 있을 필요가 없기에 따로 빼줌

            try {
                const user = await usercontroller.saveuser(username,socket.id);
                callback({ok:true, data:user});
            }catch (error){
                callback({ok:false, data:error.message});
            }

        });
        //프론트로부터 sendmessage라는 말을 들었을 때 message(메시지 내용)과 callback함수가 함께 온다.
        socket.on("sendmessage", async(message,cb)=>{
            try {
                // 저장해야 할 정보는 채팅 내용, 유저 id와 이름인데, 유저 정보는 socket id로 찾는다.
                const user = await usercontroller.checkuser(socket.id);
                // 이후 메시지 관련 정보를 저장한다.
                if(user){
                    const newmessage = await chatcontroller.savechat(message,user);
                    // a로부터 받은 내용을 채팅방에 있는 모든 유저들이 볼 수 있도록 하기 위해 모두에게 보내줘야 한다.
                    io.to(user.room.tostring()).emit("message", newmessage); // 서버가 프론트에게 소켓을 통해 데이터를 뿌려줌.
                    return cb({ ok: true });
                }

            }catch (error){
                cb({ok:false, data:error.message});
            }
        })


        socket.on("joinroom", async (rid, cb) => {
            try {
                const user = await usercontroller.checkuser(socket.id); // 일단 유저정보들고오기
                await roomcontroller.joinroom(rid, user);
                // 해당 유저를 room의 members 필드 리스트에 추가하고, user의 room 필드에도
                // 유저가 조인한 room 정보를 업뎃한다.

                socket.join(user.room.tostring());
                // soket은 해당 room id로 된 채널에 join한다. 나중에 방의 팀원들끼리 대화를 주고받을 때 필요함
                // 기존에는 채팅방이 나누어져 있지 않기에 그냥 emit을 해버리면 모두가 한 공간에서 말하고 다 들을 수 있었다.
                // 하지만 채팅방이 생기면서 모두에게 emit을 할 수 없음.
                // 따라서 soket들을 어떤 그룹으로 분리할 수 있고, 그 그룹에 들어가게 하는 함수를 join이라고 한다.
                // 위 코드의 의미는 이 소켓은 유저가 들어있는 방의 id를 이름으로 사용하는 어떤 그룹으로 들어가겠다는 이야기다.
                const welcomemessage = {
                    chat: `${user.name} is joined to this room`,
                    user: { id: null, name: "system" },
                };
                io.to(user.room.tostring()).emit("message", welcomemessage);// 유저가 조인했다는 메세지를 방에 있는 팀원에게만 보여줌
                io.emit("rooms", await roomcontroller.getallrooms());// 업데이트된 room데이터를 클라이언트들에게 보내준다.
                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        socket.on("leaveroom", async (_, cb) => {
            try {
                const user = await usercontroller.checkuser(socket.id);
                await roomcontroller.leaveroom(user);
                const leavemessage = {
                    chat: `${user.name} left this room`,
                    user: { id: null, name: "system" },
                };
                socket.broadcast.to(user.room.tostring()).emit("message", leavemessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다
                io.emit("rooms", await roomcontroller.getallrooms());
                socket.leave(user.room.tostring()); // join했던 방을 떠남
                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, message: error.message });
            }
        });

        socket.on("disconnect",()=>{ // 소켓 연결이 끊겼을 때 알려준다.
            console.log("user is disconnected");
        });
    });*/
};