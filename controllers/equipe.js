const mongoose = require("mongoose");
const Equipe = mongoose.model("Equipe");
const Doc = mongoose.model("Doc");
const { teamImg } = require("../config/defaultImg");
const fs = require("fs");
const path = require("path");
const { removeSpace, timeToString } = require("../util/fonctions");
const Edition = mongoose.model("Edition");
const Joueur = mongoose.model("Joueur");
const { get, getDynamic } = require("./socketmanage");
const io = get();
//const Voter = mongoose.model('Edition');
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
    Edition.findOne({ is_end: false }).exec((err, re) => {
        if (err) {
            return res.send({ status: false, errors: err });
        }
        if (!re) {
            return res.send({ status: false, errors: "creez une competition" });
        }
        Equipe.count({ edition: re._id }, (err, nb) => {
            if (nb >= re.nombre_participant) {
                return res.send({
                    status: false,
                    errors: "nombre maximal d'equipe atteind"
                });
            }
            req.body.edition = re._id;
            if (req.body._id) delete req.body._id;
            req.body.image = new mongoose.Types.ObjectId();
            Equipe.create(req.body)
                .then(equipe => {
                    const pt = `${req.session.auth._id}/${removeSpace(
                        equipe.name
                    ) + timeToString(new Date())}.${teamImg.type}`;
                    fs.copyFileSync(
                        path.join(
                            __dirname,
                            "../images",
                            `${teamImg.name}.${teamImg.type}`
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
                            type: teamImg.type,
                            voter: req.session.auth._id,
                            cathegorie: "image"
                        },
                        (err2, good2) => {
                            if (good2) {
                                Equipe.updateOne(
                                    { _id: equipe._id },
                                    { image: good2._id },
                                    (err, ok) => {
                                        if (err) console.log(err);
                                        equipe.image = good2;
                                        res.send({
                                            status: true,
                                            equipe: equipe
                                        });
                                    }
                                );
                            } else {
                                res.send({ status: true, equipe });
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
                    // try {
                    //  for await (let eq of getE()) {
                    ///     var j = eq.toJSON();
                    //  j.joueurs = await Joueur.find({
                    //       equipe: eq._id
                    //  }).populate("image");
                    //  r.push(j);
                    //}

                    res.send(r);
                });
        } else {
            res.send([]);
        }
    });
};
exports.getEquipe = (req, res) => {
    Equipe.findOne({ _id: req.params.id })
        .populate("image")
        .lean(true)
        .exec((err, equipe) => {
            if (!equipe) return res.send({ status: false, errors: "NotFound" });
            Joueur.find({ equipe: req.params.id })
                .populate("image")
                .lean(true)
                .exec((err, jo) => {
                    let x = equipe;
                    x.joueurs = jo;
                    console.log(x);
                    res.send({ status: true, equipe: x });
                });
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
