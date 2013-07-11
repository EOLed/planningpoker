/*---------------------
	:: Room 
	-> controller
---------------------*/
var RoomController = {
  find: function (req, res) {
    var slug = req.param('id');
    console.log('finding for slug: ' + slug);
    Room.find({ slug: slug }).done(function (err, room) {
      if (err)
        return res.send(err, 500);

      res.send(room, 200);
    });
  }
};
module.exports = RoomController;
