import * as admin from 'firebase-admin';

const serviceAccount = require('../../serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


export async function sendPushNotification(notifi) {

    try {

      //  for (let index = 0; index < notifi.targetUser.length; index++) {
            var userToken = notifi.targetUser;
            // if (notifi.targetUser.tokens[index].type == 'android') {
                var payload = { token: userToken };
                payload.data = {
                    title: notifi.title.toString(),
                    body: notifi.text,
                    subjectType: notifi.subjectType,
                    subjectId: notifi.subjectId,
                }
                payload.android = {

                 notification: {
                   title: notifi.title.toString(),
                   body: notifi.text,
                   sticky: false,
                   visibility: 'public',
                   eventTimestamp: new Date(),
                   priority: 'high',
                   vibrateTimingsMillis: [100, 50, 250],
                   defaultVibrateTimings: false,
                   defaultSound: true,
                   lightSettings: {
                     color: '#AABBCC55',
                     lightOnDurationMillis: 200,
                     lightOffDurationMillis: 300,
                   },
                   defaultLightSettings: false,
                   notificationCount: 1,
                 },
                }
                // payload.notification = {
                //
                // }
                if(notifi.image && notifi.image != ''){
                    payload.data.image = notifi.image;
                    payload.data.badge = notifi.image;
                    payload.notification.image = notifi.image;
                }
                // console.log(payload)
                admin.messaging().send(payload)
                    .then(response => {
                        console.log('Successfully sent a message');
                    })
                    .catch(error => {
                        console.log('Error sending a message:', error.message);
                    });
      //       } else {
      //           let payload = {
      //               notification: {
      //                   title: notifi.title.toString(),
			// image: 'https://www.borsetelgomla.com/Borsa-Backend/otherImage.png',
      //                   body: notifi.text,
      //                   sound: 'default',
      //                   badge: '1'
      //               },
      //               data: {
      //                   message: notifi.text,
      //                   subjectId: notifi.subjectId.toString(),
      //                   subjectType: notifi.subjectType,
      //               }
      //           };
      //           if (notifi.trip) payload.data.trip = notifi.trip.toString();
      //           admin.messaging().sendToDevice(userToken, payload)
      //               .then(response => {
      //                   console.log('Successfully sent a message');
      //               })
      //               .catch(error => {
      //                   console.log('Error sending a message:', error);
      //               });
      //       }
      //  }
    } catch (error) {
        
        console.log('fire base error -->  ', error.message);
        console.log('fire base error -->  ', error);
    }
}

export async function sendPushNotificationToGuests(notifi) {
    var payload = {
        data: {
            message: notifi.text,
            subjectId: notifi.subjectId.toString(),
            subjectType: notifi.subjectType
        },
        token: notifi.targetUser
    }
    admin.messaging().send(payload)
        .then(response => {
            console.log('Successfully sent a message');
        })
        .catch(error => {
            console.log('Error sending a message:', error.message);
        });
}

export async function testDifferentPayLoad(payload) {
    let c = await User.find({ deleted: false });
    for (let index = 0; index < c.length; index++) {
        for (let i = 0; i < c[index].token.length; i++) {
            payload.token = c[index].token[i];
            admin.messaging().send(payload)
                .then(response => {
                    console.log('Successfully sent a message');
                })
                .catch(error => {
                    console.log('Error sending a message:', error.message);
                });

        }

    }

}
