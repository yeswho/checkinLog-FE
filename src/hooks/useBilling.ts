import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  generateBill,
  getPrintableBill,
  getBillings,
  getBilling,
  deleteBilling,
  getAllPrintableBill,
} from '../api/billing';
import { Billing, GenerateBillDto, PrintableBill } from '../types/billing';
import { generatePDF } from '../components/Tables/utils';

// Fetch all billings
export const useBillings = () => {
  return useQuery<Billing[]>({
    queryKey: ['billings'],
    queryFn: getBillings,
  });
};

export const useAllPrintableBills = () => {
    return useQuery<PrintableBill[]>({
        queryKey:['printableBills'],
        queryFn: getAllPrintableBill,
    });
};

// Fetch a single billing by ID
export const useBilling = (id: number) => {
  return useQuery<Billing>({
    queryKey: ['billing', id],
    queryFn: () => getBilling(id),
  });
};

// Generate a bill for a booking
export const useGenerateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billData: GenerateBillDto) => generateBill(billData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Bill generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate bill');
    },
  });
};

// Fetch a printable bill by booking ID
export const usePrintableBill = (bookingId: number) => {
  return useQuery<PrintableBill>({
    queryKey: ['printable-bill', bookingId],
    queryFn: () => getPrintableBill(bookingId),
  });
};

// Delete a billing
export const useDeleteBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBilling,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billings'] });
      toast.success('Billing deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete billing');
    },
  });
};


export const useGenerateBillPDF = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      element: HTMLElement;
      fileName: string;
      bill: PrintableBill;
      emailData: { to: string; subject: string; text: string };
    }) => {
      return await toast.promise(
        generatePDF(data.element, data.fileName, data.emailData),
        {
          loading: "Generating PDF and sending email...",
          success: "Bill PDF generated and email sent successfully",
          error: "Failed to generate and send bill PDF",
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to generate and send bill PDF");
    },
  });
};

