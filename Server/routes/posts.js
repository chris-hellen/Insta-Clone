module.exports = function ({app, connection, upload}) {
    app.post('/posts', (req,res) => {
        const file = req.file;
        if (!file) {
            res.status(200).jsonp({message: 'Please upload your post image'});
        }
        else {
            const postContent = '/' + file.filename;
            const postCategory = req.file && req.file.mimetype.includes('image') ? 1 : 2;
            const postCreatedDate = new Date();
            const postCreatedBy = req.body.post_created_by;
            if (postCreatedBy) {
                const createdPost = [[postContent, postCategory, postCreatedDate, postCreatedBy]];
                const createPostSql = "INSERT INTO post (post_content, post_category, post_created_date, post_created_by) VALUES ?";
                connection.query(createPostSql, [createdPost], function (error, insertedPost) {
                    if (insertedPost) {
                        res.status(200).jsonp({id: insertedPost, post_content: postContent, post_category: postCategory, post_created_date: postCreatedDate, post_created_by: postCreatedBy});
                    }
                    else {
                        res.status(200).jsonp({message: "Cannot upload your post, please try again"});
                    }
                });
            }
            else {
                res.status(200).jsonp({message: "Cannot upload your post, please try again"});
            }
        }
    });
    app.get('/posts', (req, res) => {
        const getPostsSql = "SELECT * FROM post ORDER BY post_created_date DESC";
        connection.query(getPostSql, function(error, posts) {
            if(posts) {
                res.status(200).jsonp(posts);
            }
            else {
                res.status(200).jsonp({message: "Cannot get posts, please try again"});
            }
        });
    });
    app.get('/posts/:id', (req,res) => {
        const id = req.params.id;
        const getPostsSql = "SELECT post.id, post_content, post_category, post_created_date, post_created_by, post_number_of_reactions, user_account.user_avatar, user_account.user_full_name, user_account.user_number_of_followers FROM post INNER JOIN user_account ON post.post_created_by = user_account.id WHERE post.id = ?";
        if (!id){
            res.status(200).jsonp({message: "Cannot load the post detail, please try again"});
        }
        connection.query(getPostSql, [id], function (error, response) {
            if (response && response.length) {
                res.status(200).jsonp(response);
            }
            else {
                res.status(200).jsonp({message: "Not found"});
            }
        });
    });
    app.get('/posts/reactions', (req,res) => {
        const {reactionNUm, id} = req.body;
        const updateReactionNumSql = "UPDATE post SET post_number_of_reactions = ? WHERE id = ?";
        connection.query(updateReactionNumSql, [reactionNUm, id], function (error, updatedPost) {
            if (error) {
                res.status(200).jsonp({ message: "System error, try again"});
            }
            else if (updatedPost) {
                res.status(200).jsonp({id});
            }
        });
    });
    app.get('/post/categories', (req, res) => {
        const {userId, postCategory} = req.body;
        if (!userId || !postCategory) {
            res.status(200).jsonp({message: "Cannot load posts, try again"});
        }
        const getPostsSql = "SELECT * FROM post WHERE post_created_by = ? AND post_category = ? ORDER BY post_created_date DESC";
        connection.query(getPostsSql, [userId, postCategory], function (error, posts) {
            if (posts) {
                res.status(200).jsonp(posts);
            }
            else {
                res.status(200).jsonp({message: "Cannot get posts, try again"});
            }
        });
    });
};