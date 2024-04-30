const User = require('./entities/User');
const Tweet = require('./entities/Tweet');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/* =====================================================================================
                                Get all users in the database 
========================================================================================*/
const getAllUsers = async(req, res, next) => {
    let users;

    //find all users
    try{
        users = await User.find();
    } catch(error){
        console.log(error);
    }
    //if there are no users : error 404
    if(!users){
        return res.status(404).json({ message: "Nobody tries this app you failure" });
    }
    return res.status(200).json({users});
}; 

/* =====================================================================================
                                Get a user in the database 
========================================================================================*/
const getUser = async(req, res, next) => {
    const userId = req.params.id;

    //find a user
    let user;
    try{
        user = await User.findById(userId);
    } catch(error){
        console.log(error);
    }
    //if there is no user : error 404
    if(!user){
        return res.status(404).json({ message: "Go see a doctor you're looking for an imaginary guy" });
    }
    return res.status(200).json({user});
};

/* =====================================================================================
                                Get user with most followers
========================================================================================*/
const getTopStar = async(req, res, next) => {
    let topStar;

    try {
        topStar = await User.aggregate([
            { "$project": {
                "username": 1,
                "followers": 1,
                "length": { "$size": "$followers" }
            }},
            { "$sort": { "length": -1} },
            { "$limit": 1 }
        ]);
    } catch(error) {
        console.log(error);
    }

    if(!topStar){
        return res.status(404).json({ message: "You are just a mob too bad you'll never shine" });
    }
    return res.status(200).json({topStar});
}

/* =====================================================================================
                                Get user with most tweets
========================================================================================*/
const getTalkTooMuch = async(req, res, next) => {
    let talkTooMuch;

    try {
        talkTooMuch = await User.aggregate([
            { "$project": {
                "username": 1,
                "tweets": 1,
                "length": { "$size": "$tweets" }
            }},
            { "$sort": { "length": -1} },
            { "$limit": 1 }
        ]);
    } catch(error) {
        console.log(error);
    }

    if(!talkTooMuch){
        return res.status(404).json({ message: "You are boring you don't tell any stories" });
    }
    return res.status(200).json({talkTooMuch});
}

/* =====================================================================================
                                Get user with most following
========================================================================================*/
const getTopSimp = async(req, res, next) => {
    let topSimp;

    try {
        topSimp = await User.aggregate([
            { "$project": {
                "username": 1,
                "following": 1,
                "length": { "$size": "$following" }
            }},
            { "$sort": { "length": -1} },
            { "$limit": 1 }
        ]);
    } catch(error) {
        console.log(error);
    }

    if(!topSimp){
        return res.status(404).json({ message: "You have no interest in other people you suck" });
    }
    return res.status(200).json({topSimp});
}

/* =====================================================================================
                                Sign in the database 
========================================================================================*/
const signin = async(req, res, next) => {
    //client's information
    const { username, firstname, lastname, password, confirmpassword } = req.body;

    //check if your username unique
    let usernameTaken;

    try{
        usernameTaken = await User.findOne({ username });
    } catch(error){
        return console.log(error);
    }
    if(usernameTaken){
        return res.status(404).json({ message: "Be more original please you suck this username already exists "});
    }

    //check if your password is the same as your confirmpassword
    if ( password !== confirmpassword ) {
        return res
            .status(401)
            .json({ message : "Cannot even remember your password ? Grandpa" });
    }

    //encrypts your password
    const encryptedPassword = bcrypt.hashSync(password);
    //create a new user in your database
    const user = new User({ username, firstname, lastname, password: encryptedPassword, confirmpassword: encryptedPassword, tweets: [] });

    try{
        await user.save();
    } catch(error) {
        return console.log(error);
    }

    return res.status(201).json({ user });
};

/* =====================================================================================
                                Log in the database 
========================================================================================*/
const login = async(req, res, next) => {
    //client's information
    const { username, password } = req.body;

    //check if the username exists
    let existingUser;
    try{
        existingUser = await User.findOne({ username });
    } catch(error){
        return console.log(error);
    }

    if(!existingUser){
        return res
            .status(404)
            .json({ message: "Bro at this point just create a new account, this username doesn't exist"});
    }

    //check if the password is the right one
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if(!isPasswordCorrect){
        return res.status(400).json({ message : "Can't remember your password ? Create another account :)"});
    }

    //get newly created user entry to get the generated userId
    let newUser;
    try{
        newUser = await User.findOne({ username });
    } catch(error){
        return console.log(error);
    }

    //create a new session
    let session = req.session;
    session.userId = newUser.id;
    return res.status(200).json({ message : "Congrats you passed the first stage : Login"})
};

/* =====================================================================================
                                Follow a user in the database 
========================================================================================*/
const follow = async(req, res, next) => {
    const userToFollow = req.params.id;
    const currentUser = req.body.userId;
    //Check if you're trying to follow yourself
    if(currentUser !== userToFollow){
        let u;
        let utf;
        try{
            u = await User.findById(currentUser);
            utf = await User.findById(userToFollow);

            //check if you already follow this user
            if(!utf.followers.includes(currentUser)){
                await utf.updateOne({ $push : { followers : currentUser} });
                await u.updateOne({ $push : { following : userToFollow}});
                return res.status(200).json({ message : "Congrats you followed one more user"});
            }
            else{
                return res.status(403).json({message : "Stop simping you already follow them"});
            }
            
        } catch(error) {
            return console.log(error);
        }
    }
    return res.status(403).json({ message : "You won't get more followers by following yourself you attention seeker -_-" });
};

