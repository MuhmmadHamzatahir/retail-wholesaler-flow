
import React from 'react';
import { Quotation } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface QuotationViewProps {
  quotation: Quotation;
}

const QuotationView: React.FC<QuotationViewProps> = ({ quotation }) => {
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        <div>
          <h1 className="text-2xl font-bold">Quotation #{quotation.id.slice(0, 8)}</h1>
          <p className="text-gray-500">Created on {quotation.createdAt.toLocaleDateString()}</p>
          <div className="mt-1">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(quotation.status)}`}>
              {quotation.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      <Separator />

      {/* Customer & Quotation Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Customer</h3>
          <p className="font-medium">{quotation.customerName}</p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Expiry Date:</span>
            <span>{quotation.expiryDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Items */}
      <div>
        <h3 className="text-sm font-medium mb-3">Items</h3>
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{item.productName}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-4">${item.tax.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} rowSpan={4} className="py-3 px-4">
                    {quotation.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Notes:</p>
                        <p className="text-sm">{quotation.notes}</p>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 text-sm font-medium text-gray-500">Subtotal</td>
                  <td className="py-2 px-4 text-right">${quotation.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm font-medium text-gray-500">Tax</td>
                  <td className="py-2 px-4 text-right">${quotation.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm font-medium text-gray-500">Discount</td>
                  <td className="py-2 px-4 text-right">${quotation.discount.toFixed(2)}</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 px-4 text-base font-bold">Total</td>
                  <td className="py-2 px-4 text-right text-base font-bold">${quotation.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-500">
        <p>This quotation is valid until {quotation.expiryDate.toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default QuotationView;
