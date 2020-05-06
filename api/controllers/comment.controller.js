const Comment = require('../models/comment.model');
const Event = require('../models/event.model');
const User = require('../models/user.model');


exports.addComment  = async (request, response) => {
    try {
        let error = "";
        if(!request.user) {
            error = error + " user_id,";
        }
        if(!request.body.event_id) {
            error = error + " event_id,";
        }
        if(!request.body.user_name) {
            error = error + " user_name,";
        }
        if(!request.body.comment) {
            error = error + " comment,";
        }
        if(error !== "") {
            response.status(400).send("errors : " + error);
        }
        const newComment = new Comment({
            event_id: request.body.event_id,
            user_id: request.user,
            user_name: request.body.user_name,
            comment: request.body.comment
        });

        const newCommentFromDb = await newComment.save();
        let event = await Event.findById(request.body.event_id);
        if (event == null){
            response.status(404).send('Event not found');
        }
        // The below two lines will add the newly saved comment
        // ObjectID to the the Event's comment array field
        if(event.comments === []){
            event.comments = [newCommentFromDb._id];
        } else {
            event.comments.push(newCommentFromDb._id);
        }
        event.save();
        response.status(200).send(newCommentFromDb);
    } catch (error) {
        response.status(500).send(error);
    }
};