const { default: mongoose } = require("mongoose")

const dbConnect = () =>{
    try{
        const conn = mongoose.connect("mongodb://0.0.0.0:27017/mydb");
        console.log('Database Connected Successfully');


    }catch (error){
        console.log('Database error');
    }

};

module.exports=dbConnect;