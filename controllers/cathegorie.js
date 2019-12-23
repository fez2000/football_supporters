const mongoose = require('mongoose');


const Cathegorie = mongoose.model('Cathegorie');

exports.findAll = (req, res) => {
    Cathegorie.find({}, (err, ok) => {
        if (err) {
            return res.send({ status: null, errors: err });
        }
        res.send({ status: true, cathegories: ok });
    });
};
