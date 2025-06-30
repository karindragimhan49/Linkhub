const Link = require('../models/Link');

exports.getLinks = async (req, res) => {
    const { project, search } = req.query;
    let query = { user: req.user.id };

    if (project && project !== 'All Projects') {
        query.project = project;
    }
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const links = await Link.find(query).sort({ createdAt: -1 });
    res.status(200).json(links);
};

exports.getProjects = async (req, res) => {
    const projects = await Link.find({ user: req.user.id }).distinct('project');
    res.status(200).json(projects);
};

exports.createLink = async (req, res) => {
    const { url, title, project } = req.body;
    if (!url || !title) {
        return res.status(400).json({ message: 'URL and Title are required' });
    }
    const link = await Link.create({ ...req.body, user: req.user.id, project: project || 'General' });
    res.status(201).json(link);
};

exports.deleteLink = async (req, res) => {
    const link = await Link.findById(req.params.id);
    if (!link) {
        return res.status(404).json({ message: 'Link not found' });
    }
    if (link.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }
    await link.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Link removed' });
};