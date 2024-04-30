const express = require('express');
const api = require('./api');

const userRouter = express.Router();
const tweetRouter = express.Router();
const sessionRouter = express.Router();

// GET api/user/ : Get all users in database
userRouter.get("/", api.getAllUsers);

// GET api/user/:id : Get specific user in database
userRouter.get("/:id", api.getUser);

// GET api/user/stats/topStar : Get specific user in database
userRouter.get("/stats/topStar", api.getTopStar);

// GET api/user/stats/talkTooMuch : Get user with most tweets
userRouter.get("/stats/talkTooMuch", api.getTalkTooMuch);

// GET api/user/stats/topSimp : Get user with most following
userRouter.get("/stats/topSimp", api.getTopSimp);

//POST api/user/signin : Create a new user (raw, JSON)
userRouter.post("/signin", api.signin);

//POST api/user/login : Login with your username and password (raw, JSON)
userRouter.post("/login", api.login);

//PUT api/user/follow/:id : Follow a user with its id (Put your own in the body)
userRouter.put("/follow/:id", api.follow);

//PUT api/user/unfollow/:id : Unfollow a user with its id (Put your own in the body)
userRouter.put("/unfollow/:id", api.unfollow)

//GET /api/tweet : Get all tweets in the database
tweetRouter.get("/", api.getAllTweets);

//POST /api/tweet/add : Add a tweet (raw, JSON)
tweetRouter.post("/add", api.addTweet);

//PUT /api/tweet/modify/:id : Modify a tweet (raw, JSON)
tweetRouter.put("/modify/:id", api.modifyTweet) //the id here is actually the tweet id !

//GET /api/tweet/:id: Search for a tweet with its id
tweetRouter.get("/:id", api.getTweetById);

//DELETE /api/tweet/delete/:id : Delete a tweet with its id
tweetRouter.delete("/delete/:id", api.deleteTweet);

//GET api/tweet/user/:id : Get all the tweets of a user
tweetRouter.get("/user/:id", api.getTweetsByUserId);

//GET api/session/ : Check for existing session
sessionRouter.get("/", api.getSession);

//GET api/session/logout : Destroy existing session upon logout
sessionRouter.get("/logout", api.logoutSession);

module.exports = { userRouter, tweetRouter, sessionRouter };