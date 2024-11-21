const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const { default: mongoose } = require("mongoose");

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connection Successful!");
        const listener = app.listen(process.env.PORT || 3000, () => {
            console.log(
                "Your app is listening on port " + listener.address().port
            );
        });
    })
    .catch((e) => {
        console.log(e);
    });

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

//
app.use("/api/users", userRoutes);
