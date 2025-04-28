"use client";
import DefaultLayout from "@/components/default-layout";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Modal, ModalHeader, ModalBody } from "flowbite-react";
import { HiUpload } from "react-icons/hi";
import api from "@/service/api";
import { IoIosClose } from "react-icons/io";
import { IoTrashBin } from "react-icons/io5";

export default function Page() {
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
    new: [
      "nadia.frontdev@gmail.com",
      "intan.ba@gmail.com",
      "rafi.alamsyah@gmail.com",
    ],
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
          let file_data = null;
          if (file) {
            try {
              const arrayBuffer = await file.arrayBuffer();
              file_data = btoa(
                String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))
              );
            } catch (error) {
              console.error("Error converting file to base64:", error);
            }
          }
          return {
            ...employee,
            file_data,
          };
        })
      );

      // Map all scan results to the required API format
      const payload = {
        employees: processedEmployees.map((employee) => ({
          full_name: employee.data.full_name,
          email: employee.data.email,
          job_title: employee.data.job_title,
          profile: employee.data.profile,
          skills: employee.data.skills,
          professional_experiences: employee.data.professional_experiences,
          educations: employee.data.educations,
          publications: employee.data.publications || [],
          distinctions: employee.data.distinctions || [],
          certifications: employee.data.certifications || [],
          file_data: employee.file_data,
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
      }
    } catch (error) {
      console.error("Error submitting employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-3xl mx-auto p-6">
        {scanResults.length === 0 && (
          <>
            <p className="text-lg font-semibold mb-2">
              Upload CVs (PDF format)
            </p>

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

        <div className="mt-6">
          {scanResults.length === 0 && files.length > 0 ? (
            <div className="flex items-center justify-between">
              <p className="text-md font-bold text-gray-800 ml-1">
                {files.length} files CV
              </p>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white w-24 py-2 rounded-full cursor-pointer"
                onClick={processFiles}
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
                    Scanning...
                  </>
                ) : (
                  "Scan"
                )}
              </Button>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-500">
                Please upload PDF files to extract CV data.
              </p>
              <p className="text-blue-500 mt-1">
                Maximum processing limit is 10 files at a time, each file
                representative as 1 IT Talent.
              </p>
            </div>
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
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="overflow-y-auto"
      >
        <ModalHeader>CV Details</ModalHeader>
        <ModalBody className="overflow-y-auto">
          {selectedCV && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    value={selectedCV.data.full_name}
                    onChange={(e) => {
                      setSelectedCV({
                        ...selectedCV,
                        data: {
                          ...selectedCV.data,
                          full_name: e.target.value,
                        },
                      });
                    }}
                    className="border-none focus:ring-0 text-xl font-bold bg-transparent w-full"
                  />
                  <Button
                    size="sm"
                    color="gray"
                    className="w-24 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={() => {
                      const file = files.find(
                        (f) => f.name === selectedCV.filename
                      );
                      if (file) {
                        // Create blob from the file with PDF MIME type
                        const blob = new Blob([file], {
                          type: "application/pdf",
                        });
                        const url = URL.createObjectURL(blob);
                        window.open(url, "_blank");
                        // Clean up the URL object after opening
                        URL.revokeObjectURL(url);
                      } else {
                        // Fallback to API endpoint if file not found in state
                        const fileUrl = `/api/documents/${selectedCV.filename}`;
                        window.open(fileUrl, "_blank");
                      }
                    }}
                  >
                    View PDF
                  </Button>
                </div>
                <p className="cursor-not-allowed border-none focus:ring-0 text-gray-600 bg-transparent w-full">
                  {selectedCV.data.email}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Profile</h4>
                <textarea
                  value={selectedCV.data.profile}
                  onChange={(e) => {
                    setSelectedCV({
                      ...selectedCV,
                      data: {
                        ...selectedCV.data,
                        profile: e.target.value,
                      },
                    });
                  }}
                  rows={4}
                  className="w-full focus:border rounded-md p-2 text-gray-700 bg-transparent"
                />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCV.data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const newSkills = [...selectedCV.data.skills];
                            newSkills[index] = e.target.value;
                            setSelectedCV({
                              ...selectedCV,
                              data: {
                                ...selectedCV.data,
                                skills: newSkills,
                              },
                            });
                          }}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 pr-8 rounded-full border-none focus:ring-0 w-full"
                        />
                        <button
                          onClick={() => {
                            const newSkills = selectedCV.data.skills.filter(
                              (_, i) => i !== index
                            );
                            setSelectedCV({
                              ...selectedCV,
                              data: {
                                ...selectedCV.data,
                                skills: newSkills,
                              },
                            });
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-700"
                        >
                          <IoIosClose />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedCV({
                        ...selectedCV,
                        data: {
                          ...selectedCV.data,
                          skills: [...selectedCV.data.skills, ""],
                        },
                      });
                    }}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-semibold mb-2">Professional Experience</h4>
                <div className="">
                  {selectedCV.data.professional_experiences.map(
                    (exp, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-200 pl-4 py-1"
                      >
                        <div className="flex justify-between items-center">
                          <input
                            placeholder="Job Title"
                            type="text"
                            value={exp.job_title}
                            onChange={(e) => {
                              const newExps = [
                                ...selectedCV.data.professional_experiences,
                              ];
                              newExps[index] = {
                                ...exp,
                                job_title: e.target.value,
                              };
                              setSelectedCV({
                                ...selectedCV,
                                data: {
                                  ...selectedCV.data,
                                  professional_experiences: newExps,
                                },
                              });
                            }}
                            className="pl-1.5 font-medium border-none focus:ring-0 bg-transparent w-full"
                          />
                          <button
                            onClick={() => {
                              const newExps =
                                selectedCV.data.professional_experiences.filter(
                                  (_, i) => i !== index
                                );
                              setSelectedCV({
                                ...selectedCV,
                                data: {
                                  ...selectedCV.data,
                                  professional_experiences: newExps,
                                },
                              });
                            }}
                            className="w-60 text-red-500 hover:text-red-700 mt-2"
                          >
                            Remove Experience
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            placeholder="Company Name"
                            type="text"
                            value={exp.company || ""}
                            onChange={(e) => {
                              const newExps = [
                                ...selectedCV.data.professional_experiences,
                              ];
                              newExps[index] = {
                                ...exp,
                                company: e.target.value,
                              };
                              setSelectedCV({
                                ...selectedCV,
                                data: {
                                  ...selectedCV.data,
                                  professional_experiences: newExps,
                                },
                              });
                            }}
                            className="w-40 pl-1.5 text-gray-600 border-none focus:ring-0 bg-transparent"
                          />
                          <span className="text-gray-600">|</span>
                          <input
                            type="text"
                            value={exp.date_start || ""}
                            onChange={(e) => {
                              const newExps = [
                                ...selectedCV.data.professional_experiences,
                              ];
                              newExps[index] = {
                                ...exp,
                                date_start: e.target.value,
                              };
                              setSelectedCV({
                                ...selectedCV,
                                data: {
                                  ...selectedCV.data,
                                  professional_experiences: newExps,
                                },
                              });
                            }}
                            className="w-22 pl-1.5 text-gray-600 border-none focus:ring-0 bg-transparent"
                            placeholder="Start"
                          />
                          <span className="text-gray-600">-</span>
                          <input
                            type="text"
                            value={exp.date_end || ""}
                            onChange={(e) => {
                              const newExps = [
                                ...selectedCV.data.professional_experiences,
                              ];
                              newExps[index] = {
                                ...exp,
                                date_end: e.target.value,
                              };
                              setSelectedCV({
                                ...selectedCV,
                                data: {
                                  ...selectedCV.data,
                                  professional_experiences: newExps,
                                },
                              });
                            }}
                            className="w-22 pl-1.5 text-gray-600 border-none focus:ring-0 bg-transparent"
                            placeholder="End"
                          />
                        </div>
                        <textarea
                          placeholder="Short job description"
                          value={
                            Array.isArray(exp.description)
                              ? exp.description.join("\n")
                              : exp.description
                          }
                          onChange={(e) => {
                            const newExps = [
                              ...selectedCV.data.professional_experiences,
                            ];
                            newExps[index] = {
                              ...exp,
                              description: Array.isArray(exp.description)
                                ? e.target.value.split("\n")
                                : e.target.value,
                            };
                            setSelectedCV({
                              ...selectedCV,
                              data: {
                                ...selectedCV.data,
                                professional_experiences: newExps,
                              },
                            });
                          }}
                          rows={3}
                          className="w-full focus:border rounded-md p-2 mt-1 text-gray-700 bg-transparent"
                        />
                      </div>
                    )
                  )}
                  <button
                    onClick={() => {
                      setSelectedCV({
                        ...selectedCV,
                        data: {
                          ...selectedCV.data,
                          professional_experiences: [
                            ...selectedCV.data.professional_experiences,
                            {
                              title: "",
                              company: "",
                              date_start: "",
                              date_end: "",
                              description: "",
                            },
                          ],
                        },
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    + Add Experience
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-semibold mb-2">Education</h4>
                {selectedCV.data.educations.map((edu, index) => (
                  <div key={index} className="flex flex-col gap-0.5 mb-4">
                    <div className="flex justify-between">
                      <input
                        type="text"
                        placeholder="Degree or Course Name"
                        value={edu.title}
                        onChange={(e) => {
                          const newEdus = [...selectedCV.data.educations];
                          newEdus[index] = { ...edu, title: e.target.value };
                          setSelectedCV({
                            ...selectedCV,
                            data: {
                              ...selectedCV.data,
                              educations: newEdus,
                            },
                          });
                        }}
                        className="font-medium border-none focus:ring-0 bg-transparent w-full"
                      />
                      <button
                        onClick={() => {
                          const newEdus = selectedCV.data.educations.filter(
                            (_, i) => i !== index
                          );
                          setSelectedCV({
                            ...selectedCV,
                            data: {
                              ...selectedCV.data,
                              educations: newEdus,
                            },
                          });
                        }}
                        className="w-60 text-red-500 hover:text-red-700 mt-2"
                      >
                        Remove Education
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Institution Name"
                        value={edu.institution}
                        onChange={(e) => {
                          const newEdus = [...selectedCV.data.educations];
                          newEdus[index] = {
                            ...edu,
                            institution: e.target.value,
                          };
                          setSelectedCV({
                            ...selectedCV,
                            data: {
                              ...selectedCV.data,
                              educations: newEdus,
                            },
                          });
                        }}
                        className="text-gray-600 border-none focus:ring-0 bg-transparent"
                      />
                      <span className="text-gray-600">|</span>
                      <input
                        type="text"
                        placeholder="Start"
                        value={edu.date_start || edu.date_start || ""}
                        onChange={(e) => {
                          const newEdus = [...selectedCV.data.educations];
                          newEdus[index] = {
                            ...edu,
                            date_start: e.target.value,
                            date_start: e.target.value,
                          };
                          setSelectedCV({
                            ...selectedCV,
                            data: {
                              ...selectedCV.data,
                              educations: newEdus,
                            },
                          });
                        }}
                        className="w-14 pl-1 text-gray-600 border-none focus:ring-0 bg-transparent"
                      />
                      <span className="text-gray-600">-</span>
                      <input
                        placeholder="End"
                        type="text"
                        value={edu.date_end || edu.date_end || ""}
                        onChange={(e) => {
                          const newEdus = [...selectedCV.data.educations];
                          newEdus[index] = {
                            ...edu,
                            date_end: e.target.value,
                            date_end: e.target.value,
                          };
                          setSelectedCV({
                            ...selectedCV,
                            data: {
                              ...selectedCV.data,
                              educations: newEdus,
                            },
                          });
                        }}
                        className="w-14 pl-1 text-gray-600 border-none focus:ring-0 bg-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Your Score / Max Score"
                        value={edu.score}
                        onChange={(e) => {
                          const newEdus = [...selectedCV.data.educations];
                          newEdus[index] = { ...edu, score: e.target.value };
                          setSelectedCV({
                            ...selectedCV,
                            data: {
                              ...selectedCV.data,
                              educations: newEdus,
                            },
                          });
                        }}
                        className="text-gray-600 border-none focus:ring-0 bg-transparent"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setSelectedCV({
                      ...selectedCV,
                      data: {
                        ...selectedCV.data,
                        educations: [
                          ...selectedCV.data.educations,
                          {
                            degree: "",
                            institution: "",
                            date_start: "",
                            date_end: "",
                            gpa: "",
                          },
                        ],
                      },
                    });
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  + Add Education
                </button>
              </div>

              <div className="pt-4">
                <h4 className="font-semibold mb-2">Promotion Year</h4>
                <input
                  type="number"
                  placeholder="Year you started working professionally"
                  value={selectedCV.data.promotion_years || ""}
                  onChange={(e) => {
                    setSelectedCV({
                      ...selectedCV,
                      data: {
                        ...selectedCV.data,
                        promotion_years: e.target.value,
                      },
                    });
                  }}
                  className="w-full border rounded-md p-2 text-gray-700 bg-transparent"
                />
              </div>

              <div className="pt-4">
                <h4 className="font-semibold mb-2">Distinctions</h4>
                <div className="">
                  {selectedCV.data.distinctions.map((distinction, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-gray-200 pl-4 flex flex-col gap-0.5 "
                    >
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          placeholder="Distinction Name"
                          value={distinction.name}
                          onChange={(e) => {
                            const newDistinctions = [
                              ...selectedCV.data.distinctions,
                            ];
                            newDistinctions[index] = {
                              ...distinction,
                              name: e.target.value,
                            };
                            setSelectedCV({
                              ...selectedCV,
                              data: {
                                ...selectedCV.data,
                                distinctions: newDistinctions,
                              },
                            });
                          }}
                          className="font-medium border-none focus:ring-0 bg-transparent w-full"
                        />
                        <button
                          onClick={() => {
                            const newDistinctions =
                              selectedCV.data.distinctions.filter(
                                (_, i) => i !== index
                              );
                            setSelectedCV({
                              ...selectedCV,
                              data: {
                                ...selectedCV.data,
                                distinctions: newDistinctions,
                              },
                            });
                          }}
                          className="w-60 text-red-500 hover:text-red-700 mt-2"
                        >
                          Remove Distinction
                        </button>
                      </div>
                      <textarea
                        placeholder="Description of the distinction"
                        value={distinction.description}
                        onChange={(e) => {
                          const newDistinctions = [
                            ...selectedCV.data.distinctions,
                          ];
                          newDistinctions[index] = {
                            ...distinction,
                            description: e.target.value,
                          };
                          setSelectedCV({
                            ...selectedCV,
                            data: {
                              ...selectedCV.data,
                              distinctions: newDistinctions,
                            },
                          });
                        }}
                        rows={2}
                        className="w-full focus:border rounded-md p-2 mt-1 text-gray-700 bg-transparent"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedCV({
                        ...selectedCV,
                        data: {
                          ...selectedCV.data,
                          distinctions: [
                            ...selectedCV.data.distinctions,
                            { name: "", description: "" },
                          ],
                        },
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    + Add Distinction
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-semibold mb-2">Publications</h4>
                <div className="">
                  {selectedCV.data.publications.map((publication, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-gray-200 pl-4"
                    >
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          placeholder="Publication Title"
                          value={publication.title || publication}
                          onChange={(e) => {
                            const newPublications = [
                              ...selectedCV.data.publications,
                            ];
                            if (typeof publication === "string") {
                              newPublications[index] = e.target.value;
                            } else {
                              newPublications[index] = {
                                ...publication,
                                title: e.target.value,
                              };
                            }
                            setSelectedCV({
                              ...selectedCV,
                              data: {
                                ...selectedCV.data,
                                publications: newPublications,
                              },
                            });
                          }}
                          className="font-medium border-none focus:ring-0 bg-transparent w-full"
                        />
                        <button
                          onClick={() => {
                            const newPublications =
                              selectedCV.data.publications.filter(
                                (_, i) => i !== index
                              );
                            setSelectedCV({
                              ...selectedCV,
                              data: {
                                ...selectedCV.data,
                                publications: newPublications,
                              },
                            });
                          }}
                          className="w-60 text-red-500 hover:text-red-700 mt-2"
                        >
                          Remove Publication
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedCV({
                        ...selectedCV,
                        data: {
                          ...selectedCV.data,
                          publications: [...selectedCV.data.publications, ""],
                        },
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    + Add Publication
                  </button>
                </div>
              </div>

              <div className="py-4">
                <h4 className="font-semibold mb-2">Certifications</h4>
                <ul className="space-y-2">
                  {selectedCV.data.certifications.map((cert, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => {
                          const newCerts = [...selectedCV.data.certifications];
                          newCerts[index] = e.target.value;
                          setSelectedCV({
                            ...selectedCV,
                            data: {
                              ...selectedCV.data,
                              certifications: newCerts,
                            },
                          });
                        }}
                        className="text-gray-700 border-none focus:ring-0 bg-transparent w-full"
                      />
                      <button
                        onClick={() => {
                          const newCerts =
                            selectedCV.data.certifications.filter(
                              (_, i) => i !== index
                            );
                          setSelectedCV({
                            ...selectedCV,
                            data: {
                              ...selectedCV.data,
                              certifications: newCerts,
                            },
                          });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setSelectedCV({
                      ...selectedCV,
                      data: {
                        ...selectedCV.data,
                        certifications: [...selectedCV.data.certifications, ""],
                      },
                    });
                  }}
                  className="text-blue-600 hover:text-blue-800 mt-2"
                >
                  + Add Certification
                </button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </DefaultLayout>
  );
}
