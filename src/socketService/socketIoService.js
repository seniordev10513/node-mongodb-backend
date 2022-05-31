import NotificationController from '../controllers/notif.controller/notif.controller';
import chatController from '../controllers/chat.controller/chat.controller';
import User from '../models/user.model/user.model'
// import Order from '../src/models/order.model/order.model'
import socketEvents from '../socketEvents'
// import contactUsController from '../src/controllers/contactUs.controller/contactUs.controller'
// import Company from '../src/models/company.model/company.model'



module.exports = {

  startNotification: function(io) {
    global.notificationNSP = io.of('/utils');
    notificationNSP.on('connection', async function(socket) {
      try {
        let id = socket.handshake.query.id;

        console.log('clientttttttt ' + id + ' connected on notification.');

        console.log(id);
        if (!isNaN(id)) {
          let user = await User.findOne({_id: id});

          if (user) {
            let adminCheck = false;
            if(user.type=="ADMIN") adminCheck = true;
            if(adminCheck){
              socket.join('room-admin'+user.id);
            }else{
              socket.join('room-'+user.id);
            }
              var roomName = id;
             await NotificationController.getCountNotification(id,adminCheck);
              // notificationNSP.to(roomName).emit(socketEvents.NotificationsCount, { count: count });
          }
        }
      } catch (error) {
        console.log(error);
      }
    })
  },

  chat: function(io) {
    global.chatNSP = io.of('/chat');
    chatNSP.on('connection', async function(socket) {
      try {
        let id = socket.handshake.query.id;
        // let receiverId = socket.handshake.query.receiver;
        // console.log(id);
        let user = await User.findById(id);
        let adminCheck = false;
        if(user.type=="ADMIN") adminCheck = true;
          if(adminCheck){
            socket.join('room-admin'+user.id);
          }else{
            socket.join('room-'+user.id);
          }
          console.log('New '+ user.type+' Connected ' + id + ' on chat ');
          // console.log('receiverId' + receiverId);
          await chatController.getCountChat(id,adminCheck);
          socket.on(socketEvents.Typing, async function(data) {
            // data =  { to }
            if (data.to) {
              chatNSP.to('room-' + data.to).emit(socketEvents.Typing, {
                user: user
              });
            } else {
              chatNSP.to('room-admin').emit(socketEvents.Typing, {
                user: user
              });
            }
          })
          socket.on(socketEvents.StopTyping, async function(data) {
            // data =  { to }
            if (data.to) {
              chatNSP.to('room-' + data.to).emit(socketEvents.Typing, {
                user: user
              });
            } else {
              chatNSP.to('room-admin').emit(socketEvents.Typing, {
                user: user
              });
            }
          })
          socket.on(socketEvents.UpdateSeen, async function(data) {
            // data = { type : 'ADMIN' or 'FRIEND' , user : 3 }
            if (data && data.user) {
              await chatController.updateSeen(data);
            }
          });

      } catch (error) {
        console.log(error);
      }
    })
  },

  admin: function(io) {
    // global.adminNSP = io.of('/admin');
    // adminNSP.on('connection', async function(socket) {
    //     var id = socket.handshake.query.id;
    //     let user = await User.findById(id);
    //     var roomName = 'room-admin';
    //     socket.join(roomName);
    //     if(user.type == 'SUB_ADMIN'){
    //         socket.join('room-'+ id);
    //         adminNSP.to('room-'+ id).emit(socketEvents.NewUser, {user, user });
    //     }
    //     console.log('New admin Connected ' + id + ' on admin nsp ');
    //     await NotificationController.getCountNotification(id, true);
    //     let onlineOrder = await Order.count({deleted:false , type:'ONLINE' , adminInformed:false});
    //     let manualOrder = await Order.count({deleted:false , type:'MANULAY' , adminInformed:false});
    //     adminNSP.emit(socketEvents.UpdateOrderCount, {onlineOrder, manualOrder });
    //     await messageController.countUnseenForAdmin();
    //     await contactUsController.countNotReplied();
    // })
  },

}
