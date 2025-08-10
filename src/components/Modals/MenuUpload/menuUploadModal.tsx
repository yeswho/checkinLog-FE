import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FileUp, Download, X } from "lucide-react";
import { useMenuImport, useMenuTemplateDownload } from "../../../hooks/useImportExport";
import { useState } from "react";
import { toast } from "sonner";

export function MenuUploadModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadMenu = useMenuImport();
  const downloadTemplate = useMenuTemplateDownload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = (onClose: () => void) => {
    if (selectedFile) {
      uploadMenu.mutate(selectedFile, {
        onSuccess: () => {
          setSelectedFile(null);
          onClose();
          toast.success("Menu uploaded successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to upload menu");
        }
      });
    }
  };

  return (
    <>
      <Button 
        color="primary" 
        startContent={<FileUp size={18} />}
        onPress={onOpen}
      >
        Upload Menu
      </Button>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Upload Menu</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="bordered"
                      startContent={<Download size={18} />}
                      onPress={() => downloadTemplate.mutate()}
                      isLoading={downloadTemplate.isPending}
                      fullWidth
                    >
                      Download Template
                    </Button>
                    <p className="text-sm text-default-500">
                      Download and use this template to ensure proper formatting.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <input
                        type="file"
                        id="file-upload"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-default-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        <FileUp className="w-8 h-8 mb-2 text-default-400" />
                        <p className="text-sm font-medium text-default-600">
                          {selectedFile ? selectedFile.name : "Click to select file"}
                        </p>
                        <p className="text-xs text-default-400">
                          {selectedFile ? "" : "Only Excel files (.xlsx, .xls) are accepted"}
                        </p>
                      </label>
                    </div>

                    {selectedFile && (
                      <div className="flex items-center gap-2">
                        <Chip
                          variant="flat"
                          color="primary"
                          endContent={
                            <button onClick={handleRemoveFile}>
                              <X size={14} className="ml-1 text-default-400 hover:text-default-600" />
                            </button>
                          }
                        >
                          {selectedFile.name}
                        </Chip>
                        <span className="text-xs text-default-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleUpload(onClose)}
                  isDisabled={!selectedFile}
                  isLoading={uploadMenu.isPending}
                >
                  Upload Menu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}