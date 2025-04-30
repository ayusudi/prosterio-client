import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { IoIosClose } from "react-icons/io";

export default function ModalDetailEditable({
  files,
  openModal,
  setOpenModal,
  selectedCV,
  setSelectedCV,
}) {
  return (
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
                {selectedCV.data.professional_experiences.map((exp, index) => (
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
                ))}
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
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
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
                        const newCerts = selectedCV.data.certifications.filter(
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
  );
}
