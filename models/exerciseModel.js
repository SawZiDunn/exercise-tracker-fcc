const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
