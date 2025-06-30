const Link = require('../models/Link');

// @route   GET /api/links
// @desc    Get all user's links
exports.getLinks = async (req, res) => {
    try {
        const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(links);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/links
// @desc    Add a new link
exports.addLink = async (req, res) => {
    const { url, title, description, category, tags } = req.body;
    try {
        const newLink = new Link({
            user: req.user.id,
            url,
            title,
            description,
            category,
            tags
        });

        const link = await newLink.save();
        res.json(link);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};






// @route   PUT /api/links/:id
// @desc    Update a link
exports.updateLink = async (req, res) => {
    try {
        let link = await Link.findById(req.params.id);
        if (!link) return res.status(404).json({ msg: 'Link not found' });

        // Make sure user owns the link
        if (link.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        link = await Link.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(link);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/links/:id
// @desc    Delete a link
exports.deleteLink = async (req, res) => {
    try {
        let link = await Link.findById(req.params.id);
        if (!link) return res.status(404).json({ msg: 'Link not found' });

        if (link.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Link.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Link removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};