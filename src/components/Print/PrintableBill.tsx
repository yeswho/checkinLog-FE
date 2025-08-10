import React from "react";
import type { PrintableBill } from "../../types/billing";

interface PrintableBillProps {
    bill: PrintableBill;
}

const PrintableBillComponent: React.FC<PrintableBillProps> = ({ bill }) => {
    // Format currency with commas
    const formatCurrency = (amount: number) => {
        return `रु. ${amount.toLocaleString('en-IN')}`;
    };

    const calculateTax = () => {
        const taxPercentage = (Number(bill.charges.tax) / Number(bill.charges.totalRoomCharges)) * 100;
        return `${taxPercentage.toFixed(1)}%`;
    };
    
    const calculateVAT = () => {
        const vatPercentage = (Number(bill.charges.vat) / Number(bill.charges.totalRoomCharges)) * 100;
        return `${vatPercentage.toFixed(1)}%`;
    };
    
    const calculateServiceCharge = () => {
        const servicePercentage = (Number(bill.charges.serviceCharge) / Number(bill.charges.totalRoomCharges)) * 100;
        return `${servicePercentage.toFixed(1)}%`;
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="w-full mx-auto bg-white border border-gray-200 shadow-sm print:shadow-none print:bg-white rounded-lg overflow-hidden min-w-md max-w-5xl print:max-w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6">
                <div className="flex flex-col justify-center items-center text-center">
                    <h1 className="text-xl font-bold tracking-tight">Hotel JanakpurInn</h1>
                    <div className="text-blue-100 text-sm mt-1">
                        <span>Ramanad Chowk, Dhanusha, Nepal</span>
                        <span className="mx-2">|</span>
                        <span>janakpurinnhna2023@gmail.com</span>
                        <span className="mx-2">|</span>
                        <span>+977 9766540865</span>
                    </div>
                </div>
            </div>

            {/* Bill Content */}
            <div className="p-5 print:p-4">
                {/* Guest and Stay Info - Two Columns */}
                <div className="flex flex-wrap mb-5 border-b border-gray-200 pb-4">
                    <div className="w-1/2 pr-4">
                        <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Guest Details</h2>
                        <div className="border-l-3 border-blue-600 pl-3">
                            <p className="font-semibold text-base text-gray-900">{bill.customer.name}</p>
                            <p className="text-gray-600 text-sm">{bill.customer.email}</p>
                            <p className="text-gray-600 text-sm">{bill.customer.contact}</p>
                        </div>
                    </div>

                    <div className="w-1/2 pl-4">
                        <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Stay Information</h2>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                            <div className="text-gray-600">Check-In:</div>
                            <div className="font-medium text-gray-900">{formatDate(bill.booking.checkIn)}</div>
                            <div className="text-gray-600">Check-Out:</div>
                            <div className="font-medium text-gray-900">{formatDate(bill.booking.checkOut)}</div>
                            <div className="text-gray-600">Duration:</div>
                            <div className="font-medium text-gray-900">{bill.booking.duration}</div>
                            <div className="text-gray-600">Invoice Date:</div>
                            <div className="font-medium text-gray-900">{formatDate(bill.billing.billingDate)}</div>
                        </div>
                    </div>
                </div>

                {/* Room Details */}
                <div className="mb-5">
                    <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Room Details</h2>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Room</th>
                                    <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Type</th>
                                    <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider text-xs hidden sm:table-cell">Floor</th>
                                    <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider text-xs">Rate</th>
                                    <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider text-xs">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bill.rooms.map((room, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 text-sm">{room.name}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-sm">{room.roomType}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-sm hidden sm:table-cell">{room.floor}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-right text-sm">{formatCurrency(room.rate)}</td>
                                        <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 text-right text-sm">{formatCurrency(room.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Additional Charges Section - Two Columns */}
                <div className="flex flex-wrap mb-5">
                    {/* Food Charges Column */}
                    <div className={`${bill.foodCharges.length > 0 && bill.otherCharges.length > 0 ? 'w-1/2 pr-3' : 'w-full'} ${bill.foodCharges.length === 0 ? 'hidden' : ''}`}>
                        {bill.foodCharges.length > 0 && (
                            <div>
                                <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Food Charges</h2>
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Description</th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider text-xs">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bill.foodCharges.map((food, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-sm">{food.description}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-right text-sm">{formatCurrency(food.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Other Charges Column */}
                    <div className={`${bill.foodCharges.length > 0 && bill.otherCharges.length > 0 ? 'w-1/2 pl-3' : 'w-full'} ${bill.otherCharges.length === 0 ? 'hidden' : ''}`}>
                        {bill.otherCharges.length > 0 && (
                            <div>
                                <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Other Charges</h2>
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Description</th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider text-xs">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bill.otherCharges.map((charge, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-sm">{charge.description}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-right text-sm">{formatCurrency(charge.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary and Notes - Two Columns */}
                <div className="flex flex-wrap">
                    {/* Summary Column */}
                    <div className="w-3/5 pr-4">
                        <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Summary</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <div className="text-gray-600">Room Charges</div>
                                <div className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.totalRoomCharges))}</div>
                                
                                <div className="text-gray-600">Food Charges</div>
                                <div className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.totalFoodCharges))}</div>
                                
                                <div className="text-gray-600">Other Charges</div>
                                <div className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.totalOtherCharges))}</div>
                                
                                <div className="text-gray-600">Tax ({calculateTax()})</div>
                                <div className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.tax))}</div>
                                
                                <div className="text-gray-600">VAT ({calculateVAT()})</div>
                                <div className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.vat))}</div>
                                
                                <div className="text-gray-600">Service ({calculateServiceCharge()})</div>
                                <div className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.serviceCharge))}</div>
                                
                                <div className="text-gray-600">Subtotal</div>
                                <div className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.subtotal))}</div>
                                
                                <div className="text-gray-600">Discount</div>
                                <div className="font-medium text-gray-900 text-right">- {formatCurrency(Number(bill.billing.discount))}</div>
                                
                                <div className="text-gray-600">Extra Charges</div>
                                <div className="font-medium text-gray-900 text-right">+ {formatCurrency(Number(bill.billing.extraCharge))}</div>
                                
                                <div className="font-bold text-gray-900 pt-2 mt-2 border-t border-gray-200">Final Amount</div>
                                <div className="font-bold text-blue-700 text-right pt-2 mt-2 border-t border-gray-200">{formatCurrency(Number(bill.billing.finalAmount))}</div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Column */}
                    <div className="w-2/5 pl-4">
                        <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Notes</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full">
                            {bill.billing.remarks ? (
                                <p className="text-gray-600 text-sm">{bill.billing.remarks}</p>
                            ) : (
                                <p className="text-gray-400 text-sm italic">No additional notes</p>
                            )}
                            <div className="mt-6 pt-3 border-t border-gray-200">
                                <p className="text-center text-gray-500 text-sm">
                                    Thank you for choosing Hotel JanakpurInn.<br />
                                    We hope to welcome you again soon!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintableBillComponent;