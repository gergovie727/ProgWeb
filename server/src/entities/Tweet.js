const mongoose = require('mongoose');

/* Schema to define the shape of a doc */
const Schema = mongoose.Schema;

/* Schema to specify the data type and restrictions of the tweet */
const tweetSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User", //Store the collection as the user to refer to User so each user can have multiple tweets but a tweet belongs to only one user
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Tweet", tweetSchema);