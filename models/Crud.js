const mongoose = require('mongoose');

const CrudScheme = new mongoose.Schema({

    name: {
        type: String
    },
    rol:  {
        type: String
    },
    maestria: {
        type:  Number,
    }
    
},
{
    versionKey: false,
    timestamps: true
}
);

module.exports = mongoose.model('crud', CrudScheme);