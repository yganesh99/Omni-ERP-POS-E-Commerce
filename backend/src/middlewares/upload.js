const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'invoices');

// Ensure the upload directory exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
	filename: (_req, file, cb) => {
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const ext = path.extname(file.originalname);
		cb(null, `${unique}${ext}`);
	},
});

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const fileFilter = (_req, file, cb) => {
	if (ALLOWED_TYPES.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			Object.assign(
				new Error(
					'Invalid file type. Only JPEG, PNG, and PDF files are allowed.',
				),
				{ status: 400 },
			),
			false,
		);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5 MB
		files: 5,
	},
});

module.exports = upload;
