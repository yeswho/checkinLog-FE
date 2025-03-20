import html2pdf from "html2pdf.js";
import axiosClient from '../../api/client';

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  

  export const generatePDF = async (element, fileName, emailData) => {
    try {
      // Step 1: Generate PDF as Blob
      const pdfBlob = await new Promise((resolve, reject) => {
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
            resolve(pdf.output("blob"));
          })
          .catch((error) => {
            reject(error);
          });
      });
  
      // Step 2: Prepare FormData
      const formData = new FormData();
      formData.append("to", emailData.to);
      formData.append("subject", emailData.subject);
      formData.append("text", emailData.text);
      formData.append("pdfFile", pdfBlob, fileName);
  
      // Step 3: Send Email with PDF Attachment
      const response = await axiosClient.post("/billings/email", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
