const express = require('express');
const app = express();
const PORT = 8080; 
app.use(express.json());
app.listen(
    PORT, 
    () => console.log(`working on http://localhost:${PORT}`)
);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
var fs = require('fs'),
path = require('path');

var dirList = [];
var id = 0; 

function crawl(dir){
    var files = fs.readdirSync(dir);
    var fileList = [];
    for(var x in files){
        var next = path.join(dir,files[x]);
        if(fs.lstatSync(next).isDirectory()==true){
            crawl(next);
        }else{
            var file = fs.statSync(next);
            var fileSize = file.size/1000000 + "MB";
            var fileDate = file.birthtime; 
            var fileObj = {
                "file":next,
                "size":fileSize,
                "dateCreated":fileDate
            };
            fileList.push(fileObj);
        }
    }
        var directoryObj = {
        "id":id,
        "name":dir,
        "fileObj": fileList
    };
    dirList.push(directoryObj); 
    id++;
}
crawl(__dirname); 

app.get('/files',(req,res) => {
    res.status(200).send({
        directory: dirList
    })
});