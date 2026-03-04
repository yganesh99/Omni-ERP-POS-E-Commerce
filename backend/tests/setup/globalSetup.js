/**
 * tests/setup/globalSetup.js
 *
 * Runs ONCE before all test suites.
 * Starts an in-memory MongoDB instance and stores its URI so every
 * test worker can connect without touching a real database.
 */
const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
	// Load .env.test before anything else
	require('dotenv').config({ path: '.env.test' });

	const mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri();

	// Pass the server instance and URI to globalTeardown / test files via globals
	global.__MONGOD__ = mongod;
	process.env.MONGO_URI = uri;

	// Store the dynamic URI so jest workers can pick it up
	// jest sets each test file's process.env separately, so we persist via a file
	process.env.__MONGO_URI__ = uri;
};
