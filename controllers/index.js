const bcrypt = require('bcryptjs');

const Secret = require('../models/secret');

exports.getSecrets = (req, res, next) => {
	const username = req.params.username;

	Secret.findAll({
		where: {
			username,
		},
	}).then((secrets) => {
		res.status(200).json(secrets);
	});
};

exports.addSecret = (req, res, next) => {
	const username = req.params.username;
	const { key, value } = req.body;

	if (!key || !value) {
		return res.status(422).json({
			message: 'You must provide a key and value for a secret',
		});
	}

	Secret.create({
		username,
		key,
		value,
	})
		.then((secret) => {
			return secret.save();
		})
		.then((secret) => {
			return res.status(201).json(secret);
		})
		.catch((err) => {
			next(err);
		});
};

exports.deleteSecret = (req, res, next) => {
	const username = req.params.username;
	const secretId = req.params.secretId;

	Secret.findByPk(secretId)
		.then((secret) => {
			if (!secret) {
				return res.status(404).json({ message: 'Secret not found' });
			}

			if (secret.username !== username) {
				return res.status(403).json({ message: 'Unauthorized' });
			}

			return secret.destroy().then(() => {
				return res.status(200).json({ message: 'Secret updated' });
			});
		})
		.catch((err) => {
			next(err);
		});
};

exports.updateSecret = (req, res, next) => {
	const username = req.params.username;
	const secretId = req.params.secretId;

	const { key, value } = req.body;

	if (!key || !value) {
		return res.status(422).json({
			message: 'You must provide a key and value for a secret',
		});
	}

	Secret.findByPk(secretId)
		.then((secret) => {
			if (!secret) {
				return res.status(404).json({ message: 'Secret not found' });
			}

			if (secret.username !== username) {
				return res.status(403).json({ message: 'Unauthorized' });
			}

			return secret.update({ key, value }).then(() => {
				return res.status(200).json({ message: 'Secret deleted' });
			});
		})
		.catch((err) => {
			next(err);
		});
};
