"use client";
import DefaultLayout from "@/components/default-layout";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "flowbite-react";
import { HiUpload } from "react-icons/hi";

export default function Page() {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Filter for PDF files and check size limit
      const pdfFiles = acceptedFiles.filter((file) => {
        const isPDF = file.type === "application/pdf";
        const isUnderLimit = file.size <= 200 * 1024 * 1024; // 200MB
        return isPDF && isUnderLimit;
      });

      // Limit to 3 files
      const totalFiles = [...files, ...pdfFiles].slice(0, 3);
      setFiles(totalFiles);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 200 * 1024 * 1024, // 200MB
    maxFiles: 3,
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <DefaultLayout>
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-lg font-semibold mb-2">Upload CVs (PDF format)</p>

        <div
          {...getRootProps()}
          className={`flex items-center justify-between border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
        >
          <div className="flex items-center gap-2">
            <HiUpload className="h-10 w-10 text-gray-400" />
            <div className="flex flex-col items-start justify-start">
              <p className=" text-lg font-medium">Drag and drop files here</p>
              <p className="text-sm text-gray-500">
                Limit 200MB per file • PDF
              </p>
            </div>
          </div>

          <input {...getInputProps()} />

          <Button color="light">Browse files</Button>
        </div>

        <div className="mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-500">
              Please upload PDF files to extract CV data.
            </p>
            <p className="text-blue-500 mt-1">
              Maximum processing limit is 3 files at a time, each file
              representative as 1 IT Talent.
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-3 mt-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    color="failure"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
