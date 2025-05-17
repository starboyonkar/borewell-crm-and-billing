
export const generateQRCodeURL = (billId: string, customerId: string, amount: number) => {
  // Format data in a standard way for QR code
  const data = JSON.stringify({
    billId,
    customerId,
    amount,
    timestamp: new Date().toISOString()
  });
  
  // Use Google Chart API to generate QR code
  return `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(data)}`;
};

// Generate a unique bill ID
export const generateBillId = () => {
  const prefix = 'BW';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};
