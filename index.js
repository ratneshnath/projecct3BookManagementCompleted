const express = require ('express');
const app = express();
const route = require('./route/route.js');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');

app.use (bodyParser.json());
app.use (bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb+srv://ratneshnath:RATNESh99@cluster0.x9keh.mongodb.net/Project_3_bookManagementDB?retryWrites=true&w=majority',{useNewUrlParser : true,useUnifiedTopology: true})
.then(() => console.log("mongoDB is running on port 3000"))
.catch(err=> console.log(err))
app.use('/',route);
app.listen(process.env.PORT || 3000, function(){
    console.log('express app running on port'+(process.env.PORT || 3000))
});



