const mongoose = require("mongoose");
const Equipe = mongoose.model("Equipe");
const Doc = mongoose.model("Doc");
const { teamImg } = require("../config/defaultImg");
const fs = require("fs");
const path = require("path");
const { removeSpace, timeToString } = require("../util/fonctions");
const Match = mongoose.model("Match");
const { get, getDynamic } = require("./socketmanage");
const io = get();
//const Voter = mongoose.model('Edition');
exports.add = async (req, res) => {
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
    Edition.findOne({ is_end: false }).exec((err, re) => {
        if (err) {
            return res.send({ status: false, errors: err });
        }
        if (!re) {
            return res.send({ status: false, errors: "creez une competition" });
        }
        let equipe1 = Equipe.findOne({
            _id: req.body.equipe1,
            edition: re._id
        }).exec();
        let equipe2 = Equipe.findOne({
            _id: req.body.equipe2,
            edition: re._id
        }).exec();
    });
};

exports.update = (req, res) => {
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
    if (req.body._id) delete req.body._id;
    if (req.body.image)
        req.body.image = new mongoose.Types.ObjectId(req.body.image);
    Equipe.updateOne(
        { _id: req.params.id, is_end: false },
        req.body,
        (err, ok) => {
            if (err) return res.send({ status: false, errors: err });
            res.send({ status: true, ok });
        }
    );
};
exports.delete = (req, res) => {
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
    Edition.findOne({ is_end: false }).exec((err, re) => {
        if (re) {
            Equipe.deleteOne(
                { _id: req.params.id, edition: re._id },
                (err, e) => {
                    if (err) return res.send({ status: false, errors: err });
                    res.send({ status: true });
                }
            );
        } else {
            res.send({ status: false });
        }
    });
};
exports.getAll = (req, res) => {
    Edition.findOne({ is_end: false }).exec((err, re) => {
        if (re) {
            Equipe.find({ edition: re._id })
                .populate("image")
                .exec(async (err, e) => {
                    if (!e) return res.send([]);
                    let r = [];
                    function* getE() {
                        for (let i of e) {
                            yield i;
                        }
                        res.send(r);
                    }

                    for await (let eq of getE()) {
                        var j = eq.toJSON();
                        j.joueurs = await Joueur.find({
                            equipe: eq._id
                        }).populate("image");
                        r.push(j);
                    }
                });
        } else {
            res.send([]);
        }
    });
};
exports.getEquipe = (req, res) => {
    Equipe.findOne({ _id: req.params.id })
        .populate("image")
        .exec(async (err, equipe) => {
            if (!equipe) return res.send({ status: false, errors: "NotFound" });
            equipe.joueurs = await Joueur.find({ equipe: equipe._id })
                .populate("image")
                .exec();
            res.send({ status: true, equipe });
        });
};
exports.getByEdition = (req, res) => {
    Equipe.find({ edition: req.params.id })
        .populate("image")
        .exec(async (err, e) => {
            if (!e) return res.send([]);
            let r = [];
            function* getE() {
                for (let i of e) {
                    yield i;
                }
                res.send(r);
            }

            for await (let eq of getE()) {
                var j = eq.toJSON();
                j.joueurs = await Joueur.find({ equipe: eq._id }).populate(
                    "image"
                );
                r.push(j);
            }
        });
};
