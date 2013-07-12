/*jslint node: true*/
/*global Room: true, console: false, module: false*/
'use strict';

var RoomController = {
  join: function (req, res) {
    var slug = req.param('slug'),
        user = req.param('user');

    if (typeof user === 'string') {
      user = JSON.parse(user);
    }

    console.log('user ' + user.id + ' joining room ' + slug);

    var addOrReplaceUser = function (users, user) {
      for (var i = 0; i < users.length; i++) {
        // match users by id
        if (users[i].id === user.id) {
          users.splice(i, 1);
          break;
        }
      }

      users.push(user);
      return users;
    };

    var onRoomFound = function (err, room) {
      if (err) {
        return res.send(err, 500);
      }

      room.users = addOrReplaceUser(room.users || [], user);

      Room.update({ slug: slug }, { users: room.users }, function (err, room) {
        if (err) {
          return res.send(err, 500);
        }

        console.log('user ' + user.id + ' has joined room ' + slug);

        return res.send(room, 200);
      });
    };

    Room.find({ slug: slug }).done(onRoomFound);
  }
};

module.exports = RoomController;
