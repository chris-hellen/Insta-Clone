module.exports = function ({app, connection}) {
    app.post('/followers/get', (req, res) => {
        const { followerId, userId } = req.body;
        if (!followerId || !userId) {
            res.status(200).jsonp({message: "Not Found"});
        }
        const getFollowerSql = 'SELECT * FROM user_follower WHERE follower_id = ? AND  user_id = ?';
        connection.query(getFollowerSql, [followerId, userId], function (error, response) {
            if (response && response.length != 0) {
                res.status(200).jsonp({...response[0]});
            }
            else {
                res.status(200).jsonp({message: "Not Found"});
            }
        });
    });

    app.post('/followers/create', (req, res) => {
        const { followerId, userId } = req.body;
        if (!followerId || !userId) {
            res.status(200).jsonp({message: "Cannot create follower, please try again"});
        }
        const followers = [[followerId, userId]];
        const insertFollowersSql = 'INSERT INTO user_follower (follower_id, user_id) VALUES ?';
        connection.query(insertFollowersSql, [followers], function (error, insertedFollower) {
            if (insertedFollower) {
                res.status(200).jsonp({ id: insertedFollower.insertId, follower_Id: followerId, user_id: userId});
            }
            else {
                res.status(200).jsonp({message: "Cannot create follower, please try again"});
            }
        });
    });

    app.post('/followers/delete', (req,res) => {
        const { followerId, userId } = req.body;
        if (!followerId || !userId){
            res.status(200).jsonp({message: "Cannot delete follower, please try again"});
        }
        const deleteFollowersSql = 'DELETE FROM user_followers WHERE follower_id = ? AND user_id = ?';
        connection.query(deleteFollowersSql, [followerId, userId], function (error, response) {
            if (response && response.affectedRows){
                res.status(200).jsonp({ followerId, userId });
            }
            else {
                res.status(200).jsonp({message: "Cannot delete follower, please try again"});
            }
        });
    });
};