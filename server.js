const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/data.json', 'utf8'));

let app = express();
let http = require('http').Server(app);

app.use(express.static('client/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let PORT = process.env.PORT || 8000;

http.listen(PORT, function(){
    console.log('this server is listening on PORT: '+ PORT );
});


let currentData = db.tasks;

app.get('/get-data', function(req, res) {

    let dataPackage = {
        "tasks": currentData
    };

    console.log('a website has contacted this node server');
    res.send(dataPackage);

});

app.post('/set-data', function(req, res) {
    
    console.log("this is req body: ", req.body.task);

    currentData.push(req.body.task);
    
    fs.writeFileSync('data/data.json', JSON.stringify(db, null, 2), 'utf8', (err) => {
        console.log(err);
    });

    res.send("server got the items");

});


app.post('/remove-data', (req, res)=>{
    console.log(req.body.task);

    let task = req.body.task;

    let index = currentData.indexOf(task);


    if (index > -1) {

        currentData.splice(index, 1);

        let data ={
            "tasks": currentData
        }

        console.log("this is remove data: ", currentData);

        fs.writeFileSync('data/data.json', JSON.stringify(data, null, 2), 'utf8', (err) => {
            console.log(err);
            res.send("server removed the item");
        });
    

    }



 
});