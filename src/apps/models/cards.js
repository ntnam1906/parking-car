const mongoose = require('../../common/database')();
const Schema = mongoose.Schema;
const cardSchema = new Schema({
    full_name: String,
    id: String,
    role: String,
    status: Boolean,
    activeAt: {type: Date, default: Date.now}
}, {
    timestamps: true
})

const CardsModel = mongoose.model("cards", cardSchema, "cards");
module.exports = CardsModel;