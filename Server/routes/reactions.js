module.exports = function ({app, connection }) {
    app.post('/reactions/create', (req,res) => {
        const {postId, userId} = req.body;
        if (!postId || !userId) {
            res.status(200).jsonp({message: "Cannot create post reaction, please try again"});
        }
        const reactions = [[postId, userId]];
        const insertReactionSql = "INSERT INTO post_reaction (post_id, user_id) VALUES ?";
        connection.query(insertReactionSql, [reactions], function (error, insertedReaction) {
            if (insertedReaction){
                res.status(200).jsonp({insertId: insertedReaction.insertId, post_id: postId, user_id: userId});
            }
            else {
                res.status(200).jsonp({message: "Cannot create post reaction, please try again"});
            }
        });
    });
    app.post('/reactions/get', (req,res) => {
        const {postId, userId} = req.body;
        if (!postId || !userId) {
            res.status(200).jsonp({message: "Not Found"});
        }
        const getReactionsSql = "SELECT * FROM post_reaction WHERE post_id =? AND user_id = ?";
        connection.query(getReactionsSql, [postId, userId], function (error, response) {
            if (response && response.length) {
                res.status(200).jsonp(...response[0]);
            }
            else {
                res.status(200).jsonp({message: "Not Found"});
            }
        });
    });
    app.post('/reactions/delete', (req,res) => {
        const {postId, userId} = req.body;
        if (!postId || !userId) {
            res.status(200).jsonp({message: "Cannot delete post reaction, try again"});
        }
        const deleteReactionSql = "DELETE FROM post_reaction WHERE post_id = ? AND user_id = ?";
        connection.query(deleteReactionSql, [postId, userId], function (error, response) {
            if(response && response.affectedRows) {
                res.status(200).jsonp({ postId, userId});
            }
            else {
                res.status(200).jsonp({ message: "Cannot delete post reaction, try again"});
            }
        });
    });
}