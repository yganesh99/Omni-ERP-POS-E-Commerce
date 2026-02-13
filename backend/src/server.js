const mongoose = require('mongoose');
const config = require('./config');
const app = require('./app');
const { cleanupExpiredLocks } = require('./services/inventory.service');

const LOCK_CLEANUP_INTERVAL_MS = 60 * 1000; // every 60 seconds

async function start() {
	try {
		await mongoose.connect(config.mongoUri, { autoIndex: true });
		console.log('Connected to MongoDB');

		app.listen(config.port, () => {
			console.log(`Server running on port ${config.port}`);
		});

		// Periodically release expired stock locks
		setInterval(async () => {
			try {
				await cleanupExpiredLocks();
			} catch (err) {
				console.error(
					'[StockLock Cleanup] Scheduler error:',
					err.message,
				);
			}
		}, LOCK_CLEANUP_INTERVAL_MS);
	} catch (err) {
		console.error('Failed to start', err);
		process.exit(1);
	}
}
start();
