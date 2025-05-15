
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Mail, Smartphone, Send } from 'lucide-react';
import { sendDigitalInvoice } from '@/utils/invoiceMessaging';
import type { CustomerData } from '@/context/CustomerContext';

type DigitalInvoiceSenderProps = {
  customer: CustomerData;
};

const DigitalInvoiceSender: React.FC<DigitalInvoiceSenderProps> = ({ customer }) => {
  const [channel, setChannel] = useState<'email' | 'whatsapp' | 'sms'>('email');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!customer) {
      toast.error("Customer information not available");
      return;
    }

    // Validate that we have the required contact info for the selected channel
    if ((channel === 'email' && !customer.email) || 
        ((channel === 'whatsapp' || channel === 'sms') && !customer.phone)) {
      toast.error(`Customer ${channel === 'email' ? 'email' : 'phone number'} is required`);
      return;
    }
    
    setSending(true);
    try {
      await sendDigitalInvoice(customer, channel);
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Digital Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Send invoice via:</Label>
          <RadioGroup
            value={channel}
            onValueChange={(value) => setChannel(value as 'email' | 'whatsapp' | 'sms')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" disabled={!customer.email} />
              <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                <Mail size={16} />
                Email
                {customer.email ? ` (${customer.email})` : ' (not provided)'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whatsapp" id="whatsapp" disabled={!customer.phone} />
              <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                <Smartphone size={16} />
                WhatsApp
                {customer.phone ? ` (${customer.phone})` : ' (not provided)'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sms" id="sms" disabled={!customer.phone} />
              <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                <Send size={16} />
                SMS
                {customer.phone ? ` (${customer.phone})` : ' (not provided)'}
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          onClick={handleSend} 
          disabled={sending || 
            (channel === 'email' && !customer.email) || 
            ((channel === 'whatsapp' || channel === 'sms') && !customer.phone)}
          className="w-full"
        >
          {sending ? 'Sending...' : 'Send Invoice'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DigitalInvoiceSender;
