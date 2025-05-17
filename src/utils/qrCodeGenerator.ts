
// Function to generate a unique bill ID 
export const generateBillId = (): string => {
  const prefix = 'BW';
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  const timestamp = Date.now().toString().slice(-4); // last 4 digits of timestamp
  return `${prefix}-${randomNum}-${timestamp}`;
};

// Function to generate QR code URL for bill verification
export const generateQRCodeURL = (billId: string, customerId: string, amount: number): string => {
  // Create data object to encode in QR
  const data = {
    billId: billId,
    customerId: customerId,
    amount: amount
  };
  
  // Encode as URL parameter
  const encodedData = encodeURIComponent(JSON.stringify(data));
  
  // Generate Google Chart API URL for QR code
  return `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodedData}`;
};
