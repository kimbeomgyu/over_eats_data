// let puppeteer = require('puppeteer');
let mongoose = require('mongoose');
mongoose.connect('mongodb://over:eats@54.180.102.251:27017/overEats', {
  useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('we are connected!');
});
/* schema */
var reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  content: String,
  Date: { type: Date, default: Date.now }
});

var menuSchema = new mongoose.Schema({
  name: String,
  price: String
});
var restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  category: String,
  rating: { type: Number, default: 3.5 },
  menus: [menuSchema],
  reviews: [reviewSchema],
  numberOfOrder: { type: Number, default: 50 },
  thumbImg: String
});

//compile our schema into a model
var restaurant = mongoose.model('restaurant', restaurantSchema);
restaurant.find({ address: '종로구' }, (err, data) => {
  if (err) console.log(err);
  console.log(data);
});
