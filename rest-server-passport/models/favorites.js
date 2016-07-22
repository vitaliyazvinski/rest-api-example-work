var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = Schema({
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{ type: Schema.Types.ObjectId, ref: 'Dish' }]
}, {
        timestamps: true
    });

var Favorites = mongoose.model('favorite', favoriteSchema);
module.exports = Favorites;