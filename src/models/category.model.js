import { Schema, Model } from "mongoose";



const categorySchema = new Schema({

    name:{
        type: String,
        minLenght: 2,
        maxLenght: 30,

    },
    description:{
        type: String,
        maxLenght: 200,
        required: false
    },
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



categorySchema.virtual('Events', {
    ref: "Event",
    localField: "_id",
    foreignField: "category"
 });


 export const Category = Model('Category', categorySchema)








