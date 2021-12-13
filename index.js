const express = require('express');
const app = express();
const helmet = require("helmet");
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;

//routes
app.use('/api', require('./routes/index'))
 
const start = async() => {
    try{
        await mongoose.connect('mongodb://localhost:27017/HospitalApi');
        app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
    } catch(error){
        console.log(error);
    }
}

start();