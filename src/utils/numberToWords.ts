
export const convertToWords = (amount: number): string => {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];
  
  const formatTens = (num: number): string => {
    if (num < 20) return ones[num];
    return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  };
  
  const formatHundreds = (num: number): string => {
    if (num === 0) return '';
    if (num < 100) return formatTens(num);
    return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + formatTens(num % 100) : '');
  };
  
  const formatGroup = (num: number, groupName: string): string => {
    return num !== 0 ? formatHundreds(num) + ' ' + groupName : '';
  };

  if (amount === 0) return 'Zero Rupees Only';
  
  // Handle decimals
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  
  let result = '';
  
  // Process rupees
  const crores = Math.floor(rupees / 10000000) % 100;
  const lakhs = Math.floor(rupees / 100000) % 100;
  const thousands = Math.floor(rupees / 1000) % 100;
  const hundreds = rupees % 1000;
  
  const parts = [
    formatGroup(crores, 'Crore'),
    formatGroup(lakhs, 'Lakh'),
    formatGroup(thousands, 'Thousand'),
    formatHundreds(hundreds)
  ];
  
  result = parts.filter(part => part !== '').join(' ');
  
  // Add rupees
  result += ' Rupees';
  
  // Add paise if applicable
  if (paise > 0) {
    result += ' and ' + formatTens(paise) + ' Paise';
  }
  
  result += ' Only';
  
  return result.trim();
};
