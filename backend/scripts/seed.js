const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/user.model');
const Store = require('../src/models/store.model');
const Product = require('../src/models/product.model');
const Inventory = require('../src/models/inventory.model');
const Customer = require('../src/models/customer.model');
const Register = require('../src/models/register.model');

const seedDatabase = async () => {
	try {
		console.log('Connecting to database...');
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB Connected.');

		console.log('Clearing existing data...');
		await User.deleteMany({});
		await Store.deleteMany({});
		await Product.deleteMany({});
		await Inventory.deleteMany({});
		await Customer.deleteMany({});
		await Register.deleteMany({});

		console.log('Creating Seed Data...');

		// 1. Create a Store
		const store = await Store.create({
			name: 'Main Store',
			code: 'MAIN-01',
			address: {
				street: '123 Main St',
				city: 'Colombo',
				state: 'Western',
				zip: '00100',
				country: 'Sri Lanka',
			},
			phone: '0112345678',
		});

		// 2. Create Users
		await User.create([
			{
				name: 'Admin User',
				email: 'admin@erp.com',
				password: 'password123',
				role: 'admin',
				storeId: store._id,
			},
			{
				name: 'Cashier User',
				email: 'cashier@erp.com',
				password: 'password123',
				role: 'cashier',
				storeId: store._id,
			},
		]);

		// 3. Create a Register
		await Register.create({
			storeId: store._id,
			name: 'Register 1',
			status: 'closed',
		});

		// 4. Create a Customer
		await Customer.create({
			name: 'John Doe',
			email: 'john@example.com',
			phone: '0771234567',
			creditLimit: 50000,
			currentBalance: 0,
		});

		// 5. Create Products
		const products = await Product.create([
			{
				sku: 'PROD-001',
				name: 'Wireless Mouse',
				description: 'Ergonomic wireless mouse',
				category: 'Electronics',
				unit: 'pcs',
				posPrice: 15.0,
				ecommercePrice: 14.5,
				taxRate: 5,
				visibility: 'both',
			},
			{
				sku: 'PROD-002',
				name: 'Mechanical Keyboard',
				description: 'RGB Mechanical Keyboard',
				category: 'Electronics',
				unit: 'pcs',
				posPrice: 45.0,
				ecommercePrice: 40.0,
				taxRate: 5,
				visibility: 'both',
			},
			{
				sku: 'PROD-003',
				name: 'Coffee Mug',
				description: 'Ceramic coffee mug 300ml',
				category: 'Kitchen',
				unit: 'pcs',
				posPrice: 5.0,
				ecommercePrice: 5.0,
				taxRate: 0,
				visibility: 'pos_only',
			},
		]);

		// 6. Create Inventory for Products in the Store
		const inventoryData = products.map((product) => ({
			productId: product._id,
			storeId: store._id,
			quantity: 100, // 100 pieces each
			reservedQuantity: 0,
		}));
		await Inventory.insertMany(inventoryData);

		console.log('Database Seeding Completed Successfully!');
		process.exit();
	} catch (error) {
		console.error('Error seeding database:', error);
		process.exit(1);
	}
};

seedDatabase();
