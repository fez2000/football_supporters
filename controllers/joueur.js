const mongoose = require("mongoose");
const Equipe = mongoose.model("Equipe");
const Joueur = mongoose.model("Joueur");
const Doc = mongoose.model("Doc");
const { userImg } = require("../config/defaultImg");
const fs = require("fs");
const path = require("path");
const { removeSpace, timeToString } = require("../util/fonctions");
const Edition = mongoose.model("Edition");
const { get, getDynamic } = require("./socketmanage");
const io = get();
//const Voter = mongoose.model('Edition');
exports.getJoueur = (req, res) => {
    Equipe.findOne({ _id: req.params.id })
        .populate("image")
        .lean(true)
        .exec((err, joueur) => {
            if (!joueur) return res.send({ status: false, errors: "NotFound" });
            res.send({ status: true, joueur });
            
        });
};
exports.add = (req, res) => {
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
    Equipe.findOne({ _id: req.body.equipe })
        .populate("edition")
        .exec((err, re) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            if (!re) {
                return res.send({
                    status: false,
                    errors:
                        "vous essayer d'ajouter un joueur a une equipe qui n'existe pas ou plus"
                });
            }
            if (re.is_end) {
                return res.send({
                    status: false,
                    errors:
                        "vous ne pouver modifier les informations d'un joueur quand son edition est fini"
                });
            }
            Joueur.count({ equipe: re._id }, (err, nb) => {
                if (nb >= 23) {
                    return res.send({
                        status: false,
                        errors: "nombre maximal de joueur atteind"
                    });
                }
                req.body.edition = re.edition._id;
                if (req.body._id) delete req.body._id;
                req.body.image = new mongoose.Types.ObjectId();
                Joueur.create(req.body)
                    .then(joueur => {
                        const pt = `${req.session.auth._id}/${removeSpace(
                            joueur.name
                        ) + timeToString(new Date())}.${userImg.type}`;
                        fs.copyFileSync(
                            path.join(
                                __dirname,
                                "../images",
                                `${userImg.name}.${userImg.type}`
                            ),
                            path.join(__dirname, "../images", pt)
                        );
                        let date = new Date();
                        Doc.create(
                            {
                                time_create: date,
                                time_update: date,
                                name: req.body.name,
                                src: pt,
                                state: "public",
                                type: userImg.type,
                                voter: req.session.auth._id,
                                cathegorie: "image"
                            },
                            (err2, good2) => {
                                if (good2) {
                                    Joueur.updateOne(
                                        { _id: joueur._id },
                                        { image: good2._id },
                                        (err, ok) => {
                                            if (err) console.log(err);
                                            joueur.image = good2;
                                            res.send({
                                                status: true,
                                                joueur
                                            });
                                        }
                                    );
                                } else {
                                    res.send({ status: true, joueur });
                                }
                            }
                        );
                    })
                    .catch(err1 => {
                        console.log(err1);
                        res.send({ status: false, errors: err1 });
                    });
            });
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
    Edition.findOne({ is_end: false }).exec((err, edition) => {
        let id = edition ? edition._id : "";
        Joueur.updateOne(
            { _id: req.params.id, edition: id },
            req.body,
            (err, ok) => {
                if (err) return res.send({ status: false, errors: err });
                res.send({ status: true, ok });
            }
        );
    });
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
            Joueur.deleteOne(
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
    Joueur.find({ equipe: req.params.id })
        .populate("image")
        .exec((err, re) => {
            return res.send(re);
        });
};
