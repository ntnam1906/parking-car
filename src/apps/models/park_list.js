const mongoose = require('../../common/database')();
const Schema = mongoose.Schema;
const parkSchema = new Schema({
    name: String,
    address: String,
})

const ParksSchema = mongoose.model("park_list", parkSchema, "park_list");
module.exports = ParksSchema;