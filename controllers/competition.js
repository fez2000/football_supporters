const mongoose = require("mongoose");

const Competition = mongoose.model("Competition");

exports.findAll = (req, res) => {
    Competition.find({}, (err, competition) => {
        if (err) {
            return res.send({ status: null, errors: err });
        }
        res.send({ status: true, competition: competition[0] });
    });
};
exports.put = (req, res) => {
    if (
        typeof req.session.auth === "undefined" &&
        process.env.NODE_ENV !== "test"
    ) {
        console.log("localhost:3000->auhtentification fallure");
        return res.send({ status: null, errors: { auth: "AuhtError" } });
    }
    if (req.session.auth.type == "VOTER") {
        return res.send({ status: null, errors: { auth: "PermissionDeniet" } });
    }
    Competition.updateOne(
        { _id: req.params.id },
        req.body,
        (err, competition) => {
            if (err) {
                return res.send({ status: null, errors: err });
            }
            res.send({ status: true, competition: competition[0] });
        }
    );
};
