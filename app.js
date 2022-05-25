const express = require('express');
const https = require('https');
const request = require("request");
const bodyParser = require("body-parser");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); /* allows server to reach static files stored locally  */

app.get("/", function(req, res){

    res.sendFile(__dirname + "/signup.html");
  
    
});

app.post("/", function(req, res){

    
    const firstName = req.body.firstName; 
    const lastName = req.body.lastName;
    const email = req.body.email;
    console.log(firstName, lastName, email);
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }; 

    const jsonData = JSON.stringify(data);
    // JSON.stringify converts data to string

    const url = "https://us17.api.mailchimp.com/3.0/lists/a13a1eb608";

    const options = {
        // method is the most important option to specify
        method: "POST",
        auth: "victorA:f3021bd455e2b48c0df0aeb1572bfcf4-us17"
        // for the post req to be successful, we need to add Auth
    }

    const request = https.request(url, options, function(response){
        
        if(response.statusCode === 200) {
            // res.send("<h1>Hello, your request was successful</h1>"); 
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
            
        }
        
        response.on("data", function(data){
           console.log(JSON.parse(data)); 
        })
        
    }); 

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
})

// heroku might not use app.listen(3000), 
app.listen(process.env.PORT || 3000 , function(){

    console.log("Server is running on port 3000");
})

// API Key
// f3021bd455e2b48c0df0aeb1572bfcf4-us17

// List ID
// a13a1eb608