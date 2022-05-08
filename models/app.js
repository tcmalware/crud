const mongoose = require('mongoose');

const UserScheme = new mongoose.Schema({

    usename: {
        type: String
    },
    password:  {
        type: String
    },
    email: {
        type: String,
        unique: true,
        require: true
    }
    
},
{
    versionKey: false,
    timestamps: true
}
);

module.exports = mongoose.model('user', UserScheme);