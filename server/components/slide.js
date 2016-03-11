module.exports = (app, mydata, socketIO) => {

  var _ = require('lodash');


	var slides = mydata.slides = {
	  '100': [ 
      {
      slideId: 12340,
      slideNo: 0,
      title: 'Wasabi 1',
      url: 'Slide1.JPG',
      urlThumb: 'ws1-thumb.jpg'
      },
      {
      slideId: 12341,
      slideNo: 1,
      title: 'Wasabi 2',
      url: 'Slide2.JPG',
      urlThumb: 'ws2-thumb.jpg'
      },
      {
      slideId: 12342,
      slideNo: 2,
      title: 'Wasabi 3',
      url: 'Slide3.JPG',
      urlThumb: 'ws3-thumb.jpg'
      },
      {
      slideId: 12343,
      slideNo: 3,
      title: 'Wasabi 4',
      url: 'Slide4.JPG',
      urlThumb: 'ws4-thumb.jpg'
      },
      {
      slideId: 12344,
      slideNo: 4,
      title: 'Wasabi 5',
      url: 'Slide5.JPG',
      urlThumb: 'ws5-thumb.jpg'
      },
      {
      slideId: 12345,
      slideNo: 6,
      title: 'Wasabi 6',
      url: 'Slide6.JPG',
      urlThumb: 'ws5-thumb.jpg'
      },
      {
      slideId: 12346,
      slideNo: 4,
      title: 'Wasabi 7',
      url: 'Slide7.JPG',
      urlThumb: 'ws5-thumb.jpg'
      },
      {
      slideId: 12347,
      slideNo: 4,
      title: 'Wasabi 8',
      url: 'Slide8.JPG',
      urlThumb: 'ws5-thumb.jpg'
      },
      {
      slideId: 12348,
      slideNo: 4,
      title: 'Wasabi 9',
      url: 'Slide9.JPG',
      urlThumb: 'ws5-thumb.jpg'
      },
      {
      slideId: 12349,
      slideNo: 4,
      title: 'Wasabi 10',
      url: 'Slide10.JPG',
      urlThumb: 'ws5-thumb.jpg'
      }
    ]
	};

	app.get('/slides/:slideDeckId', function(req, res) {
	    res.contentType('json');
	    var s = slides[req.params.slideDeckId];
	    res.json({slideDeckData: s, slideDeckLength: s.length});
	});

	socketIO
  .on('connection', function(socket) {
    socket.mydata = socket.mydata || {};

    socket.on('subSlide', function(msg) {
      socketIO.emit('subSlide', msg);

      socket.mydata.user = msg.user;
      socket.mydata.slideRoom = 'slideDeckId/'+msg.slideDeckId;
      socket.mydata.slideDeckId = msg.slideDeckId;

      socket.join(socket.mydata.slideRoom);
      if (socket.mydata.slideRoom && socket.mydata.user.role !== 'lecturer') {
        // socket.emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNo: msg.slideNo, username: socket.mydata.user.username});
      }
    });

    socket.on('unsubSlide', function(msg) {
      socketIO.emit('unsubSlide', msg);
      socket.leave(socket.mydata.slideRoom);
      socket.mydata.slideRoom = null;
      socket.mydata.slideDeckId = null;
    });
    
    socket.on('pushLocalSlide', function(msg) {
      if (socket.mydata.slideRoom && socket.mydata.user.role === 'lecturer') {
        socket.mydata.slideNo = msg.slideNo;

        socketIO.to(socket.mydata.slideRoom)
        .emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNoLecturer: msg.slideNoLocal, username: socket.mydata.user.username});
      }
    });

    socket.on('hi', function(msg) {
        socketIO.to(socket.mydata.slideRoom)
        .emit('hi', msg);
    })
  });


}