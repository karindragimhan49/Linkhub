const mongoose = require('mongoose');
const LinkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
}, { timestamps: true });
module.exports = mongoose.models.Link || mongoose.model('Link', LinkSchema);