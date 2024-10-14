const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const userModel = require("./schema");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://kadurienzo:ballsdeep%402025@mern.zylr0.mongodb.net/?retryWrites=true&w=majority&appName=MERN")
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.log('Error connecting to MongoDB:', error));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Port 3000 is awake and running");
});

app.post("/auth", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Await the hash function
        const addUser = new userModel({ name, email, password: hashedPassword });
        await addUser.save();
        res.status(200).send("New user saved and added to the database");
    } catch (error) {
        res.status(500).send("Unable to send user credentials");
        console.log("Error:", error);
    }
});

app.post("/login",async(req,res)=>{
  const {email,password} = req.body;
  try {
    const userRecord = await userModel.findOne({email:email});

      if (!userRecord) {
        return res.status(404).json("User record doesn't exist");
      }

   const isPasswordValid = await bcrypt.compare(password,userRecord.password);

   if (isPasswordValid) {
    return res.status(200).json("Log in Successful");
   }else{
    return res.status(401).json("Wrong password");
   }

  } catch (error) {
    return res.status(500).json({message:"Authentication error has occured ",error});
  }
});
