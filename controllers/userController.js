const User = require("../models/userModel");
const Exercise = require("../models/exerciseModel");

const userController = {
    index: async (req, res) => {
        try {
            let users = await User.find();
            users = users.map((user) => ({
                username: user.username,
                _id: user._id,
            }));
            res.send(users);
        } catch (e) {
            res.status(500).json({ error: "Failed to retrieve data" });
        }
    },
    createUser: (req, res) => {
        let username = req.body.username;
        if (!username || username.trim() === "") {
            res.status(400).json({ error: "username is required" });
        }
        let new_user = new User({ username });
        new_user
            .save()
            .then((saved_user) => {
                console.log(`${saved_user.username} is successfully saved!`);
                res.send(saved_user);
            })
            .catch((e) => {
                res.status(500).json({ error: e });
            });
    },

    addExercise: async (req, res) => {
        let { description, duration } = req.body;

        if (!description || !duration) {
            return res
                .status(400)
                .json({ error: "Description and duration are required" });
        }
        // if date is not provided, we use the current date
        let new_date = new Date();
        // if date is provided, we use the input date
        if (req.body.date) {
            new_date = new Date(req.body.date);
        }

        try {
            let user = await User.findById(req.params._id);
            if (!user) return res.status(404).json({ error: "User not found" });
            const { username, _id } = user;

            let new_exercise = new Exercise({
                description,
                duration,
                date: new_date.toDateString(),
                userId: _id,
            });

            await new_exercise.save();

            res.json({
                username,
                description: new_exercise.description,
                duration: new_exercise.duration,
                date: new_exercise.date,
                _id: new_exercise.userId,
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: e.message });
        }
    },
    getLogs: async (req, res) => {
        let id = req.params._id;
        let user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        let { from, to, limit } = req.query;

        try {
            let exercises = await Exercise.find({ userId: id });

            if (from) {
                exercises = exercises.filter(
                    (exercise) => new Date(exercise.date) >= new Date(from)
                );
            }
            if (to) {
                exercises = exercises.filter(
                    (exercise) => new Date(exercise.date) <= new Date(to)
                );
            }
            exercises = exercises.map((exercise) => {
                return {
                    description: exercise.description,
                    duration: exercise.duration,
                    date: new Date(exercise.date).toDateString(),
                };
            });
            // slicing the array according to the limit if it exists
            if (limit) {
                // converting limit to integer from string
                exercises = exercises.slice(0, parseInt(limit));
            }

            res.send({
                username: user.username,
                count: exercises.length,
                _id: id,
                log: exercises,
            });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },
};

module.exports = userController;
