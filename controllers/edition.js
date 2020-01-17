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
    Edi
}