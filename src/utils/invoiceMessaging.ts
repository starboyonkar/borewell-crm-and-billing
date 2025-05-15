
import { toast } from '@/hooks/use-toast';
import { generatePDF } from './pdfGenerator';
import type { CustomerData } from '../context/CustomerContext';

type MessageChannel = 'email' | 'whatsapp' | 'sms';

export const sendDigitalInvoice = async (
  customer: CustomerData, 
  channel: MessageChannel
): Promise<boolean> => {
  if (!customer) {
    toast({
      title: "Error",
      description: "Customer information not found",
      variant: "destructive"
    });
    return false;
  }

  // Generate PDF for attachment
  const pdfDoc = generatePDF(customer);
  const pdfBlob = pdfDoc.output('blob');
  
  try {
    let success = false;
    
    switch (channel) {
      case 'email':
        if (!customer.email) {
          toast({
            title: "Error",
            description: "Customer email not provided",
            variant: "destructive"
          });
          return false;
        }
        success = await sendViaEmail(customer, pdfBlob);
        break;
      case 'whatsapp':
        if (!customer.phone) {
          toast({
            title: "Error",
            description: "Customer phone number not provided",
            variant: "destructive"
          });
          return false;
        }
        success = await sendViaWhatsApp(customer, pdfBlob);
        break;
      case 'sms':
        if (!customer.phone) {
          toast({
            title: "Error",
            description: "Customer phone number not provided",
            variant: "destructive"
          });
          return false;
        }
        success = await sendViaSMS(customer);
        break;
      default:
        toast({
          title: "Error",
          description: "Invalid messaging channel selected",
          variant: "destructive"
        });
        return false;
    }
    
    if (success) {
      toast({
        title: "Success",
        description: `Invoice sent successfully via ${channel}`,
      });
      return true;
    } else {
      throw new Error(`Failed to send invoice via ${channel}`);
    }
  } catch (error) {
    console.error(`Error sending invoice via ${channel}:`, error);
    toast({
      title: "Error",
      description: `Failed to send invoice via ${channel}. Please try again.`,
      variant: "destructive"
    });
    return false;
  }
};

// In a real application, these would connect to actual services
// We'll improve them to simulate successful deliveries and better error handling

const sendViaEmail = async (customer: CustomerData, pdfBlob: Blob): Promise<boolean> => {
  console.log(`Sending invoice to ${customer.name} via email: ${customer.email}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real application, you would use an email service API
  // For demo purposes, we'll simulate a successful email send
  const sendSuccess = Math.random() > 0.1; // 90% success rate
  
  if (sendSuccess) {
    console.log(`Email sent successfully to ${customer.email}`);
    return true;
  } else {
    console.error(`Failed to send email to ${customer.email}`);
    throw new Error("Email service temporarily unavailable");
  }
};

const sendViaWhatsApp = async (customer: CustomerData, pdfBlob: Blob): Promise<boolean> => {
  console.log(`Sending invoice to ${customer.name} via WhatsApp: ${customer.phone}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real application, you would use WhatsApp Business API
  // For demo purposes, we'll simulate a successful WhatsApp message
  const sendSuccess = Math.random() > 0.2; // 80% success rate
  
  if (sendSuccess) {
    console.log(`WhatsApp message sent successfully to ${customer.phone}`);
    return true;
  } else {
    console.error(`Failed to send WhatsApp message to ${customer.phone}`);
    throw new Error("WhatsApp service temporarily unavailable");
  }
};

const sendViaSMS = async (customer: CustomerData): Promise<boolean> => {
  console.log(`Sending invoice link to ${customer.name} via SMS: ${customer.phone}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, you would use an SMS service API
  // For demo purposes, we'll simulate a successful SMS
  const sendSuccess = Math.random() > 0.1; // 90% success rate
  
  if (sendSuccess) {
    console.log(`SMS sent successfully to ${customer.phone}`);
    return true;
  } else {
    console.error(`Failed to send SMS to ${customer.phone}`);
    throw new Error("SMS service temporarily unavailable");
  }
};
