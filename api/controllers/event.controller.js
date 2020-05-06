const { validationResult } = require('express-validator');
const Event = require('../models/event.model');
const multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const path = require('path');
const config = require('config');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    apiKey: config.get('google_maps_api_key')
};

const geocoder = NodeGeocoder(options);

exports.fetchEvent = async (request, response) => {
    try {
        const eventFromDb = await Event.findById(request.params.event_id ).populate('user_id').populate('comments');
        if (eventFromDb == null){
            response.status(404).send('Event not found');
        }
        response.status(200).send(eventFromDb);
    } catch (error) {
        response.status(500).send(error);
    }
};

exports.fetchTop10Event = async (request, response) => {
    try {
        await Event
            .find({})
            .sort({ 'attendees_count': 'desc' })
            .limit(10)
            .exec(function(err, docs) {
                response.status(200).send(docs);
            });
    } catch (error) {
        response.status(500).send(error);
    }
};

exports.createNewEvent = async (request, response) => {
    try {
        // const errors = validationResult(request);
        // if (!errors.isEmpty()) {
        //     return response.status(422).json({ errors: errors.array() });
        // }
        var param = '';
        var error = false;
        
        if(!request.user){
            error = true;
            param = param + "user_id";
        }
        if(!request.body.name){
            error = true;
            param = param + ", name";
        }
        if(!request.body.address){
            error = true;
            param = param + ", address";
        }
        if(!request.body.start_date){
            error = true;
            param = param + ", start_date";
        }
        if(!request.body.end_date){
            error = true;
            param = param + ", end_date";
        }

        if (!request.file.filename.match(/\.(jpg|jpeg|png|gif)$/)) {
            console.log('req.file.filename', request.file.filename)
            return response.status(400).send({
                "status": "Error",
                "message": "Only image files are allowed!"
            });
        }

        if(error){
            console.log("error: " + param);
            return response.status(400).send({
                "status": "Error",
                "message": "Missing params "+param
            })
        }

        const res = await geocoder
            .geocode(request.body.address);
        const latitude = res[0].latitude;
        const longitude = res[0].longitude;

        const newEvent = new Event({
            user_id: request.user,
            name: request.body.name,
            description: request.body.description,
            event_picture: request.file.filename,
            type: request.body.type,
            address: request.body.address,
            address_latitude: latitude,
            address_longitude: longitude,
            start_date: request.body.start_date,
            end_date: request.body.end_date
        });

        const newEventFromDb = await newEvent.save();
        if (newEventFromDb == null){
            return response.status(500).send('Event cannot be saved to Database');
        }
        response.status(200).send(newEventFromDb);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
};

exports.deleteEvent = async (request, response) => {
    try {
        await Event.findByIdAndDelete(request.body.id);
        response.status(200).send('Event deleted successfully');
    } catch (error) {
        response.status(500).send(error);
    }
};

exports.updateEvent = async (request, response) => {
    try {
        let eventFromDB = await Event.findById( request.body.id);
        if(request.body.name){
            eventFromDB.name = request.body.name;
        }
        if(request.body.description){
            eventFromDB.description = request.body.description;
        }
        if(request.body.type){
            eventFromDB.type = request.body.type;
        }
        if(request.body.address){
            eventFromDB.address = request.body.address;
            const res = await geocoder
                .geocode(request.body.address);
            eventFromDB.address_latitude = res[0].latitude;
            eventFromDB.address_longitude = res[0].longitude;
        }
        if(request.body.start_date){
            eventFromDB.start_date = request.body.start_date;
        }
        if(request.body.end_date){
            eventFromDB.end_date = request.body.end_date;
        }
        await eventFromDB.save();
        response.status(200).send('Event Updated Successfully');
    } catch (error) {
        response.status(500).send(error);
    }
};

exports.getEventByname = async function(req, res){
    console.log('in event')
    var query = {};
    if(req.body.event_name){
        query.name = req.body.event_name;
    }
    if(req.body.event_desc){
        query.description = {
            $regex: '.*' + req.body.event_desc + '.*'            
        }
    }

    console.log('query'+query);

    Event.find(query, function(err, data){
        if(err){
            return res.send(err);
        } else {
            return res.send(data);
        }
    });
};