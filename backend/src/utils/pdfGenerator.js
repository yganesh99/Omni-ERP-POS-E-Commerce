const PDFDocument = require('pdfkit');

function generateInvoice(order, res) {
	const doc = new PDFDocument({ size: 'A4', margin: 40 });
	doc.pipe(res);

	const formatCurrency = (amount) => `Rs ${amount.toFixed(2)}`;
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	let y = generateHeader(doc, order);
	y = generateCustomerInformation(doc, order, formatDate, y);
	y = generateInvoiceTable(doc, order, formatCurrency, y);
	generateFooter(doc, y, order);

	doc.end();
}

function generateHeader(doc, order) {
	let y = 40;

	// Brand Title
	doc.font('Helvetica-Bold')
		.fontSize(22)
		.fillColor('#000000')
		.text('Fabric', 40, y, { continued: true })
		.fillColor('#FF0000')
		.text('Hub')
		.fillColor('#000000');

	y += 28;

	// Brand Address
	doc.font('Helvetica').fontSize(9);
	doc.text('No 10, Hill Street, Dehiwala', 40, y);
	y += 12;
	doc.text('+94 112 123 456  |  fabrichub@gmail.com', 40, y);
	y += 8;

	// Invoice / Quote Number (right aligned)
	const isQuote = !!order.isQuote;

	if (!isQuote) {
		doc.font('Helvetica-Bold')
			.fontSize(14)
			.fillColor('#808080')
			.text('Invoice: ', 350, 40, {
				continued: true,
			})
			.fillColor('#000000')
			.text(order.orderNumber);
	}

	return y;
}

function generateCustomerInformation(doc, order, formatDate, startY) {
	const customer = order.customerId || {};
	const issueDate = order.createdAt
		? formatDate(order.createdAt)
		: formatDate(Date.now());

	let y = startY + 12;

	// Horizontal separator
	doc.moveTo(40, y)
		.lineTo(555, y)
		.strokeColor('#DDDDDD')
		.lineWidth(0.5)
		.stroke();
	y += 10;

	// Left column: Issue Date
	doc.font('Helvetica-Bold')
		.fontSize(9)
		.fillColor('#808080')
		.text('Issue Date:', 40, y);
	doc.font('Helvetica')
		.fontSize(9)
		.fillColor('#000000')
		.text(issueDate, 100, y);

	// Right column: Customer
	doc.font('Helvetica-Bold')
		.fontSize(9)
		.fillColor('#808080')
		.text('Customer:', 350, y);
	doc.font('Helvetica')
		.fontSize(9)
		.fillColor('#000000')
		.text(customer.name || 'Walk-in Customer', 405, y);

	y += 14;

	// Payment Method
	const paymentLabel =
		(order.paymentMethod || 'cash').charAt(0).toUpperCase() +
		(order.paymentMethod || 'cash').slice(1);
	doc.font('Helvetica-Bold')
		.fontSize(9)
		.fillColor('#808080')
		.text('Payment:', 40, y);
	doc.font('Helvetica')
		.fontSize(9)
		.fillColor('#000000')
		.text(paymentLabel, 100, y);

	y += 14;

	if (customer.phone) {
		doc.font('Helvetica').fontSize(9).text(customer.phone, 405, y);
		y += 12;
	}
	if (customer.email) {
		doc.font('Helvetica').fontSize(9).text(customer.email, 405, y);
		y += 12;
	}

	return y;
}

