import mongoose from "mongoose";


const { Schema } = mongoose;


const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    contacts: [
        {
          type: Schema.Types.ObjectId, 
          ref: 'User',  // Reference to other users
        },
    ],
    profilePhoto: {
        type: String,  
        default: '/uploads/default.jpg',  // Set a default image path
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: String 
}, {
    timestamps: true,  
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
