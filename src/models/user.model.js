import { Schema, model } from "mongoose";


const profileSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    birthDate:{
        type: Date,
        required: false
    },
    phone:{
        type: String, 
        required: false
    },
},{
    _id: false    
})




const userSchema =  new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,

    },
    password:{
        type: String, 
        required: true,
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profile: {
        type: profileSchema,
        required: true,
    },
    deletedAt:{
        type: Date,
        default: null
    }

},{
    timestamps: true,
    versionKey: false,
    toJSON:{ virtuals: true},
    toObject: { virtuals: true}
});


userSchema.virtual('events', {
    ref: 'Event',
    localField: "_id",
    foreignField: "organizer"

})



export const User = model('User', userSchema);
