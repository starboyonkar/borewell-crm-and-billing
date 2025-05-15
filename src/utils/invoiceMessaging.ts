
import { toast } from 'sonner';
import { generatePDF } from './pdfGenerator';
import type { CustomerData } from '../context/CustomerContext';

type MessageChannel = 'email' | 'whatsapp' | 'sms';

export const sendDigitalInvoice = async (
  customer: CustomerData, 
  channel: MessageChannel
): Promise<boolean> => {
  if (!customer) {
    toast.error('Customer information not found');
    return false;
  }

  // Generate PDF for attachment
  const pdfDoc = generatePDF(customer);
  const pdfBlob = pdfDoc.output('blob');
  
  try {
    switch (channel) {
      case 'email':
        if (!customer.email) {
          toast.error('Customer email not provided');
          return false;
        }
        await sendViaEmail(customer, pdfBlob);
        break;
      case 'whatsapp':
        if (!customer.phone) {
          toast.error('Customer phone number not provided');
          return false;
        }
        await sendViaWhatsApp(customer, pdfBlob);
        break;
      case 'sms':
        if (!customer.phone) {
          toast.error('Customer phone number not provided');
          return false;
        }
        await sendViaSMS(customer);
        break;
      default:
        toast.error('Invalid messaging channel selected');
        return false;
    }
    
    toast.success(`Invoice sent successfully via ${channel}`);
    return true;
  } catch (error) {
    console.error(`Error sending invoice via ${channel}:`, error);
    toast.error(`Failed to send invoice via ${channel}. Please try again.`);
    return false;
  }
};

// In a real application, these would connect to actual services
// For this demo, we'll simulate the process

const sendViaEmail = async (customer: CustomerData, pdfBlob: Blob): Promise<void> => {
  console.log(`Sending invoice to ${customer.name} via email: ${customer.email}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, you would use a service like SendGrid, Amazon SES, etc.
  // Example:
  // const formData = new FormData();
  // formData.append('to', customer.email);
  // formData.append('subject', `Invoice for ${customer.serviceType}`);
  // formData.append('attachment', pdfBlob, `invoice-${customer.id}.pdf`);
  // await fetch('https://your-email-service.com/send', { method: 'POST', body: formData });
};

const sendViaWhatsApp = async (customer: CustomerData, pdfBlob: Blob): Promise<void> => {
  console.log(`Sending invoice to ${customer.name} via WhatsApp: ${customer.phone}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, you would use WhatsApp Business API
  // Example:
  // const formData = new FormData();
  // formData.append('phone', customer.phone);
  // formData.append('message', `Invoice for your recent service: ${customer.serviceType}`);
  // formData.append('document', pdfBlob, `invoice-${customer.id}.pdf`);
  // await fetch('https://your-whatsapp-service.com/send', { method: 'POST', body: formData });
};

const sendViaSMS = async (customer: CustomerData): Promise<void> => {
  console.log(`Sending invoice link to ${customer.name} via SMS: ${customer.phone}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, you would use an SMS service like Twilio, MessageBird, etc.
  // Example:
  // const message = `Your invoice for ${customer.serviceType} is ready. View it here: https://your-domain.com/invoices/${customer.id}`;
  // await fetch('https://your-sms-service.com/send', {
  //   method: 'POST',
  //   body: JSON.stringify({ to: customer.phone, message }),
  //   headers: { 'Content-Type': 'application/json' }
  // });
};
