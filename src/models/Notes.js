const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
        id : {
            type: String,
            required: true,
            unique: true
        },
        note : {
            type: String,
            required: true
        },
        privacy : {
            type: Boolean,
            required: true
        },
        keynote : {
            type: String,
            required : true
        }
    }
    ,
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Notes", noteSchema);