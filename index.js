// import npm packets
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.openweathermap.org/data/3.0/onecall?lat=53.8352&lon=2.2194&appid=3a849e27b67890f2f624e909070224f1";


app.use(bodyParser.urlencoded({ extended : true}));
app.use(express.static("public"));

app.get("/", async (req,res)=>{
    try{
        const result = await axios(API_URL);
        console.log(result.data);
        res.render("index.ejs");
    } catch (error){
        res.render("index.ejs")
        // console.log(error.response.data);
}});

app.listen(port, ()=>{
    console.log(`listening on port ${3000}`)
});

// {content : JSON.stringify(error.response.data)})