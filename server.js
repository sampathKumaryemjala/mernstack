const express = require("express");
const app = express();
const connectDB = require("./config/db")

connectDB()

app.get('/', (req, res) => {
    res.send("API is Working")
})

const PORT = process.env.PORT || 5000;

const date = new Date().toLocaleString()

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} , date : ${date}`);

})