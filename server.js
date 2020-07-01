const express = require("express");
const app = express();
const connectDB = require("./config/db")

connectDB()

app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
    res.send("API is Working")
})

app.use("/api/users", require('./routes/api/users'));
app.use("/api/auth", require('./routes/api/auth'));
app.use("/api/profile", require('./routes/api/profile'));
app.use("/api/posts", require('./routes/api/posts'));



const PORT = process.env.PORT || 5000;

const date = new Date().toLocaleString()

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} , date : ${date}`);

})