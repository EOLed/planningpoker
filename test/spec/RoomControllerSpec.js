/*globals require: false, beforeEach: false, describe: false, it: false*/
'use strict';
var sinon = require('sinon'),
    Room = require('../../api/models/Room'),
    RoomController = require('../../api/controllers/RoomController');

describe('Controller: RoomController', function () {
  describe('join', function () {
    var done;
    beforeEach(function () {
      done = sinon.stub();
      Room.find = sinon.stub().returns({ done: done });
      Room.update = sinon.stub();
    });

    it('should persist new user if none exists', function () {
      var req = { param: sinon.stub().withArgs('slug').returns('abcdef')
                                     .withArgs('user').returns({ id: 'bcedef',
                                                                 username: 'achan' }) };
      var res = { send: sinon.stub() };

      RoomController.join(req, res, Room);
      var callback = sinon.stub();
      done( callback );
      done.yield(['error param']);
      expect(Room.update).toHaveBeenCalled();
      expect(res.send.calls[0].args[1]).toEqual(200);
    });
  });
});
