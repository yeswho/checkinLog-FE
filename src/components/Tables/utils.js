import html2pdf from "html2pdf.js";
import axiosClient from '../../api/client';

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  

  export const generatePDF = async (element, fileName, bill) => {
    try {
      // Step 1: Generate PDF
      const pdfData = await new Promise((resolve, reject) => {
        const options = {
          margin: 10,
          filename: fileName,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };
  
        html2pdf()
          .from(element)
          .set(options)
          .toPdf()
          .get("pdf")
          .then((pdf) => {
            const pdfBlob = pdf.output("blob");
            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = () => {
              resolve(reader.result);
            };
          })
          .catch((error) => {
            reject(error);
          });
      });
  
      // Step 2: Send Email with PDF Attachment
      const response = await axiosClient.post("/send-email", {
        to: bill.customer.email,
        subject: "Your Bill from Hotel JanakpurInn",
        text: "Please find your bill attached.",
        pdfData,
      });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };
