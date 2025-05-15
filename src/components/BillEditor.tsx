
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from '@/hooks/use-toast';
import { useCustomers } from '@/context/CustomerContext';
import { CustomerData } from '@/context/CustomerContext';

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
  });

  // Calculate grand total whenever totalAmount or taxes change
  const calculateGrandTotal = (amount: number, tax: number) => {
    return amount + tax;
  };

  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalAmount = parseFloat(e.target.value) || 0;
    const grandTotal = calculateGrandTotal(totalAmount, billDetails.taxes);
    setBillDetails({
      ...billDetails,
      totalAmount,
      grandTotal,
    });
  };

  const handleTaxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const taxes = parseFloat(e.target.value) || 0;
    const grandTotal = calculateGrandTotal(billDetails.totalAmount, taxes);
    setBillDetails({
      ...billDetails,
      taxes,
      grandTotal,
    });
  };

  const handleSave = () => {
    try {
      updateCustomer(customer.id, {
        totalAmount: billDetails.totalAmount,
        taxes: billDetails.taxes,
        grandTotal: billDetails.grandTotal,
        paymentStatus: billDetails.paymentStatus,
        paymentMethod: billDetails.paymentMethod,
        notes: billDetails.notes,
      });
      
      setIsOpen(false);
      toast({
        title: 'Success',
        description: 'Bill details updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bill details',
        variant: 'destructive',
      });
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
