/*global Room: false*/
'use strict';
/*---------------------
	:: Room
	-> controller
---------------------*/
var RoomController = {
  join: function (req, res) {
    var slug = req.param('slug');
    var user = req.param('user');

    if (typeof user === 'string') {
      user = JSON.parse(user);
    }

    console.log('user ' + user.id + ' joining room ' + slug);

    Room.find({ slug: slug }).done(function (err, room) {
      if (err) {
        return res.send(err, 500);
      }

      var users = room.users || [];
      users.push(user);
      room.users = users;

      Room.update({ slug: slug }, { users: users }, function (err, room) {
        if (err) {
          return res.send(err, 500);
        }

        console.log('user ' + user.id + ' has joined room ' + slug);

        return res.send(room, 200);
      });
    });
  }
};

module.exports = RoomController;
