const mongoose = require('mongoose');

/* Schema to define the shape of a doc */
const Schema = mongoose.Schema;

/* Schema to specify the data type, name and restrictions of a user */
const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true //the username must be unique
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    following: {
        type: Array,
        default: []
    },
    followers:{
        type: Array,
        default: []
    },
    password: {
        type: String,
        required: true,
//        mninlength: 5 //the size of the password must be > 5 caracters
    },
    tweets:[{
        type: mongoose.Types.ObjectId, ref: "Tweet", required: true 
   }] //it's an array bc it can have multiple tweets

});

/* export the Schema of User to the database */
module.exports = mongoose.model("User", userSchema);