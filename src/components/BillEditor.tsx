
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useCustomers } from '@/context/CustomerContext';
import { CustomerData } from '@/context/CustomerContext';
import { convertToWords } from '@/utils/numberToWords';
import { generateQRCodeURL } from '@/utils/qrCodeGenerator';

type BillEditorProps = {
  customer: CustomerData;
};

const BillEditor: React.FC<BillEditorProps> = ({ customer }) => {
  const { updateCustomer } = useCustomers();
  const [isOpen, setIsOpen] = useState(false);
  const [billDetails, setBillDetails] = useState({
    totalAmount: customer.totalAmount,
    taxes: customer.taxes,
    grandTotal: customer.grandTotal,
    paymentStatus: customer.paymentStatus as 'Paid' | 'Pending' | 'Partially Paid',
    paymentMethod: customer.paymentMethod || '',
    notes: customer.notes || '',
    amountInWords: customer.amountInWords || convertToWords(customer.grandTotal),
    qrCodeUrl: customer.qrCodeUrl || generateQRCodeURL(
      customer.billId || 'BW-Unknown', 
      customer.id, 
      customer.grandTotal
    ),
    billId: customer.billId || 'BW-Unknown'
  });

  // Calculate grand total whenever totalAmount or taxes change
  const calculateGrandTotal = (amount: number, tax: number) => {
    return amount + tax;
  };

  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalAmount = parseFloat(e.target.value) || 0;
    const taxes = totalAmount * 0.18; // 18% GST
    const grandTotal = calculateGrandTotal(totalAmount, taxes);
    const amountInWords = convertToWords(grandTotal);
    
    setBillDetails({
      ...billDetails,
      totalAmount,
      taxes,
      grandTotal,
      amountInWords,
    });
  };

  const handleTaxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const taxes = parseFloat(e.target.value) || 0;
    const grandTotal = calculateGrandTotal(billDetails.totalAmount, taxes);
    const amountInWords = convertToWords(grandTotal);
    
    setBillDetails({
      ...billDetails,
      taxes,
      grandTotal,
      amountInWords,
    });
  };

  const handleSave = () => {
    try {
      // Generate new QR code with updated amount
      const qrCodeUrl = generateQRCodeURL(
        billDetails.billId,
        customer.id, 
        billDetails.grandTotal
      );
      
      updateCustomer(customer.id, {
        totalAmount: billDetails.totalAmount,
        taxes: billDetails.taxes,
        grandTotal: billDetails.grandTotal,
        paymentStatus: billDetails.paymentStatus,
        paymentMethod: billDetails.paymentMethod,
        notes: billDetails.notes,
        amountInWords: billDetails.amountInWords,
        qrCodeUrl: qrCodeUrl,
        billId: billDetails.billId
      });
      
      setIsOpen(false);
      toast.success('Bill details updated successfully');
    } catch (error) {
      toast.error('Failed to update bill details');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50">
          Edit Bill Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Bill Details</DialogTitle>
          <DialogDescription>
            Update the billing information for this customer. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="billId">Bill ID</Label>
            <Input
              id="billId"
              value={billDetails.billId}
              readOnly
              className="bg-gray-100"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalAmount">Service Amount (₹)</Label>
              <Input
                id="totalAmount"
                type="number"
                value={billDetails.totalAmount}
                onChange={handleTotalAmountChange}
              />
            </div>
            <div>
              <Label htmlFor="taxes">Taxes (₹)</Label>
              <Input
                id="taxes"
                type="number"
                value={billDetails.taxes}
                onChange={handleTaxesChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="grandTotal">Grand Total (₹)</Label>
            <Input
              id="grandTotal"
              type="number"
              value={billDetails.grandTotal}
              readOnly
              className="bg-gray-100"
            />
          </div>
          
          <div>
            <Label htmlFor="amountInWords">Amount In Words</Label>
            <Input
              id="amountInWords"
              value={billDetails.amountInWords}
              readOnly
              className="bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select 
                value={billDetails.paymentStatus} 
                onValueChange={(value) => setBillDetails({
                  ...billDetails, 
                  paymentStatus: value as 'Paid' | 'Pending' | 'Partially Paid'
                })}
              >
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Input
                id="paymentMethod"
                value={billDetails.paymentMethod}
                onChange={(e) => setBillDetails({ ...billDetails, paymentMethod: e.target.value })}
                placeholder="e.g., Cash, UPI, Bank Transfer"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={billDetails.notes}
              onChange={(e) => setBillDetails({ ...billDetails, notes: e.target.value })}
              placeholder="Add any additional notes about the bill"
              rows={3}
            />
          </div>
          
          <div className="flex justify-center">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Bill Verification QR Code</p>
              <img src={billDetails.qrCodeUrl} alt="Bill QR Code" className="mx-auto" />
              <p className="text-xs text-gray-500 mt-1">Scan to verify bill details</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillEditor;
