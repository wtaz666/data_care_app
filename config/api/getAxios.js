const fs = require("fs");
const path = require("path");

module.exports = function(app){
    app.get("/getElemeData",(req,res)=>{
        // const result = fs.readFileSync(path.join(__dirname,"../mock","ele.json"));
        // res.json({
        //     code: 0,
        //     data: result.toString()
        // })
    })

}