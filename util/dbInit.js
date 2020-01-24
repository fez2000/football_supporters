const mongoose = require("mongoose");

const Voter = mongoose.model("Voter");
const Doc = mongoose.model("Doc");
const Competition = mongoose.model("Competition");
const Edition = mongoose.model("Edition");

const path = require("path");
const fs = require("fs");

const { removeSpace, timeToString } = require("./fonctions");
const { userImg } = require("../config/defaultImg");
const Dcompetition = require("../config/competition");
const Dedition = require("../config/edition");
const SOCIALS = require("../config/socials");

const SocialLink = mongoose.model("SocialLink");

function addEdition() {
    Edition.find({}).exec(async (err, comp) => {
        if (comp.length == 0) {
            Edition.create(Dedition)
                .then(ready => {})
                .catch(err => {
                    console.log(err);
                });
        } else {
            console.log("Edition existe");
        }
    });
}
function addCompetition() {
    Competition.find({}).exec(async (err, comp) => {
        if (comp.length == 0) {
            Competition.create(Dcompetition)
                .then(ready => {})
                .catch(err => {
                    console.log(err);
                });
        } else {
            console.log("competition existe");
        }
    });
}
function addAmin() {
    const date = new Date();

    Voter.findOne({ type: "SUPERUSER" }, (err, good) => {
        if (err) {
            return new Error("errors when find user");
        }
        if (!good) {
            return SocialLink.create(SOCIALS).then(docsS => {
                const socials = [];
                for (const link of docsS) {
                    socials.push(link._id);
                }
                Voter.create(
                    {
                        time_create: date,
                        time_update: date,
                        name: "ADMIN",
                        password: "ADMIN",
                        email: process.env.EMAIL_USER,
                        code: "",
                        state: "private",
                        isVerify: true,
                        type: "SUPERUSER",
                        url: "SUPERUSER",
                        roleLevel: 1,
                        socials
                    },
                    (err2, admin) => {
                        if (err2) {
                            return console.log(err2);
                        }
                        if (!admin) return console.log("admin not create");
                        fs.mkdirSync(
                            path.join(__dirname, "../images", `${admin._id}`)
                        );

                        const pt = `${admin._id}/${removeSpace(admin.name) +
                            timeToString(date)}.${userImg.type}`;
                        fs.copyFileSync(
                            path.join(
                                __dirname,
                                "../images",
                                `${userImg.name}.${userImg.type}`
                            ),
                            path.join(__dirname, "../images", pt)
                        );
                        Doc.create(
                            {
                                time_create: date,
                                time_update: date,
                                name: "Admin img",
                                src: pt,
                                state: "private",
                                voter: admin._id,
                                type: userImg.type,
                                cathegorie: "image",
                                image: new mongoose.Types.ObjectId()
                            },
                            (err2, good2) => {
                                if (good2) {
                                    Voter.updateOne(
                                        { _id: admin._id },
                                        { image: good2._id },
                                        (err, rep) => {
                                            console.log(err, rep);
                                        }
                                    );
                                }
                            }
                        );

                        console.log("super admin succesful create");
                    }
                );
            });
        }
    });
}

const Cathegorie = mongoose.model("Cathegorie");
const cathegories = require("../config/cathegorie");

function addAll() {
    const date = new Date();
    for (const cath of cathegories) {
        Cathegorie.create({
            name: cath,
            time_create: date,
            time_update: date
        })
            .then(c => {
                console.log(`cathegorie ${c.name} create with success`);
            })
            .catch(err2 => new Error(`errors ${JSON.stringify(err2)}`));
    }
}
function addCathegorie() {
    Cathegorie.find({}).exec((err, result) => {
        if (err) {
            return new Error(JSON.stringify(err));
        }
        if (!result) {
            if (cathegories.length !== 0) {
                addAll();
            }
        } else if (cathegories.length !== result.length) {
            Cathegorie.deleteMany({}, err3 => {
                if (err) {
                    return new Error(JSON.stringify(err3));
                }
                addAll();
            });
        }
    });
}
exports.init = () => {
    addAmin();
    addCathegorie();
    addCompetition();
    addEdition();
};
