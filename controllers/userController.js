const User = require("../models/userModel");
const Exercise = require("../models/exerciseModel");

const userController = {
    index: (req, res) => {
        User.find()
            .then((users) => {
                res.send(users);
            })
            .catch((err) => {
                res.end(err);
            });
    },
    createUser: (req, res) => {
        let username = req.body.username;
        let new_user = new User({ username });
        new_user
            .save()
            .then((saved_user) => {
                console.log(`${saved_user.username} is successfully saved!`);
                res.send(saved_user);
            })
            .catch((e) => {
                res.end(e);
            });
    },

    addExercise: async (req, res) => {
        let { description, duration } = req.body;
        let date = req.body.date || new Date().toDateString();

        try {
            let user = await User.findById(req.params._id);

            let new_exercise = new Exercise({
                username: user.username,
                description,
                duration,
                date,
                userId: user._id,
            });
            new_exercise
                .save()
                .then((saved_user) => {
                    res.send(saved_user);
                })
                .catch((err) => {
                    res.send(err);
                });
        } catch (e) {
            res.end(e);
        }
    },
    getLogs: async (req, res) => {
        let id = req.params._id;
        let user = await User.findById(id);
        const options = req.query;

        let from = options.from || null;
        let to = options.to || null;
        const limit = options.limit || null;

        from = new Date(from);
        to = new Date(to);

        Exercise.find({ userId: id })
            .then((exercises) => {
                // we only description, duration, and date properties
                exercises = exercises
                    .map((exercise) => {
                        return {
                            description: exercise.description,
                            duration: exercise.duration,
                            date: exercise.date,
                        };
                    })
                    .filter((exercise) => {
                        // filtering according to 'from' and 'to'
                        date = new Date(exercise.date);
                        date >= from && date <= to;
                    });
                // slicing the array according to the limit if it exists
                if (limit) {
                    exercises = exercises.slice(0, limit);
                }
                console.log(exercises);
                console.log({
                    username: user.username,
                    count: exercises.length,
                    _id: id,
                    log: exercises,
                });

                res.send({
                    username: user.username,
                    count: exercises.length,
                    _id: id,
                    log: exercises,
                });
            })
            .catch((e) => {
                console.log("err occred");
                res.send(e);
            });
    },
};

module.exports = userController;
