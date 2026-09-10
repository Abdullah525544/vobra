/**
 * Generate a professional PDF document for an order.
 * Layout: invoice-style with branding, customer info, line items, totals, footer.
 */
import { jsPDF } from 'jspdf';
import { formatPKR, formatDateTime } from './format';

const COLORS = {
  ink: [31, 27, 22],
  inkLight: [111, 104, 91],
  inkMuted: [159, 151, 137],
  cream: [250, 247, 242],
  beige: [239, 231, 218],
  bamboo: [200, 164, 122],
  bambooDark: [138, 104, 40],
  sage: [122, 143, 110],
  border: [220, 213, 197],
};

const PAGE_MARGIN = 14;

function ascii(s) {
  if (s == null) return '';
  return String(s)
    .replace(/[^\x20-\x7E]/g, '-');
}

export const generateOrderPDF = (order, settings) => {
  if (!order) return;
  settings = settings || {};
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const innerW = pageW - PAGE_MARGIN * 2;

  const brand = settings.brand || {};
  const contact = settings.contact || {};
  const product = settings.product || {};

  /* ---------- Header band ---------- */
  doc.setFillColor(COLORS.ink[0], COLORS.ink[1], COLORS.ink[2]);
  doc.rect(0, 0, pageW, 30, 'F');
  doc.setTextColor(COLORS.cream[0], COLORS.cream[1], COLORS.cream[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(ascii(brand.name) || 'DELISOGA', PAGE_MARGIN, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(220, 213, 197);
  doc.text(ascii(brand.tagline) || 'Premium Glassware for Everyday Rituals', PAGE_MARGIN, 20);
  doc.setFontSize(8);
  doc.setTextColor(200, 164, 122);
  doc.text('Glass - Bamboo - Est. Pakistan', PAGE_MARGIN, 25.5);

  doc.setTextColor(220, 213, 197);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('ORDER RECEIPT', pageW - PAGE_MARGIN, 12, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(ascii(order.orderId || order.id) || 'N/A', pageW - PAGE_MARGIN, 20, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(220, 213, 197);
  doc.text(ascii(formatDateTime(order.createdAt)), pageW - PAGE_MARGIN, 25.5, { align: 'right' });

  let y = 40;

  /* ---------- Status pill ---------- */
  const status = order.status || 'New';
  const statusColors = {
    New: [239, 231, 218],
    Confirmed: [200, 164, 122],
    Processing: [232, 196, 122],
    Shipped: [220, 229, 213],
    Delivered: [167, 196, 152],
    Cancelled: [252, 215, 215],
  };
  const statusTextColor = {
    New: [31, 27, 22],
    Confirmed: [138, 104, 40],
    Processing: [138, 104, 40],
    Shipped: [60, 93, 49],
    Delivered: [60, 93, 49],
    Cancelled: [153, 27, 27],
  };
  const sc = statusColors[status] || statusColors.New;
  doc.setFillColor(sc[0], sc[1], sc[2]);
  doc.roundedRect(PAGE_MARGIN, y, 26, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  const stc = statusTextColor[status] || statusTextColor.New;
  doc.setTextColor(stc[0], stc[1], stc[2]);
  doc.text(status.toUpperCase(), PAGE_MARGIN + 13, y + 4.7, { align: 'center' });
  y += 12;

  /* ---------- Customer + Shipping block ---------- */
  const col1X = PAGE_MARGIN;
  const col2X = PAGE_MARGIN + innerW / 2 + 2;
  const colW = innerW / 2 - 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.inkMuted[0], COLORS.inkMuted[1], COLORS.inkMuted[2]);
  doc.text('BILL TO', col1X, y);
  doc.text('SHIP TO', col2X, y);
  y += 1.2;
  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.2);
  doc.line(col1X, y, col1X + colW, y);
  doc.line(col2X, y, col2X + colW, y);
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(COLORS.ink[0], COLORS.ink[1], COLORS.ink[2]);
  doc.text(ascii(order.customerName) || 'N/A', col1X, y);
  doc.text(ascii(order.customerName) || 'N/A', col2X, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(COLORS.inkLight[0], COLORS.inkLight[1], COLORS.inkLight[2]);
  if (order.phone) {
    doc.text('Phone: ' + ascii(order.phone), col1X, y);
    doc.text('Phone: ' + ascii(order.phone), col2X, y);
    y += 4.5;
  }
  if (order.email) {
    doc.text('Email: ' + ascii(order.email), col1X, y);
    doc.text('Email: ' + ascii(order.email), col2X, y);
    y += 4.5;
  }

  const addrLines = doc.splitTextToSize(ascii(order.address) || 'N/A', colW);
  doc.text('Address:', col1X, y);
  doc.text('Address:', col2X, y);
  y += 4.5;
  doc.setTextColor(COLORS.ink[0], COLORS.ink[1], COLORS.ink[2]);
  doc.text(addrLines, col1X, y);
  doc.text(addrLines, col2X, y);
  y += addrLines.length * 4.5 + 2;

  doc.setTextColor(COLORS.inkLight[0], COLORS.inkLight[1], COLORS.inkLight[2]);
  doc.text('City: ' + ascii(order.city) || 'N/A', col1X, y);
  doc.text('City: ' + ascii(order.city) || 'N/A', col2X, y);
  y += 8;

  /* ---------- Order items table ---------- */
  doc.setFillColor(COLORS.cream[0], COLORS.cream[1], COLORS.cream[2]);
  doc.rect(PAGE_MARGIN, y, innerW, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.inkMuted[0], COLORS.inkMuted[1], COLORS.inkMuted[2]);
  doc.text('ITEM', PAGE_MARGIN + 2, y + 5.5);
  doc.text('QTY', PAGE_MARGIN + innerW * 0.55, y + 5.5);
  doc.text('UNIT PRICE', PAGE_MARGIN + innerW * 0.7, y + 5.5);
  doc.text('AMOUNT', PAGE_MARGIN + innerW - 2, y + 5.5, { align: 'right' });
  y += 10;

  const productName = ascii(order.productName || product.name) || 'Glass Jar with Bamboo Lid & Glass Straw';
  const qty = order.quantity || 1;
  const unit = order.unitPrice || 0;
  const subtotal = order.subtotal || (unit * qty);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(COLORS.ink[0], COLORS.ink[1], COLORS.ink[2]);
  const productLines = doc.splitTextToSize(productName, innerW * 0.5);
  doc.text(productLines, PAGE_MARGIN + 2, y);
  doc.setFont('helvetica', 'bold');
  doc.text(String(qty), PAGE_MARGIN + innerW * 0.55, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatPKR(unit), PAGE_MARGIN + innerW * 0.7, y);
  doc.setFont('helvetica', 'bold');
  doc.text(formatPKR(subtotal), PAGE_MARGIN + innerW - 2, y, { align: 'right' });
  y += Math.max(productLines.length * 4.5, 5) + 2;

  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.2);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + innerW, y);
  y += 6;

  /* ---------- Totals ---------- */
  const totalsX = PAGE_MARGIN + innerW - 70;
  const amountsX = PAGE_MARGIN + innerW;
  const labelGap = 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(COLORS.inkLight[0], COLORS.inkLight[1], COLORS.inkLight[2]);
  doc.text('Subtotal', totalsX, y);
  doc.text(formatPKR(subtotal), amountsX, y, { align: 'right' });
  y += labelGap;

  doc.text('Delivery', totalsX, y);
  if (order.freeDelivery) {
    doc.setTextColor(COLORS.sage[0], COLORS.sage[1], COLORS.sage[2]);
    doc.text('Free', amountsX, y, { align: 'right' });
  } else {
    doc.setTextColor(COLORS.inkLight[0], COLORS.inkLight[1], COLORS.inkLight[2]);
    doc.text(formatPKR(order.deliveryCharges || 0), amountsX, y, { align: 'right' });
  }
  y += labelGap;

  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.line(totalsX, y - 2, amountsX, y - 2);
  y += 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(COLORS.ink[0], COLORS.ink[1], COLORS.ink[2]);
  doc.text('Total', totalsX, y + 2);
  doc.setTextColor(COLORS.bambooDark[0], COLORS.bambooDark[1], COLORS.bambooDark[2]);
  doc.text(formatPKR(order.finalTotal || (subtotal + (order.deliveryCharges || 0))), amountsX, y + 2, { align: 'right' });
  y += 12;

  /* ---------- Payment + delivery info row ---------- */
  doc.setFillColor(COLORS.cream[0], COLORS.cream[1], COLORS.cream[2]);
  doc.rect(PAGE_MARGIN, y, innerW, 22, 'F');

  const blockY = y + 6;
  const blockW = innerW / 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.inkMuted[0], COLORS.inkMuted[1], COLORS.inkMuted[2]);
  doc.text('PAYMENT METHOD', PAGE_MARGIN + 4, blockY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(COLORS.ink[0], COLORS.ink[1], COLORS.ink[2]);
  doc.text(ascii(order.paymentMethod) || 'Cash on Delivery', PAGE_MARGIN + 4, blockY + 5);
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.inkLight[0], COLORS.inkLight[1], COLORS.inkLight[2]);
  doc.text('Pay on delivery', PAGE_MARGIN + 4, blockY + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.inkMuted[0], COLORS.inkMuted[1], COLORS.inkMuted[2]);
  doc.text('DELIVERY', PAGE_MARGIN + blockW + 4, blockY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  if (order.freeDelivery) {
    doc.setTextColor(COLORS.sage[0], COLORS.sage[1], COLORS.sage[2]);
    doc.text('Free (2+ jars)', PAGE_MARGIN + blockW + 4, blockY + 5);
  } else {
    doc.setTextColor(COLORS.ink[0], COLORS.ink[1], COLORS.ink[2]);
    doc.text('Charged: ' + formatPKR(order.deliveryCharges || 0), PAGE_MARGIN + blockW + 4, blockY + 5);
  }
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.inkLight[0], COLORS.inkLight[1], COLORS.inkLight[2]);
  doc.text('Pakistan-wide delivery', PAGE_MARGIN + blockW + 4, blockY + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.inkMuted[0], COLORS.inkMuted[1], COLORS.inkMuted[2]);
  doc.text('STATUS', PAGE_MARGIN + blockW * 2 + 4, blockY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(stc[0], stc[1], stc[2]);
  doc.text(status, PAGE_MARGIN + blockW * 2 + 4, blockY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.inkLight[0], COLORS.inkLight[1], COLORS.inkLight[2]);
  doc.text('Last update: ' + ascii(formatDateTime(order.updatedAt || order.createdAt)), PAGE_MARGIN + blockW * 2 + 4, blockY + 9.5);

  y += 32;

  /* ---------- Notes ---------- */
  if (order.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(COLORS.inkMuted[0], COLORS.inkMuted[1], COLORS.inkMuted[2]);
    doc.text('ORDER NOTES', PAGE_MARGIN, y);
    y += 4;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(COLORS.inkLight[0], COLORS.inkLight[1], COLORS.inkLight[2]);
    const notesLines = doc.splitTextToSize(ascii(order.notes), innerW);
    doc.text(notesLines, PAGE_MARGIN, y);
    y += notesLines.length * 4.5 + 4;
  }

  /* ---------- Footer ---------- */
  const footerY = pageH - 30;
  doc.setDrawColor(COLORS.bamboo[0], COLORS.bamboo[1], COLORS.bamboo[2]);
  doc.setLineWidth(0.6);
  doc.line(PAGE_MARGIN, footerY, pageW - PAGE_MARGIN, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(COLORS.ink[0], COLORS.ink[1], COLORS.ink[2]);
  doc.text(ascii(brand.name) || 'DELISOGA', PAGE_MARGIN, footerY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.inkLight[0], COLORS.inkLight[1], COLORS.inkLight[2]);
  var footerContactParts = [];
  footerContactParts.push(ascii(contact.address) || 'Pakistan');
  if (contact.phone || contact.email) {
    footerContactParts.push(
      (ascii(contact.phone) || '') +
      (contact.phone && contact.email ? ' - ' : '') +
      (ascii(contact.email) || '')
    );
  }
  if (contact.whatsapp) {
    footerContactParts.push('WhatsApp: ' + ascii(contact.whatsapp));
  }
  doc.text(footerContactParts, PAGE_MARGIN, footerY + 11);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.inkMuted[0], COLORS.inkMuted[1], COLORS.inkMuted[2]);
  doc.text('Thank you for your order.', pageW - PAGE_MARGIN, footerY + 11, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(COLORS.inkMuted[0], COLORS.inkMuted[1], COLORS.inkMuted[2]);
  doc.text('Generated ' + ascii(formatDateTime(new Date().toISOString())), pageW - PAGE_MARGIN, footerY + 15, { align: 'right' });

  /* ---------- Save ---------- */
  var filename = 'DELISOGA-Order-' + ascii(order.orderId || order.id || 'receipt') + '.pdf';
  doc.save(filename);
};
