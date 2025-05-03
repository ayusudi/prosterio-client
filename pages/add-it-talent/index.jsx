import DefaultLayout from "@/components/default-layout";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "@/service/api";
import { IoTrashBin } from "react-icons/io5";
import { Button } from "flowbite-react";
import { HiUpload } from "react-icons/hi";
import HeaderForFileUploaded from "./_components/header-for-file-uploaded";
import Header from "./_components/header";
import ModalDetailEditable from "./_components/modal-detail-editable";
import isAuth from "@/components/is-auth";
import { useRouter } from "next/router";
function Page() {
  const router = useRouter();
  const [scanResults, setScanResults] = useState([]);
  const [emailStatuses, setEmailStatuses] = useState({});
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Filter for PDF files and check size limit
      const pdfFiles = acceptedFiles.filter((file) => {
        const isPDF = file.type === "application/pdf";
        const isUnderLimit = file.size <= 200 * 1024 * 1024; // 200MB
        return isPDF && isUnderLimit;
      });

      // Limit to 3 files
      const totalFiles = [...files, ...pdfFiles];
      setFiles(totalFiles);
    },
    [files]
  );
  const [counter, setCounter] = useState({
    new: [],
    update: [],
  });
  const [selectedCV, setSelectedCV] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenCV = (cv) => {
    setSelectedCV(cv);
    setOpenModal(true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 200 * 1024 * 1024, // 200MB
    maxFiles: 10,
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeScanResults = (emp, index) => {
    // Also remove the email status for this CV
    const newEmailStatuses = { ...emailStatuses };
    delete newEmailStatuses[emp.data.email];
    let arrBoolean = Object.entries(newEmailStatuses);
    setCounter({
      new: arrBoolean.filter((item) => item[1] === true).map((el) => el[0]),
      update: arrBoolean.filter((item) => item[1] === false).map((el) => el[0]),
    });
    setEmailStatuses(newEmailStatuses);
    setScanResults(scanResults.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("documents", file);
      });

      const { data } = await api.post("/api/documents", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      let arrBoolean = Object.entries(data.email_status);
      setCounter({
        new: arrBoolean.filter((item) => item[1] === true).map((el) => el[0]),
        update: arrBoolean
          .filter((item) => item[1] === false)
          .map((el) => el[0]),
      });
      setScanResults(data.data);
      setEmailStatuses(data.email_status);
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle error appropriately (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  const submit = async () => {
    try {
      setIsLoading(true);
      // First, process all files asynchronously
      const processedEmployees = await Promise.all(
        scanResults.map(async (employee) => {
          let file = files.find((file) => file.name === employee.filename);
          if (file) {
            try {
              // Send file to backend for processing
              const formData = new FormData();
              formData.append("file", file);
              formData.append("file_name", file.name);

              const response = await api.post("/api/gdrive", formData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "multipart/form-data",
                },
              });
              return {
                ...employee,
                file_url: response.data.web_view_link,
              };
            } catch (error) {
              console.error("Error processing file:", error);
            }
          }
        })
      );

      // Map all scan results to the required API format
      const payload = {
        employees: processedEmployees.map((employee) => ({
          full_name: employee.data.full_name,
          email: employee.data.email,
          job_title: employee.data.job_title,
          promotion_years: employee.data.promotion_years,
          profile: employee.data.profile,
          skills: employee.data.skills || [],
          professional_experiences:
            employee.data.professional_experiences || [],
          educations: employee.data.education || [],
          publications: employee.data.publications || [],
          distinctions: employee.data.distinctions || [],
          certifications: employee.data.certifications || [],
          file_url: employee.file_url,
        })),
        new_emails: counter.new,
        update_emails: counter.update,
      };
      const { data } = await api.post("/api/employees", payload, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      // Update email statuses based on response
      if (data.results && data.results.length > 0) {
        const newEmailStatuses = { ...emailStatuses };
        data.results.forEach((result) => {
          if (result.status === "success") {
            newEmailStatuses[result.email] = true;
          }
        });
        setEmailStatuses(newEmailStatuses);

        // Update counter
        const arrBoolean = Object.entries(newEmailStatuses);
        setCounter({
          new: arrBoolean.filter((item) => item[1] === true).map((el) => el[0]),
          update: arrBoolean
            .filter((item) => item[1] === false)
            .map((el) => el[0]),
        });
        // Clear scan results after successful submission
        setScanResults([]);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto py-6">
        {scanResults.length === 0 && (
          <>
            <p className="text-lg font-semibold mb-2">
              Upload CVs (PDF format)
            </p>

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
                  <p className=" text-lg font-medium">
                    Drag and drop files here
                  </p>
                  <p className="text-sm text-gray-500">
                    Limit 200MB per file • PDF
                  </p>
                </div>
              </div>

              <input {...getInputProps()} />
              <Button color="light">Browse files</Button>
            </div>
          </>
        )}

        <div className="mt-5.5">
          {scanResults.length === 0 && files.length > 0 ? (
            <HeaderForFileUploaded
              files={files}
              isLoading={isLoading}
              processFiles={processFiles}
            />
          ) : (
            <Header />
          )}
          {(scanResults.length && (
            <div className="flex items-center justify-between">
              {counter.new.length > 0 ? (
                <p className="text-md font-bold text-gray-800 ml-1">
                  {counter.new.length} New IT Talent{" "}
                  {counter.update.length > 0 ? "and" : ""}{" "}
                  {counter.update.length > 0
                    ? `${counter.update.length} IT Talent ${
                        counter.update.length > 1 ? "s" : ""
                      }`
                    : ""}
                </p>
              ) : (
                <p>
                  Update {counter.update.length} IT Talent{" "}
                  {counter.update.length > 1 ? "s" : ""}
                </p>
              )}

              <Button
                color="blue"
                size="md"
                onClick={submit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating..
                  </>
                ) : (
                  "Update IT Talent"
                )}
              </Button>
            </div>
          )) || <></>}

          {scanResults.length === 0 && files.length > 0 && (
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
          {scanResults.length > 0 && (
            <div className="space-y-3 mt-4">
              {scanResults.map((emp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="text-sm">
                      <div className="flex gap-1">
                        <p className="font-medium">{emp.data.full_name} </p>
                        {!emailStatuses[emp.data.email] ? (
                          <span className="text-green-500 font-semibold">
                            (New)
                          </span>
                        ) : (
                          ""
                        )}
                      </div>

                      <p className="text-gray-500">{emp.data.email}</p>
                      <p className="text-gray-500">{emp.data.job_title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      color="light"
                      onClick={() => handleOpenCV(emp)}
                    >
                      Open & Edit
                    </Button>
                    <Button
                      size="sm"
                      color="gray"
                      className="bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      onClick={() => removeScanResults(emp, index)}
                    >
                      <IoTrashBin />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ModalDetailEditable
        files={files}
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedCV={selectedCV}
        setSelectedCV={setSelectedCV}
      />
    </DefaultLayout>
  );
}

export default isAuth(Page);
