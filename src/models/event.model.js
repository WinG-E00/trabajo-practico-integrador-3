import { Schema, model } from "mongoose";



const locationSchema = new Schema({
    venue: {
        type: String,
        minLenght: 3,
        maxLenght: 100
    },
    address:{
        type: String,
        minLenght: 5,
        maxLenght: 150,
    },
    city: {
        type: String,
        minLenght: 2,
        maxLenght: 50
    }
},{
    _id: false
});



const eventSchema = new Schema({

    title: {
        type: String,
        minLenght: 3,
        maxLenght: 150
    },
    description: {
        type: String,
        minLenght:20
    },
    startDate:{
        type: Date,
        required: true,
    },
    endDate:{
        type: Date,
        required: true,
    },
    capacity: {
        type: Number,
        min: 1
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    status: {
        type: String,
        enum: ['scheduled', 'cancelled', 'finished'],
        default: 'scheduled'
    },
    location: locationSchema,
    organizer:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }],

})




export const Event = model('Event', eventSchema);