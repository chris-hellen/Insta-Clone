module.exports = function ({app, connection}){
    app.post('/notification/create', (req, res) => {
        const {notificationImage, notificationMessage, userId} = req.body;
        if (!notificationImage || !notificationMessage || !userId) {
            res.status(200).jsonp({message: "Could not create notification, please try again"});
        }
        const createNoti = [[notificationImage, notificationMessage, userId]];
        const createNotiSql = "INSERT INTO user_notification (notification_image, notification_message, user_id) VALUES ?";
        connection.query(createNotiSql, [createNoti],  function (error, insertedNoti) {
            if (insertedNoti) {
                res.status(200).jsonp({id :insertedNoti.insertId, notification_image: notificationImage, notification_message: notificationMessage})
            }
            else {
                res.status(200).jsonp({message: "Could not create notification, please try again"});
            }
        });
    });
    app.get('/notifications/:id', (req, res) => {
        const userId = req.params.id;
        const getNotiSql = 'SELECT * FROM user_notification WHERE user_id = ? ORDER BY id DESC';
        connection.query(getNotiSq, [userId], function (error, notifications) {
            if (notifications){
                res.status(200).jsonp(notifications);
            }
            else {
                res.status(200).jsonp({message: "Cannot get your notifications, please try again"});
            }
        });
    });
}