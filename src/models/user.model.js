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
        minlength: 3,
        maxlength: 20,
    },
    email:{
        type: String,
        unique: true,

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
    profile: profileSchema,
    deletedAt:{
        type: Date,
        default: null
    }

},{
    toJSON:{ virtuals: true},
    toObject: { virtuals: true}
});


//Aca tengo que agregar un virtual para hacer referencia a el modelo de events
userSchema.virtual('Events', {
    ref: 'Event',
    localField: "_id",
    foreignField: "organizer"

})



export const User = model('User', userSchema);