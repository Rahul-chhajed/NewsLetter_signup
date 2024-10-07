const express = require('express');
const https = require('https');
const bodyparser = require('body-parser');
const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.mail;

    console.log("Received email:", email);  // Log the email to verify

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    var jsondata = JSON.stringify(data);
    const url = "https://us9.api.mailchimp.com/3.0/lists/7788eea234";
    
    const options = {
        method: "POST",
    
        headers: {
            Authorization:"auth b3ea95824636c6b633c409636a6f7ed2-us9"
        }
    };

    const request = https.request(url, options, function(response) {
      
        if(response.statusCode===200){
                res.sendFile(__dirname+"/success.html");
        }
        else{
               res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });

      
    });

    request.write(jsondata);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT||3000, function () {
    console.log("Server is running on port 3000");
});

