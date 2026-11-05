import { Schema, model } from "mongoose";



const locationSchema = new Schema({
    venue: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    address:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 150,
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    }
},{
    _id: false
});



const eventSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 150,
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
        trim: true,
    },
    startDate:{
        type: Date,
        required: true,
    },
    endDate:{
        type: Date,
        required: true,
        validate: {
            validator(value) {
                return !this.startDate || value > this.startDate;
            },
            message: "La fecha de finalización debe ser posterior a la fecha de inicio",
        },
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
        validate: Number.isInteger,
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
    location: {
        type: locationSchema,
        required: true,
    },
    organizer:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }],

}, {
    timestamps: true,
    versionKey: false,
});




export const Event = model('Event', eventSchema);
