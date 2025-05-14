
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { CustomerData } from '../context/CustomerContext';

// Use proper typing for jsPDF with autoTable plugin
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDFWithAutoTable;
  lastAutoTable: {
    finalY: number;
  };
}

// Default bill template configuration
let billTemplate = {
  companyName: 'Borewell Services & Equipment',
  companyAddress: '123 Water Street, Groundwater City',
  companyPhone: '+91 98765 43210',
  companyEmail: 'info@borewellservices.com',
  companyWebsite: 'www.borewellservices.com',
  companyLogo: '',
  footer: 'Thank you for your business!',
  termsAndConditions: [
    'Payment is due within 15 days of invoice date.',
    'Warranty period for pump equipment is 12 months from date of installation.',
    'Service warranty is valid for 90 days.',
  ],
};

export const updateBillTemplate = (newTemplate: Partial<typeof billTemplate>) => {
  billTemplate = { ...billTemplate, ...newTemplate };
};

export const getBillTemplate = () => {
  return { ...billTemplate };
};

export const generatePDF = (customer: CustomerData): jsPDF => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.width;

  // Add company header
  doc.setFontSize(20);
  doc.setTextColor(0, 84, 147); // Blue color for header
  doc.text(billTemplate.companyName, pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(billTemplate.companyAddress, pageWidth / 2, 27, { align: 'center' });
  doc.text(`Phone: ${billTemplate.companyPhone} | Email: ${billTemplate.companyEmail}`, pageWidth / 2, 32, { align: 'center' });
  doc.text(`Website: ${billTemplate.companyWebsite}`, pageWidth / 2, 37, { align: 'center' });

  // Add invoice title
  doc.setFontSize(16);
  doc.setTextColor(0, 84, 147); // Blue color for header
  doc.text('INVOICE', pageWidth / 2, 45, { align: 'center' });
  
  // Add separator line
  doc.setDrawColor(0, 84, 147);
  doc.line(20, 48, pageWidth - 20, 48);

  // Customer information
  doc.setFontSize(11);
  doc.setTextColor(0);
  
  doc.text('Bill To:', 20, 55);
  doc.text(`Name: ${customer.name}`, 20, 62);
  doc.text(`Address: ${customer.address}`, 20, 69);
  doc.text(`Phone: ${customer.phone}`, 20, 76);
  doc.text(`Email: ${customer.email}`, 20, 83);

  // Invoice details
  doc.text('Invoice Details:', pageWidth - 75, 55);
  doc.text(`Invoice #: INV-${customer.id}`, pageWidth - 75, 62);
  doc.text(`Date: ${new Date(customer.serviceDate).toLocaleDateString()}`, pageWidth - 75, 69);
  doc.text(`Payment Status: ${customer.paymentStatus}`, pageWidth - 75, 76);
  
  // Service details table
  doc.autoTable({
    startY: 95,
    head: [['Service/Product', 'Description', 'Amount']],
    body: [
      [
        customer.serviceType, 
        `${customer.serviceType === 'Borewell Installation' ? 
          `Depth: ${customer.borewellDepth} ft, ` : ''}${
          customer.pumpType ? `Pump: ${customer.pumpType} ${customer.pumpModel || ''}` : ''
        }`,
        `₹${customer.totalAmount.toLocaleString('en-IN')}`
      ],
      ...(customer.accessories ? customer.accessories.map(acc => 
        ['Accessory', acc, '']
      ) : []),
    ],
    foot: [
      ['', 'Subtotal', `₹${customer.totalAmount.toLocaleString('en-IN')}`],
      ['', 'Tax', `₹${customer.taxes.toLocaleString('en-IN')}`],
      ['', 'Grand Total', `₹${customer.grandTotal.toLocaleString('en-IN')}`],
    ],
    headStyles: { fillColor: [0, 84, 147] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
  });

  // Notes
  const finalY = doc.lastAutoTable.finalY + 10;
  if (customer.notes) {
    doc.text('Notes:', 20, finalY);
    doc.setFontSize(10);
    doc.text(customer.notes, 20, finalY + 7);
  }

  // Terms and conditions
  const termsY = customer.notes ? finalY + 20 : finalY;
  doc.setFontSize(11);
  doc.setTextColor(0, 84, 147);
  doc.text('Terms and Conditions:', 20, termsY);
  doc.setTextColor(0);
  doc.setFontSize(9);
  
  billTemplate.termsAndConditions.forEach((term, index) => {
    doc.text(`${index + 1}. ${term}`, 20, termsY + 7 + (index * 5));
  });

  // Footer
  doc.setFontSize(10);
  doc.text(billTemplate.footer, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

  return doc;
};
