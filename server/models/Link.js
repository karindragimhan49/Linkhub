const mongoose = require('mongoose');
const LinkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    project: { type: String, default: 'General' }, // <-- THE FIX IS HERE! ADD THIS LINE
}, { timestamps: true });
module.exports = mongoose.models.Link || mongoose.model('Link', LinkSchema);