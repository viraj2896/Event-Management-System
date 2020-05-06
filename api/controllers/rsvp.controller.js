const {check, validationResult} = require('express-validator');
let Rsvp = require('../models/rsvp.model');
var User = require('../models/user.model');
var Event = require('../models/event.model');

exports.getRsvp = function (req, res) {
    Rsvp.findById(req.params.id)
        .then(rsvp => res.json(rsvp))
        .catch(err => req.status(400).json('Error: ', err));
};

exports.confirmRsvp = function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const user_id = req.body.user_id;
        const event_id = req.body.event_id;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const response = req.body.response;
        const no_of_guests = req.body.no_of_guests;

        const newRsvp = new Rsvp({
            user_id,
            event_id,
            first_name,
            last_name,
            response,
            no_of_guests
        });

        var userExists = User.findById(req.body.user_id);
        var eventExists = Event.findById(req.body.event_id);

        if (userExists && eventExists) {
            newRsvp.save()
                .then((data) => res.json({
                    message: 'RSVP Confirmed!',
                    data: data
                }))
                .catch(err => res.status(400).json('Error: ' + err));
        } else {
            return res.status(500).send('Error: User or Event does not exists.');
        }
    } catch (e) {
        console.log('Error: ', e);
        return res.status(500).send('Error: ' + e);
    }
};

exports.cancelRsvp = function (req, res) {
    Rsvp.findByIdAndDelete(req.params.id)
        .then(() => res.json('RSVP canceled!'))
        .catch(err => res.status(400).json('Error: ' + err));
};

exports.updateRsvp = async function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    var rsvpdata = await Rsvp.findOne({_id: req.params.rsvpId});

    if (rsvpdata) {
        if (req.body.response === false) {
            Rsvp.findByIdAndDelete(rsvpdata._id).then(() => res.send('RSVP updated!'));
        } else {
            rsvpdata.response = true;
            rsvpdata.no_of_guests = req.body.no_of_guests;
            rsvpdata.save(function (err, data) {
                if (err) {
                    return res.status(500).send(err);
                } else {
                    return res.send({
                        message: 'RSVP updated!',
                        data: data
                    })
                }
            });
        }
    } else {
        return res.send('Invalid rsvp id');
    }
};

exports.getRsvpByEvent = function (req, res) {
    Rsvp.find({event_id: req.params.event_id, response: true})
        .then(rsvp => res.json(rsvp))
        .catch(err => req.status(400).json('Error: ', err));
};
