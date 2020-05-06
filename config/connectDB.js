const mongoose = require('mongoose');
const config = require('config');
mongoose.set('useCreateIndex', true);
const dbconn = config.get('mongoDBConnectURI');

const connectDB = async () => {
    try {
        await mongoose.connect(dbconn, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
        console.log('database connected');
    } catch (err) {
        console.log('unable to connect');
        process.exit();
    }
};

module.exports = connectDB;
