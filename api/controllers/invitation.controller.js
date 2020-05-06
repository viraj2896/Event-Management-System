const {check, validationResult} = require('express-validator');
const config = require('config');
const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(config.get('SENDGRID_API_KEY'));
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.invite = function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const event_id = req.body.event_id;
        const users = req.body.users;
        const event_name = req.body.event_name;
        const address = req.body.address;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const admin = req.body.admin;
        const description = req.body.description;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;

        users.forEach(function (user) {
            sendMail(user.email, event_id, event_name, address, start_date, end_date, admin, description, first_name, last_name);
        });

        return res.status(200).json('Invitation sent!');
    } catch (e) {
        console.log('Error: ', e);
        return res.status(500).json('Error: ', e);
    }
};

function sendMail(email, event_id, event_name, address, start_date, end_date, admin, description, first_name, last_name) {
    const msg = {
        to: email,
        from: process.env.myEmail,
        // from: config.get('myEmail'),
        subject: 'Event invitation',
        html: `<!DOCTYPE html><html><head> <title>Email Page</title> <style type='text/css'></style></head><body><div align=justify> <p>Hi ${first_name}${last_name},</p><p>You have been invited to <b>${event_name}</b> event. <p>Please note, this email is not a confirmation, you have to rsvp on https://falcons-event-management.herokuapp.com/event/${event_id}.</p><p>EVENT DETAILS:</p><ul> Organized By: <li>${admin}</li><br>Address: <li>${address}</li><br>Start Date: <li>${start_date}</li><br>End Date: <li>${end_date}</li><br>Details: <li>${description}</li><br></ul> <br><p>Please let us know if there are any changes.<br><br>Regards,<br><b style=color: #173F5F;>The Optimizers Team</b><br>Humber Institute of Technology & Advanced Learning<br>205 Humber College Blvd<br>Etobicoke, ON M9W 5L7<br>Phone: 416-675-5000<br>Email:<a href=mailto:enquiry@humber.ca>enquiry@humber.ca</a><br><a href=https://www.humber.ca>www.humber.ca</a></p></div></body></html>`,
    };

    (async () => {
        try {
            await sgMail.send(msg);
        } catch (err) {
            console.error(err.toString());
        }
    })();
}
