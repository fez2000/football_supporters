const mongoose = require("mongoose");
const Edition = mongoose.model('Edition');
const { get, getDynamic } = require('./socketmanage');
const io = get();
//const Voter = mongoose.model('Edition');
exports.add = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if (req.session.auth.type == 'VOTER') {
        return res.send({ status: null, errors: { auth: 'PermissionDeniet' } });
    }
    Edition.findOne({ is_end: false })
        .exec((err, re) => {
            if (re) {
                return res.send({ status: false, errors: 'competition en cour'});
            }
            Edition.create(req.body).then((edition) => {
                res.send({ status: true, edition });
            }).catch((err) => {
                res.send({ status: false, errors: err });
            });
    });
    
}
exports.getCurrent = (req, res) => {
    Edition.findOne({ is_end: false }, (err, e) => {
        res.send(e);
    });
};
exports.update = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if (req.session.auth.type == 'VOTER') {
        return res.send({ status: null, errors: { auth: 'PermissionDeniet' } });
    }
    Edition.updateOne({ _id: req.params.id }, req.body, (err, ok) => {
        if (err) return res.send({ status: false, errors: err });
        res.send({ status: true });
    });
}
exports.de
exports.getAll = (req, res) => {
    Edition.find({}, (err, e) => {
        res.send(e);
    });
}; 