function generateInvoiceTable(doc, order, formatCurrency, startY) {
	let y = startY + 8;

	// Table Header Background
	doc.rect(40, y, 515, 22).fill('#EEEEEE');

	// Table Header Text
	doc.font('Helvetica-Bold').fontSize(9).fillColor('#000000');
	generateTableRow(doc, y + 6, 'Description', 'Qty', 'Rate', 'Total');

	y += 30;
	doc.font('Helvetica').fontSize(9);

	const formatQty = (qty) =>
		Number.isInteger(Number(qty)) ? String(qty) : Number(qty).toFixed(2);
	const qtyWithUnit = (item) =>
		`${formatQty(item.quantity)} ${item.unit || 'pcs'}`;

	// Table Items — line total shown without tax; tax is added in summary below
	for (let i = 0; i < order.items.length; i++) {
		const item = order.items[i];
		const lineTotalExclTax = item.unitPrice * item.quantity;

		const descHeight = doc.heightOfString(`${item.name} - ${item.sku}`, {
			width: 200,
		});
		const rowHeight = Math.max(descHeight, 14);

		generateTableRow(
			doc,
			y,
			`${item.name}\n${item.sku}`,
			qtyWithUnit(item),
			formatCurrency(item.unitPrice),
			formatCurrency(lineTotalExclTax),
		);

		// Dotted separator
		doc.lineWidth(0.5)
			.dash(2, { space: 2 })
			.moveTo(40, y + rowHeight + 4)
			.lineTo(555, y + rowHeight + 4)
			.strokeColor('#CCCCCC')
			.stroke()
			.undash();

		y += rowHeight + 10;

		// Page break for very long orders
		if (y > 700) {
			doc.addPage();
			y = 40;
		}
	}

	// Summary Section — Subtotal, then Discount, then Tax
	const summaryY = y + 12;
	let nextY = summaryY;

	doc.font('Helvetica-Bold').fontSize(9);
	doc.text('Subtotal', 350, nextY);
	doc.font('Helvetica').fontSize(9);
	doc.text(formatCurrency(order.subtotal), 450, nextY, {
		width: 90,
		align: 'right',
	});
	nextY += 16;

	if (order.discountAmount > 0) {
		doc.font('Helvetica-Bold').fontSize(9);
		doc.text('Discount', 350, nextY);
		doc.font('Helvetica').fontSize(9);
		doc.text('-' + formatCurrency(order.discountAmount), 450, nextY, {
			width: 90,
			align: 'right',
		});
		nextY += 16;
	}

	doc.font('Helvetica-Bold').fontSize(9);
	doc.text('Tax', 350, nextY);
	doc.font('Helvetica').fontSize(9);
	doc.text(formatCurrency(order.taxAmount || 0), 450, nextY, {
		width: 90,
		align: 'right',
	});
	nextY += 16;

	if (order.creditUsed > 0) {
		doc.font('Helvetica-Bold').fontSize(9);
		doc.text('Credit Used', 350, nextY);
		doc.font('Helvetica').fontSize(9);
		doc.text('-' + formatCurrency(order.creditUsed), 450, nextY, {
			width: 90,
			align: 'right',
		});
		nextY += 16;
	}

	// Separator before total
	doc.moveTo(350, nextY)
		.lineTo(555, nextY)
		.strokeColor('#000000')
		.lineWidth(0.5)
		.stroke();

	doc.font('Helvetica-Bold').fontSize(12);
	doc.text('Total', 350, nextY + 6);
	doc.text(formatCurrency(order.totalAmount), 430, nextY + 6, {
		width: 110,
		align: 'right',
	});

	return nextY + 26;
}

function generateFooter(doc, contentEndY, order) {
	// Place footer dynamically after content, but ensure it's near bottom
	const footerY = Math.max(contentEndY + 30, 720);
	const isQuote = !!order?.isQuote;

	doc.font('Helvetica').fontSize(8).fillColor('#808080');
	doc.text(
		isQuote
			? 'This is a computer-generated quotation and does not require a signature.'
			: 'This is a computer-generated invoice and does not require a signature.',
		40,
		footerY,
		{ width: 515, align: 'center' },
	);

	doc.font('Helvetica-Bold').fontSize(13).fillColor('#000000');
	doc.text('Thanks for shopping with us!', 40, footerY + 18, {
		align: 'center',
		width: 515,
	});

	doc.font('Helvetica').fontSize(10).fillColor('#808080');
	doc.text('Come back for your next fabric adventure!', 40, footerY + 36, {
		align: 'center',
		width: 515,
	});
}

function generateTableRow(doc, y, description, quantity, rate, total) {
	doc.text(description, 50, y, { width: 200 });
	doc.text(quantity, 260, y, { width: 80, align: 'center' });
	doc.text(rate, 350, y, { width: 90, align: 'right' });
	doc.text(total, 450, y, { width: 90, align: 'right' });
}

module.exports = {
	generateInvoice,
};
