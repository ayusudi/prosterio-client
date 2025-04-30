"use client";

import { Button } from "flowbite-react";
import { HiUpload } from "react-icons/hi";

export default function ScanResultZero({
  getRootProps,
  getInputProps,
  isDragActive,
}) {
  return (
    <>
      <p className="text-lg font-semibold mb-2">Upload CVs (PDF format)</p>

      <div
        {...getRootProps()}
        className={`flex items-center justify-between border-2 border-dashed rounded-lg !p-5 text-center cursor-pointer transition-colors 
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
            <p className="text-sm text-gray-500">Limit 200MB per file • PDF</p>
          </div>
        </div>

        <input {...getInputProps()} />
        <Button color="light">Browse files</Button>
      </div>
    </>
  );
}
