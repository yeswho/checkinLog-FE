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
        // Calculate the percentage of tax
        const taxPercentage = (Number(bill.charges.tax) / Number(bill.charges.totalRoomCharges)) * 100;
        return `${taxPercentage.toFixed(1)}%`;
    };
    
    const calculateVAT = () => {
        // Calculate the percentage of VAT
        const vatPercentage = (Number(bill.charges.vat) / Number(bill.charges.totalRoomCharges)) * 100;
        return `${vatPercentage.toFixed(1)}%`;
    };
    
    const calculateServiceCharge = () => {
        // Calculate the percentage of service charge
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
        <div className="w-full mx-auto bg-white border border-gray-200 shadow-sm print:shadow-none print:bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4">
                <div className="flex flex-col justify-center items-center text-center">
                    <h1 className="text-xl font-bold tracking-tight">Hotel JanakpurInn</h1>
                    <p className="text-blue-100 text-sm mt-1">Ramanad Chowk, Dhanusha, Nepal</p>
                    <p className="text-blue-100 text-sm">janakpurinnhna2023@gmail.com | +977 9766540865</p>
                </div>
            </div>

            {/* Bill Content */}
            <div className="p-4 sm:p-5">
                {/* Customer and Booking Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    <div>
                        <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Guest Details</h2>
                        <div className="border-l-3 border-blue-600 pl-3">
                            <p className="font-semibold text-base text-gray-900">{bill.customer.name}</p>
                            <p className="text-gray-600 text-sm">{bill.customer.email}</p>
                            <p className="text-gray-600 text-sm">{bill.customer.contact}</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Stay Information</h2>
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
                    <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Room Details</h2>
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
                                        <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 text-xs sm:text-sm">{room.name}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-xs sm:text-sm">{room.roomType}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-xs sm:text-sm hidden sm:table-cell">{room.floor}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-right text-xs sm:text-sm">{formatCurrency(room.rate)}</td>
                                        <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 text-right text-xs sm:text-sm">{formatCurrency(room.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Charges and Billing */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                    <div className="md:col-span-2 order-2 md:order-1">
                        {bill.billing.remarks && (
                            <div className="mb-2">
                                <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Notes</h2>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                                    <p className="text-gray-600 text-xs sm:text-sm">{bill.billing.remarks}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-3 order-1 md:order-2">
                        <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Summary</h2>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 text-xs sm:text-sm">
                                <div className="col-span-2 grid grid-cols-2 py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Room Charges</span>
                                    <span className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.totalRoomCharges))}</span>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Tax ({calculateTax()})</span>
                                    <span className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.tax))}</span>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 py-2 border-b border-gray-200">
                                    <span className="text-gray-600">VAT ({calculateVAT()})</span>
                                    <span className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.vat))}</span>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Service ({calculateServiceCharge()})</span>
                                    <span className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.serviceCharge))}</span>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900 text-right">{formatCurrency(Number(bill.charges.subtotal))}</span>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-medium text-gray-900 text-right">- {formatCurrency(Number(bill.billing.discount))}</span>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Extra Charges</span>
                                    <span className="font-medium text-gray-900 text-right">+ {formatCurrency(Number(bill.billing.extraCharge))}</span>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 py-3 mt-1">
                                    <span className="font-bold text-gray-900">Final Amount</span>
                                    <span className="font-bold text-blue-700 text-right">{formatCurrency(Number(bill.billing.finalAmount))}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-5 mt-5 border-t border-gray-200 text-center text-gray-500 text-xs">
                    <p>Thank you for choosing Hotel JanakpurInn. We hope to welcome you again soon!</p>
                </div>
            </div>
        </div>
    );
};

export default PrintableBillComponent;