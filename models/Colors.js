const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allColorSchema = new Schema({

  userId: {
    type: String,
    required: true,
  },
  
  orderNumber: {
    type: Number,
    required: true,
    unique: true,
  },

  mainColor: {
    url: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },

  },
  aboutColor: String,
  productsColor: String,
  newsColor: String,
  contactColor: String,
  
  colorCategory: {
    type: Array,
    default: [],
  },

  likes: {
    type: Array,
    default: [],
  },

},
{ timestamps: true }
);

const Colors = mongoose.model('Colors', allColorSchema);
module.exports = Colors;


