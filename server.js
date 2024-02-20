const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const uri="mongodb://localhost:27017/newUser";
const uri = "mongodb+srv://Test:test123@pdf-cluster.obw3a.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri).then((result)=>{console.log("DB Connected")}).catch((err)=>{console.log(err)});

const UserSchema  = new mongoose.Schema({
    username:String,
    email: {
        type:String,
    },
    password:String,
    phone:Number,
    imagePath:String,
    languages:Array,
    gender:String

});

const UserProfile =  mongoose.model('UserProfile',UserSchema);
const app= express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/saveData",(req,res)=>{
    var userId = req.body.id;
    var {email,phone,imagePath,languages,gender} = req.body;
    console.log(req.body);
    UserProfile.findByIdAndUpdate({_id:userId},{email,phone,imagePath,languages,gender}).then((response)=>{
        res.status(200).json({
            message:"The Data has been Saved"
        })
    })
 
});

app.post("/register",async (req,res)=>{
    const {username,password} = req.body;
    var createdUser = await UserProfile.create({username,password});
    console.log(createdUser);
    console.log(typeof(createdUser._id));
    res.status(200).json({
        message:"Data has been saved",
        id:createdUser._id.toString(),
        user:username
    })
});

app.post('/getdata', (req,res) => {
    
    var userId = req.body.id;
    UserProfile.findOne({_id:userId}).then((response)=>{
        console.log(response);
        res.status(200).json({
            data: response
        })
    })

})


app.post("/login",async (req,res)=>{
    console.log(req.body);
    const {username,password} = req.body;
    console.log(password);
    var createdUser = await UserProfile.findOne({username:username});
    if(createdUser=={}||createdUser == null){
        res.status(400).json({
            message:"No User found with this Username."
        });
    }
    if(createdUser.password == password){
        res.status(200).json({
            message:"Data has been saved",
            id:createdUser._id,
            user:username
        })
    }else{
        res.status(401).json({
            message:"The password given is incorrect."
        });
    }
    
});


app.listen(3000,(req,res)=>{
    console.log("Server started on 3000");
})
