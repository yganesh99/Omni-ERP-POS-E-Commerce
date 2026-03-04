const multer = require('multer');
const path = require('path');
const fs = require('fs');

// const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'invoices');

// UPSUN_STORAGE_ROOT points to mounted storage (production only)
const UPLOAD_ROOT =
	process.env.UPLOAD_ROOT || path.join(process.cwd(), 'uploads');

const createUpload = (subDir = 'misc') => {
	const uploadDir = path.join(UPLOAD_ROOT, subDir);

	// Ensure the upload directory exists
	fs.mkdirSync(uploadDir, { recursive: true });

	const storage = multer.diskStorage({
		destination: (_req, _file, cb) => cb(null, uploadDir),
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

	return upload;
};

module.exports = createUpload;
