// src/hooks/useMenuImport.ts
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../api/client';
import { toast } from 'sonner';
import axios from 'axios';

export const useMenuImport = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axiosClient.post('/menu/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Menu imported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to import menu');
    }
  });
};

export const useMenuTemplateDownload = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosClient.get('/menu/template', {
        responseType: 'blob'
      });
      return response.data;
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'menu_template.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Template downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to download template');
    }
  });
};

export const useRevenueExport = () => {
  return useMutation({
    mutationFn: async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
      const response = await axiosClient.get('/revenue/export', {
        params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
        responseType: 'blob'
      });
      return { data: response.data, startDate, endDate };
    },
    onSuccess: ({ data, startDate, endDate }) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `revenue_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Revenue report exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to export revenue report');
    }
  });
};