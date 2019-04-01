var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!');
  //schema
  var restaurantSchema = new mongoose.Schema({
    name: String,
    address: String,
    rating: Number,
    menu: Array,
    reviews: Array,
    numberOfOrder: Number,
    thumbImg: String
  });

  //compile our schema into a model
  var restaurant = mongoose.model('restaurant', restaurantSchema);

  //model is a class which we construct documents
  //each documents will be a kitten with properties and behaviors as declared in our schema
  var r1 = new restaurant({
    name: '홍콩반점',
    address: '성수',
    rating: 3.5,
    menu: [{ 짜장면: 6000 }],
    reviews: [{ id: 'beomgyu', content: '맛없어요' }],
    numberOfOrder: 50,
    thumbImg: 'I dont have yet'
  });

  //each document can be saved to the database by calling its 'save' method
  r1.save(function(err, data) {
    if (err) return console.error(err);
    console.log('save!', data);
  });

  restaurant.find(function(err, data) {
    if (err) return console.error(err);
    console.log('I found ', data);
  });
});
