/* eslint-disable no-restricted-syntax */
const { getList, getDynamic, get } = require('../controllers/socketmanage');
const { mailApi } = require('./mail');

const ioDynamic = getDynamic();
const mongoose = require('mongoose');

const io = get();
const Voter = mongoose.model('Voter');
const Notification = mongoose.model('Notification');
const Like = mongoose.model('Like');
exports.sendMailOrNotification = (mail, notif, to, extra = null) => {
    if (to.single) {
        const userList = getList();
        Notification.create(notif).then(() => {});
        if (userList[to._id]) {
            if (userList[to._id].sessionCount > 0) {
                
                return io.of(`/voter/${to._id}`).emit('notification', notif);
            }
        }
        return mailApi(to.email, mail)
            .then((re) => {

            })
            .catch((err) => {
                console.log(err);
            });
    }
    if (to.followers) {
        Like.findOne({ target_id: to.ignore})
        .populate('voters')
            .exec((err, likes) => {
                if (err) {
                    return console.log(err);
                }
                if(!likes) return;
                const userList = getList();
                for (const i of likes.voters) {
                    let next = false;
                    if (to.ignore) {
                        for (const not of to.ignore) {
                            if (not == `${i._id}`) next = true;
                        }
                    } 
                    if(next)continue;
                    notif.target = i._id;
                    if (userList[i._id]) {
                        if (userList[i._id].sessionCount > 0) {
                            Notification.create(notif)
                                .then((not) => {
                                    if (extra) {
                                        let j = 0;

                                        while (j < extra.names.length) {
                                            notif[extra.names[j]] = extra.data[extra.names[j]];

                                            console.log(extra.names[j], extra.data[extra.names[j]]);
                                            j++;
                                        }
                                    }
                                    console.log(notif, extra);
                                    io.of(`/voter/${i._id}`).emit('notification', notif);
                                });

                            continue;
                        }
                    }
                    Notification.create(notif).then(() => {});
                    if (!i.mailNotificationPermission) continue;
                    mailApi(i.email, mail)
                        .then((re) => {

                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });
    }else {
        Voter.find({})
            .populate('image')
            .exec((err, user) => {
                if (err) {
                    return console.log(err);
                }
                const userList = getList();
                
                for (const i of user) {
                    let next = false;
                    if (to.ignore) {
                        for (const not of to.ignore) {
                            if (not == `${i._id}`) next = true;
                        }
                    }
                    if(next)continue;
                    notif.target = i._id;
                    if (userList[i._id]) {
                        if (userList[i._id].sessionCount > 0) {
                            Notification.create(notif)
                                .then((not) => {
                                    if (extra) {
                                        let j = 0;

                                        while (j < extra.names.length) {
                                            notif[extra.names[j]] = extra.data[extra.names[j]];

                                            console.log(extra.names[j], extra.data[extra.names[j]]);
                                            j++;
                                        }
                                    }

                                    io.of(`/voter/${i._id}`).emit('notification', notif);
                                });

                            continue;
                        }
                    }
                    Notification.create(notif).then(() => {});
                    if (!i.mailNotificationPermission) continue;
                    mailApi(i.email, mail)
                        .then((re) => {

                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });
    }
    
};
