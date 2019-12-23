const mongoose = require('mongoose');
const fs = require('fs');

const Voter = mongoose.model('Voter');
const Notification = mongoose.model('Notification');
const path = require('path');
const Like = mongoose.model('Like');
const usersList = {};
let nbOnline = 0;
function getCookie(cname, cookie) {

    const decodedCookie = cookie || '';
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(encodeURIComponent(cname)+'=' ) == 0) {
            return decodeURIComponent(c.substring((encodeURIComponent(cname)+'=').length, c.length));
        }
    }
    return '';
}

const io = (process.env.CONTEXT == 'secure')?require('socket.io')({
    ca: fs.readFileSync(path.join(__dirname, '../key/server.cert')),
}):require('socket.io')();
const { whitelist } = require('../config/cors');

io.origins(whitelist);


io.on('connect', (socket) => {
    socket.on('disconnecting', (reason) => {
        const rooms = Object.keys(socket.rooms);
        console.log(reason);
    });
    console.log('any user');
});
const dynamicNsp = io.of(/^\/voter\/.*/).on('connect', (socket) => {
    const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'

    // broadcast to all clients in the given sub-namespace
    let id = newNamespace.name;
    id = id.replace('/voter/', '');
    if (!usersList[id]) {
        usersList[id] = {};
        usersList[id].sessionCount = 0;
        nbOnline += 1;
        dynamicNsp.emit('newVoterOnline', nbOnline);
    } else if (usersList[id].sessionCount == 0) {
        nbOnline += 1;
        dynamicNsp.emit('newVoterOnline', nbOnline);
    }

    usersList[id].sessionCount += 1;
    socket.on('profilUpdate', ()=>{
        io.of(`/voter/${id}`).emit('updateProfil');
    });
    socket.on('getUnReadNotifCount', () => {
        Notification.find({ target: id })
            .where('read', false)
            .count((err, nb) => {
                if (err) {
                    return socket.emit('serverGetError', err);
                }
                socket.emit('unReadNotifCount', nb);
            });
    });
    socket.on('getLikeOf',(context)=>{
        Like.findOne({ target_id: context.id }).populate('voters').exec((err, like)=>{
            if(like){
                return socket.emit('likeOf', {
                    _id: context.id,
                    nb: like.voters.length,
                    context 
                })
            }
            socket.emit('likeOf', {
                _id: context.id,
                nb: 0,
                context 
            })
        })
    })
    socket.on('checkLikeStatus',(context)=>{
        Like.findOne({ target_id: context.id }).populate('voters').exec((err, like)=>{
            
            if(like){
                for(let v of like.voters){
                    if(`${v._id}` == context.myId){
                       return socket.emit('likeStatus', {
                            _id: context.id,
                            status: true,
                            context 
                        })
                    }
                }
                
            }
            socket.emit('likeStatus', {
                    _id: context.id,
                    status: false,
                    context 
                })
        })
    })
    socket.on('getNotifs', () => {
        Notification.find({ target: id })
            .populate({
                path: 'project',
                populate: { path: 'voter image', select: 'src name url description short_descrition email' },
            })
            .populate({
                path: 'voter',
                select: 'name url description short_descrition email',
                populate: { path: 'image' },
            })
            .populate({
                path: 'event',
                populate: { path: 'document' },
            })
            .populate({
                path: 'like',
            })
            .sort({ time_create: -1 })
            .limit(20)
            .lean(true)
            .exec((err, doc) => {
                if (err) {
                    return socket.emit('serverGetError', err);
                }
                socket.emit('notifs', doc);
            });
    });
    socket.on('setReadNotif', (id2) => {
        Notification.updateOne({ _id: id2, target: id }, { read: true }, (err, ok) => {
            if (err) {
                return socket.emit('serverGetError', err);
            }
            Notification.find({ target: id })
                .where('read', false)
                .count((err, nb) => {
                    if (err) {
                        return socket.emit('serverGetError', err);
                    }
                    Notification.find({ target: id })
                        .populate({
                            path: 'project',
                            populate: { path: 'voter image', select: 'src name url description short_descrition email' },
                        })
                        .populate({
                            path: 'voter',
                            select: 'name url description short_descrition email',
                            populate: { path: 'image' },
                        })
                        .populate({
                            path: 'event',
                            populate: { path: 'document' },
                        })
                        .populate({
                            path: 'like',
                        })
                        .sort({ time_create: -1 })
                        .limit(20)
                        .lean(true)
                        .exec((err, doc) => {
                            if (err) {
                                return socket.emit('serverGetError', err);
                            }
                            socket.emit();
                            io.of('/voter/'+id).emit('unReadNotifCount', nb);
                            io.of('/voter/'+id).emit('notifs', doc);
                        });
                });
        });
    });
    socket.on('getVoterOnline', () => {
        socket.emit('newVoterOnline', nbOnline);
    });
    socket.on('disconnecting', (socket1) => {
        if (usersList[id].sessionCount >= 1) {
            usersList[id].sessionCount -= 1;
            if (usersList[id].sessionCount == 0) {
                if (nbOnline >= 1) nbOnline -= 1;
                dynamicNsp.emit('newVoterOnline', nbOnline);
            }
        }
    });
    socket.emit('newVoterOnline');
    socket.on('connection', (socket1) => {


    });


    console.log('voter connected on him dashboard ');
});
// broadcast to all clients in each sub-namespace


dynamicNsp.use((socket, next) => {
   
    if (socket.request.headers.cookie) {
        console.log(getCookie('voter', socket.request.headers.cookie))
        if (getCookie('XSRF-TOKEN', socket.request.headers.cookie) != socket.handshake.query.Token) {
            return next(new Error('Authentication error invalid token'));
        }
        if (getCookie('login') == 'false') {
            return next(new Error('Authentication error invalid token'));
        }
        const voter = getCookie('voter', socket.request.headers.cookie);
        if (!voter) {
            return next(new Error('Authentication error'));
        }
        let voterData = getCookie(voter, socket.request.headers.cookie);
        
        if (!voterData) {
            return next(new Error('Authentication error'));
        }
        voterData = JSON.parse(voterData);
        Voter.findOne({ code: voterData.code, email: voter }, (err, ok) => {
            if (err || !ok) {
                return next(new Error('Authentication error'));
            }
            return next();
        });
    }
    next(new Error('Authentication error'));
});

io.use((socket, next) => {
    if (socket.request.headers.cookie) {
        console.log(getCookie('XSRF-TOKEN', socket.request.headers.cookie) != socket.handshake.query.Token);
        if (getCookie('XSRF-TOKEN', socket.request.headers.cookie) != socket.handshake.query.Token) {
            return next(new Error('Authentication error invalid token'));
        }
        return next();
    }
    next(new Error('Authentication error'));
});
exports.manage = (soc) => {
    io.on('disconnect', (socket) => {
        console.log('is go');
    });
};

exports.get = () => io;
exports.getDynamic = () => dynamicNsp;
exports.attach = (server) => {
    io.attach(server);
};
exports.getList = () => usersList;

exports.middleware = (callback) => {
    io.use(callback);
    dynamicNsp.use(callback);
};