/* =====================================================================================
                                Unfollow a user in the database 
========================================================================================*/
const unfollow = async(req, res, next) => {
    const userToUnfollow = req.params.id;
    const currentUser = req.body.userId;
    //Check if you're trying to follow yourself
    if(currentUser !== userToUnfollow){
        let u;
        let utu;
        try{
            u = await User.findById(currentUser);
            utu = await User.findById(userToUnfollow);

            //check if you already follow this user
            if(utu.followers.includes(currentUser)){
                await utu.updateOne({ $pull : { followers : currentUser} });
                await u.updateOne({ $pull : { following : userToUnfollow}});
                return res.status(200).json({ message : "Congrats you unfollowed one more user"});
            }
            else{
                return res.status(403).json({message : "Stop hating you don't even follow them"});
            }
            
        } catch(error) {
            return console.log(error);
        }
    }
    return res.status(403).json({ message : "You can't unfollow yourself even if you hate yourself" });
};

/* =====================================================================================
                                Get all tweets in the database 
========================================================================================*/
const getAllTweets = async(req, res, next) => {

    //find all the tweets
    let tweets;
    try{
        tweets = await Tweet.find().sort('-createdAt');
    } catch(error) {
        return console.log(error);
    }
    //check if the tweets are empty
    if(!tweets){
        return res.status(404).json({ message : "Are you a spy ? The tweet doesn't exist"});
    }
    return res.status(200).json({ tweets });
};

/* =====================================================================================
                                Add a tweet in the database 
========================================================================================*/
const addTweet = async(req, res, next) => {

    //client's information
    const { message, user } = req.body;

    //check if the user exists
    let existingUser;
    try{
        existingUser = await User.findById(user);
    } catch(error){
        return console.log(error);
    }
    if(!existingUser){
        return res.status(400).json({ message : "You gotta henk with an existing account :/"});
    }

    //add a new tweet
    const tweet = new Tweet({ message, user });
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await tweet.save({ session });
        existingUser.tweets.push(tweet);
        await existingUser.save({ session });
        await session.commitTransaction();
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
    return res.status(200).json({ tweet });
};

/* =====================================================================================
                                Modify a tweet in the database 
========================================================================================*/
const modifyTweet = async(req, res, next) => {

    //tweet's info
    const { message } = req.body;

    const tweetId = req.params.id;

    //find the tweet by its id
    let tweet;
    try{
        tweet = await Tweet.findByIdAndUpdate(tweetId, { message })
    } catch(error) {
        return console.log(error);
    }

    //check if the tweet exists
    if (!tweet){
        return res.status(500).json({ message : "You dumbass can't modify a tweet that doesn't even exist"});
    }
    return res.status(200).json({ tweet });
};

/* =====================================================================================
                        Get a tweet with its id in the database 
========================================================================================*/
const getTweetById = async(req, res, next) => {
    //tweet info
    const tweetId = req.params.id;

    //check if the tweets exists by searching its id
    let tweet;
    try{
        tweet = await Tweet.findById(tweetId);
    } catch(error) {
        return console.log(error);
    }
    if(!tweet){
        return res.status(404).json({ message : "yo this tweet doesn't exist my bruddah"})
    }
    return res.status(200).json({ tweet });
};

/* =====================================================================================
                        Delete a tweet with its id in the database 
========================================================================================*/
const deleteTweet = async(req, res, next) => {
    //tweet info
    const tweetId = req.params.id;

    //find the tweet by its id and delete it
    let tweet;
    try{
        tweet = await Tweet.findByIdAndRemove(tweetId).populate("user");
        await tweet.user.tweets.pull(tweet); //delete the actual tweet
        await tweet.user.save(); //delete the tweet from the user's profile
    } catch(error) {
        return console.log(error);
    }
    if(!tweet){
        return res.status(500).json({ message : "Cannot delete a non-existent tweet sorry man"});
    }
    return res.status(200).json({ message : "We deleted your tweet adios"});
};

/* =====================================================================================
                        Get all the tweets from a user in the database 
========================================================================================*/
const getTweetsByUserId = async(req, res, next) => {
    //user info
    const userId = req.params.id;

    //check if the user got tweets
    let userTweets;
    try{
        userTweets = await User.findById(userId).populate("tweets");
    } catch(error){
        return console.log(error);
    }
    if(!userTweets){
        return res.status(404).json({ message: "This fucker might be a stalker they ain't got any tweet wtf"})
    }
    return res.status(200).json({ tweets: userTweets.tweets })
};

/* =====================================================================================
                        Check for an existing session 
========================================================================================*/
const getSession = async(req, res, next) => {
    const session = req.session;

    if(session.userId) {
        return res.status(200).json({ userId: session.userId, message: "You are currently logged in" });
    }
    return res.status(400).json({ message: "Please login or create an account" });
}

/* =====================================================================================
                        Destroy session upon logout 
========================================================================================*/
const logoutSession = async(req, res, next) => {
    req.session.destroy();

    return res.status(200).json({ message: "Session successfully destroyed" });
}

module.exports = { 
    getAllUsers, getUser, getTopStar, getTalkTooMuch, getTopSimp, signin, login, follow, unfollow,
    getAllTweets, addTweet, modifyTweet, getTweetById, deleteTweet, getTweetsByUserId,
    getSession, logoutSession
}