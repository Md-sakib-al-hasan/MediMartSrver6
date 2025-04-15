import PDFDocument from 'pdfkit';
import { IOrder } from '../modules/order/order.interface';
import axios from 'axios';

/**
 * Generates a PDF invoice for an order.
 * @param {IOrder} order - The order object to generate the invoice for.
 * @returns {Promise<Buffer>} - The generated PDF as a Buffer.
 */
export const generateOrderInvoicePDF = async (
  order: IOrder,
): Promise<Buffer> => {
  const logoUrl = 'https://i.ibb.co/V0rZ9NX/image-removebg-preview.png';

  const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
  const logoBuffer = Buffer.from(response.data);

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // Header
    const logoWidth = 70;
    const logoX = (doc.page.width - logoWidth) / 2;
    doc.image(logoBuffer, logoX, doc.y, { width: logoWidth });
    doc.moveDown(6);

    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('MediMart', { align: 'center' });
    doc.fontSize(10).text('Jamgora, Savar, Dhaka', { align: 'center' });
    doc.fontSize(10).text('Email: sk0715975@gmail.com', { align: 'center' });
    doc.fontSize(10).text('Phone: 01625457343', { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(15).fillColor('#003366').text('Invoice', { align: 'center' });
    doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Invoice Info
    doc.fillColor('#000').fontSize(11);
    doc.text(`Invoice ID: ${order._id}`);
    doc.text(`Order Date: ${(order.createdAt as Date).toLocaleDateString()}`);

    // @ts-expect-error: TypeScript might not know user always has name
    doc.text(`Customer Name: ${order.user.name}`);
    doc.text(`Shipping Address: ${order.shippingAddress}`);
    doc.moveDown(1);

    // Payment Info
    doc
      .font('Helvetica-Bold')
      .fillColor('#003366')
      .text('Payment Details:', { underline: true });
    doc
      .font('Helvetica')
      .fillColor('#000')
      .text(`Payment Status: ${order.paymentStatus}`);
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.moveDown(1);

    // Product Table
    doc
      .font('Helvetica-Bold')
      .fillColor('#003366')
      .text('Order Products:', { underline: true });
    doc.moveDown(1);

    const tableTop = doc.y;
    const rowHeight = 20;

    doc.fontSize(11).text('Product Name', 50, tableTop);
    doc.text('Quantity', 300, tableTop);
    doc.text('Price', 450, tableTop);

    doc
      .moveTo(50, tableTop + rowHeight)
      .lineTo(550, tableTop + rowHeight)
      .stroke();
    let currentY = tableTop + rowHeight + 5;

    order.products.forEach((item) => {
      // @ts-expect-error: product might be missing from item
      const productName = item.product?.name || 'Unknown Product';
      const quantity = item.quantity;

      const price = item.unitPrice * quantity || 0;

      doc
        .font('Helvetica')
        .fillColor('#000')
        .text(productName, 50, currentY, { width: 130, align: 'left' });
      doc.text(quantity.toString(), 280, currentY, {
        width: 90,
        align: 'center',
      });
      doc.text(price.toFixed(2), 400, currentY, { width: 90, align: 'right' });

      currentY += rowHeight;
    });

    doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
    doc.moveDown(2);

    // Pricing Table
    const pricingTop = doc.y;
    doc
      .font('Helvetica-Bold')
      .fillColor('#003366')
      .text('Description', 50, pricingTop);
    doc.text('Amount', 450, pricingTop);

    doc
      .moveTo(50, pricingTop + rowHeight)
      .lineTo(550, pricingTop + rowHeight)
      .stroke();
    let pricingY = pricingTop + rowHeight + 5;

    doc.font('Helvetica').fillColor('#000');
    doc.text('Sub Total', 50, pricingY, { width: 200 });
    doc.text(`${order.totalAmount.toFixed(2)} /-`, 400, pricingY, {
      width: 90,
      align: 'right',
    });
    pricingY += rowHeight;

    doc.text('Discount', 50, pricingY, { width: 200 });
    doc.text(`-${order.discount.toFixed(2)} /-`, 400, pricingY, {
      width: 90,
      align: 'right',
    });
    pricingY += rowHeight;

    doc.text('Delivery Charge', 50, pricingY, { width: 200 });
    doc.text(`${order.deliveryCharge.toFixed(2)} /-`, 400, pricingY, {
      width: 90,
      align: 'right',
    });
    pricingY += rowHeight;

    doc.font('Helvetica-Bold').fillColor('#003366');
    doc.text('Total', 50, pricingY, { width: 200 });
    doc.text(`${order.finalAmount.toFixed(2)} /-`, 400, pricingY, {
      width: 90,
      align: 'right',
    });

    pricingY += rowHeight;
    doc.moveTo(50, pricingY).lineTo(550, pricingY).stroke();

    // Footer
    doc.moveDown(3);
    doc.fontSize(9).fillColor('#000').text('Thank you for shopping!');
    doc
      .fontSize(9)
      .fillColor('#003366')
      .text('— MediMart', { align: 'center' });

    doc.end();
  });
};
