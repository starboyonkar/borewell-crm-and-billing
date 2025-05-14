
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { getBillTemplate, updateBillTemplate } from '../utils/pdfGenerator';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [template, setTemplate] = useState(getBillTemplate());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const terms = e.target.value.split('\n').filter(term => term.trim());
    setTemplate(prev => ({ ...prev, termsAndConditions: terms }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBillTemplate(template);
    toast.success('Bill template updated successfully');
  };

  // Only admin users can access this page
  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600">You need administrator privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-borewell-800">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bill Template Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  name="companyName"
                  value={template.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input 
                  id="companyPhone" 
                  name="companyPhone"
                  value={template.companyPhone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input 
                  id="companyAddress" 
                  name="companyAddress"
                  value={template.companyAddress}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input 
                  id="companyEmail" 
                  name="companyEmail"
                  value={template.companyEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input 
                  id="companyWebsite" 
                  name="companyWebsite"
                  value={template.companyWebsite}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="footer">Invoice Footer Message</Label>
                <Input 
                  id="footer" 
                  name="footer"
                  value={template.footer}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
                <Textarea 
                  id="termsAndConditions" 
                  name="termsAndConditions"
                  value={template.termsAndConditions.join('\n')}
                  onChange={handleTermsChange}
                  placeholder="Enter each term on a new line" 
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="submit" 
                className="bg-borewell-600 hover:bg-borewell-700"
              >
                Save Template
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
