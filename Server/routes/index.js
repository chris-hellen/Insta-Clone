const authRoute = require("./auth");
const postRoute = require("./posts");
const followerRoute = require("./followers");
const userRoute = require("./users");
const reactionRoute = require("./reactions");
const notificationRoute = require("./notifications");

module.exports = function ({app, connection, upload}) {
    authRoute({ app, connection });
    userRoute({ app, connection, upload });
    followerRoute({ app, connection });
    notificationRoute({ app, connection });
    postRoute({ app, connection, upload });
    reactionRoute({ app, connection });
};