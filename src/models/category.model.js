import { Schema, model } from "mongoose";



const categorySchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 30,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200,
        required: false,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});



categorySchema.virtual("events", {
    ref: "Event",
    localField: "_id",
    foreignField: "categories",
});


export const Category = model("Category", categorySchema);
