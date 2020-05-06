const PictureModel = require('../models/picture.model');
const path = require('path')

exports.uploadPicture = function(req, res){
    var files = req.files;
    var event_id = req.body.event_id;
    var user_id = req.user;

    files.map(function(pic){
        PictureModel.create({
            filename: pic.filename,
            event_id: event_id,
            user_id: user_id
        });
    });
    return res.send('Images uploaded successfully!')
};

exports.displaypicture = function(req, res){
  var filename = req.params.filename;
  var path1 = __dirname;
  var split = path1.split('\controllers');

  path1 = path.join(split[0], "uploads", filename );

  console.log(path1);

  return res.sendFile(path1)
}; 

exports.picturebyEvent = async function(req, res){

    var event_id = req.params.event_id;
    var path1 = __dirname;
    var picArr = [];
    var split = path1.split('\controllers');

    var picuredata = await PictureModel.find({event_id: event_id}, function(err, data){
        if(err){
            return res.send(err);
        } else {
            data.map(function(d){
                path1 = path.join(split[0], "uploads", d.filename );
                picArr.push(path1);
            })
            console.log(picArr);
        }
    })  
    return res.send(picArr)
};