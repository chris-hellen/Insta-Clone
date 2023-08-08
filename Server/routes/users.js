module.exports = function ({app, connection, upload}) {
    app.post('/users/create', upload.single('avatar'), (req,res, next) => {
        const file = req.file;
        if (!file) {
            res.status(200).json({message: "Please upload your avatar"});
        }
        else {
            const avatar = '/' + file.filename;
            const {id, email, password, fullname} = req.body;
            if (email && password && fullname) {
                const findAccountByEmail = "SELECT * FROM user_account WHERE user_email = ?";
                connection.query(findAccountByEmail, [email], function (error, account) {
                    if (account && account. length != 0) {
                        res.status(200).jsonp({message: 'The email existed in the system'});
                    }
                    else {
                        const users = [[id, email, password, fullname, avatar]];
                        const registerUserSql = "INSERT INTO user_account (id, user_email, user_password, user_full_name, user_avatar) VALUES ?";
                        connection.query(registerUserSql, [users], function (error, insertedUser) {
                            if (insertedUser) {
                                res.status(200).jsonp({avatar, insertId: insertedUser.insertId});
                            }
                            else {
                                res.status(200).jsonp({message: 'Cannot create account, try again'});
                            }
                        });
                    }
                });
            }
            else {
                res.status(200).jsonp({message: 'Please input required fields'});
            }
        }
    });
    app.post('/users/followers', (req,res) => {
        const {followerNum, id} = req.body;
        const updateFollowerNumSql = "UPDATE user_account SET user_number_of_followers = ? WHERE id = ?";
        connection.query(updateFollowerNumSql, [followerNum, id], function (error, updatedUser) {
            if (error) {
                res.status(200).jsonp({message: "System error, try again"});
            }
            else if (updatedUser) {
                res.status(200).jsonp({id});
            }
        });
    });
    app.post('/users/posts', (req,res) => {
        const {postNum, id} = req.body;
        const updatePostNumSql = "UPDATE user_account SET user_number_of_posts = ? WHERE id = ?";
        connection.query(updatePostNumSql, [postNum, id], function (error, updatedUser) {
            if (error) {
                res.status(200).jsonp({message: "System error, try again"});
            }
            else if (updatedUser) {
                res.status(200).jsonp({id});
            }
        });
    });
    app.get('/users/:id', (req,res) => {
        const userId = req.params.id;
        if (!userId) {
            res.status(200).jsonp({message: "Cannot load user information, try again"});
        }
        const getUserSql = "SELECT * FROM user_account WHERE id = ?";
        connection.query(getUserSql, [userId], function (err, response) {
            if (response && response.length) {
                res.status(200).jsonp(response);
            }
            else {
                res.status(200).jsonp({message: 'Cannot load user information, try again'});
            }
        })
    })
};