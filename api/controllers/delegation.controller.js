const {check, validationResult} = require('express-validator');
let Delegation = require('../models/delegation.model.js');
var User = require('../models/user.model');
var Event = require('../models/event.model');
const config = require('config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getDelegations = function (req, res) {
    Delegation.find({event_id: req.params.id})
        .then(task => res.json(task))
        .catch(err => req.status(400).json('Error: ', err));
};

exports.addDelegation = function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const user_id = req.body.user_id;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const event_id = req.body.event_id;
        const task = req.body.task;

        const newDelegation = new Delegation({
            user_id,
            first_name,
            last_name,
            event_id,
            task
        });

        var userExists = User.findById(user_id);
        var eventExists = Event.findById(event_id);

        if (userExists && eventExists) {
            newDelegation.save()
                .then(() => res.json('Delegation added.!'))
                .catch(err => res.status(400).json('Error: ' + err));
        } else {
            return res.status(500).send('Error: User or Event does not exists.');
        }
    } catch (e) {
        console.log('Error: ', e);
        return res.status(500).json('Error: ' + e);
    }
};

exports.deletedelegation = function (req, res) {
    Delegation.findByIdAndDelete(req.params.id)
        .then(() => res.json('Delegation deleted!'))
        .catch(err => res.status(400).json('Error: ' + err));
};

exports.notifyUser = async function (req, res) {
    try {
        const user_id = req.body.user_id;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const event_id = req.body.event_id;
        const task = req.body.task;

        const userdata = await User.findOne({_id: user_id});
        const eventdata = await Event.findOne({_id: event_id});

        sendMail(userdata.email, first_name, last_name, task, eventdata.name, eventdata.admin, eventdata.address, eventdata.start_date, eventdata.end_date, eventdata.description);

        return res.status(200).json('Invitation sent!');
    } catch (e) {
        console.log('Error: ', e);
        return res.status(500).json('Error: ', e);
    }
};

function sendMail(email, first_name, last_name, task, event_name, admin, address, start_date, end_date, description) {
    const msg = {
        to: email,
        from: process.env.myEmail,
        subject: 'Task Delegated',
        html: `<!DOCTYPE html><html><head> <title>Email Page</title> <style type='text/css'></style></head><body><div align=justify> <p>Hi ${first_name}${last_name},</p><p>A task has been delegated to you for <b>${event_name}</b> event.</p><br><p>DESCRIPTION OF TASK:</p><ul> <li>${task}</li></ul> <br><p>EVENT DETAILS:</p><ul> Address: <li>${address}</li><br>Start Date: <li>${start_date}</li><br>End Date: <li>${end_date}</li><br>Details: <li>${description}</li></ul> <p><br>Regards,<br><b style=color: #173F5F;>The Optimizers Team</b><br>Humber Institute of Technology & Advanced Learning<br>205 Humber College Blvd<br>Etobicoke, ON M9W 5L7<br>Phone: 416-675-5000<br>Email:<a href=mailto:enquiry@humber.ca>enquiry@humber.ca</a><br><a href=https://www.humber.ca>www.humber.ca</a> </p></div></body></html>`,
    };

    (async () => {
        try {
            await sgMail.send(msg);
        } catch (err) {
            console.error(err.toString());
        }
    })();
}
