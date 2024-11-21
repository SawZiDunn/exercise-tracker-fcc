const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
    username: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
