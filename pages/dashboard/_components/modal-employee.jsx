import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "flowbite-react";
import { IoIosClose } from "react-icons/io";
import { useState, useEffect } from "react"; // Added missing import
import api from "@/service/api";

export default function ModalDetailEditable({ setId, id, fetchData }) {
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState({
    certifications: [],
    distinctions: [],
    educations: [],
    email: "",
    file_url: null,
    full_name: "",
    id: null,
    job_title: "",
    professional_experiences: [],
    profile: "",
    promotion_years: null,
    publications: [],
    skills: [],
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await api.get(`/api/employees/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSelectedEmployee(response.data);
        setSelectedCV(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        console.error("Error fetching CV:", error);
      }
    };
    fetchCV();
  }, [id]);

  useEffect(() => {
    // Fix: Use deep comparison or specific property checks instead of reference comparison
    if (
      selectedCV &&
      selectedEmployee &&
      JSON.stringify(selectedCV) !== JSON.stringify(selectedEmployee)
    ) {
      setIsEdit(true);
    }
  }, [id]);

  const handleSave = async () => {
    try {
      let input = { ...selectedCV };
      delete input.file_url;
      delete input.id;
      const response = await api.put(`/api/employees/${selectedCV.id}`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchData();
      setId(null);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <Modal show={id} onClose={() => setId(null)} className="overflow-y-auto">
      <ModalHeader>CV Details</ModalHeader>
      <ModalBody className="overflow-y-auto  max-h-[80dvh]">
        {isLoading ? (
          <div className="flex justify-center items-center h-[50dvh]">
            <div className="animate-spin rounded-full h-20 w-20 border-t-12 border-b-12 border-blue-900 "></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  value={selectedCV.full_name}
                  onChange={(e) => {
                    setSelectedCV({
                      ...selectedCV,
                      full_name: e.target.value,
                    });
                  }}
                  className="border-none focus:ring-0 text-xl font-bold bg-transparent w-full"
                />
                <Button
                  size="sm"
                  color="gray"
                  className="w-30 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={() => {
                    window.open(selectedCV.file_url, "_blank");
                  }}
                >
                  View PDF
                </Button>
              </div>
              <p className="cursor-not-allowed border-none focus:ring-0 text-gray-600 bg-transparent w-full">
                {selectedCV.email}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Profile</h4>
              <textarea
                value={selectedCV.profile}
                onChange={(e) => {
                  setSelectedCV({
                    ...selectedCV,
                    profile: e.target.value,
                  });
                }}
                rows={4}
                className="w-full focus:border rounded-md p-2 text-gray-700 bg-transparent"
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCV.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...selectedCV.skills];
                          newSkills[index] = e.target.value;
                          setSelectedCV({
                            ...selectedCV,
                            skills: newSkills,
                          });
                        }}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 pr-8 rounded-full border-none focus:ring-0 w-full"
                      />
                      <button
                        onClick={() => {
                          const newSkills = selectedCV.skills.filter(
                            (_, i) => i !== index
                          );
                          setSelectedCV({
                            ...selectedCV,
                            skills: newSkills,
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
                      skills: [...selectedCV.skills, ""],
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
                {selectedCV.professional_experiences.map((exp, index) => (
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
                            ...selectedCV.professional_experiences,
                          ];
                          newExps[index] = {
                            ...exp,
                            job_title: e.target.value,
                          };
                          setSelectedCV({
                            ...selectedCV,
                            professional_experiences: newExps,
                          });
                        }}
                        className="pl-1.5 font-medium border-none focus:ring-0 bg-transparent w-full"
                      />
                      <button
                        onClick={() => {
                          const newExps =
                            selectedCV.professional_experiences.filter(
                              (_, i) => i !== index
                            );
                          setSelectedCV({
                            ...selectedCV,
                            professional_experiences: newExps,
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
                            ...selectedCV.professional_experiences,
                          ];
                          newExps[index] = {
                            ...exp,
                            company: e.target.value,
                          };
                          setSelectedCV({
                            ...selectedCV,
                            professional_experiences: newExps,
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
                            ...selectedCV.professional_experiences,
                          ];
                          newExps[index] = {
                            ...exp,
                            date_start: e.target.value,
                          };
                          setSelectedCV({
                            ...selectedCV,
                            professional_experiences: newExps,
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
                            ...selectedCV.professional_experiences,
                          ];
                          newExps[index] = {
                            ...exp,
                            date_end: e.target.value,
                          };
                          setSelectedCV({
                            ...selectedCV,
                            professional_experiences: newExps,
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
                          ...selectedCV.professional_experiences,
                        ];
                        newExps[index] = {
                          ...exp,
                          description: Array.isArray(exp.description)
                            ? e.target.value.split("\n")
                            : e.target.value,
                        };
                        setSelectedCV({
                          ...selectedCV,
                          professional_experiences: newExps,
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
                      professional_experiences: [
                        ...selectedCV.professional_experiences,
                        {
                          title: "",
                          company: "",
                          date_start: "",
                          date_end: "",
                          description: "",
                        },
                      ],
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
              {selectedCV.educations.map((edu, index) => (
                <div key={index} className="flex flex-col gap-0.5 mb-4">
                  <div className="flex justify-between">
                    <input
                      type="text"
                      placeholder="Degree or Course Name"
                      value={edu.title}
                      onChange={(e) => {
                        const newEdus = [...selectedCV.educations];
                        newEdus[index] = { ...edu, title: e.target.value };
                        setSelectedCV({
                          ...selectedCV,
                          educations: newEdus,
                        });
                      }}
                      className="font-medium border-none focus:ring-0 bg-transparent w-full"
                    />
                    <button
                      onClick={() => {
                        const newEdus = selectedCV.educations.filter(
                          (_, i) => i !== index
                        );
                        setSelectedCV({
                          ...selectedCV,
                          educations: newEdus,
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
                        const newEdus = [...selectedCV.educations];
                        newEdus[index] = {
                          ...edu,
                          institution: e.target.value,
                        };
                        setSelectedCV({
                          ...selectedCV,
                          educations: newEdus,
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
                        const newEdus = [...selectedCV.educations];
                        newEdus[index] = {
                          ...edu,
                          date_start: e.target.value,
                          date_start: e.target.value,
                        };
                        setSelectedCV({
                          ...selectedCV,
                          educations: newEdus,
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
                        const newEdus = [...selectedCV.educations];
                        newEdus[index] = {
                          ...edu,
                          date_end: e.target.value,
                          date_end: e.target.value,
                        };
                        setSelectedCV({
                          ...selectedCV,
                          educations: newEdus,
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
                        const newEdus = [...selectedCV.educations];
                        newEdus[index] = { ...edu, score: e.target.value };
                        setSelectedCV({
                          ...selectedCV,
                          educations: newEdus,
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
                    educations: [
                      ...selectedCV.educations,
                      {
                        degree: "",
                        institution: "",
                        date_start: "",
                        date_end: "",
                        gpa: "",
                      },
                    ],
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
                value={selectedCV.promotion_years || ""}
                onChange={(e) => {
                  setSelectedCV({
                    ...selectedCV,
                    promotion_years: e.target.value,
                  });
                }}
                className="w-full border rounded-md p-2 text-gray-700 bg-transparent"
              />
            </div>

            <div className="pt-4">
              <h4 className="font-semibold mb-2">Distinctions</h4>
              <div className="">
                {selectedCV.distinctions.map((distinction, index) => (
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
                          const newDistinctions = [...selectedCV.distinctions];
                          newDistinctions[index] = {
                            ...distinction,
                            name: e.target.value,
                          };
                          setSelectedCV({
                            ...selectedCV,
                            distinctions: newDistinctions,
                          });
                        }}
                        className="font-medium border-none focus:ring-0 bg-transparent w-full"
                      />
                      <button
                        onClick={() => {
                          const newDistinctions =
                            selectedCV.distinctions.filter(
                              (_, i) => i !== index
                            );
                          setSelectedCV({
                            ...selectedCV,
                            distinctions: newDistinctions,
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
                        const newDistinctions = [...selectedCV.distinctions];
                        newDistinctions[index] = {
                          ...distinction,
                          description: e.target.value,
                        };
                        setSelectedCV({
                          ...selectedCV,
                          distinctions: newDistinctions,
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
                      distinctions: [
                        ...selectedCV.distinctions,
                        { name: "", description: "" },
                      ],
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
                {selectedCV.publications.map((publication, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        placeholder="Publication Title"
                        value={publication.title || publication}
                        onChange={(e) => {
                          const newPublications = [...selectedCV.publications];
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
                            publications: newPublications,
                          });
                        }}
                        className="font-medium border-none focus:ring-0 bg-transparent w-full"
                      />
                      <button
                        onClick={() => {
                          const newPublications =
                            selectedCV.publications.filter(
                              (_, i) => i !== index
                            );
                          setSelectedCV({
                            ...selectedCV,
                            publications: newPublications,
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
                      publications: [...selectedCV.publications, ""],
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
                {selectedCV.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => {
                        const newCerts = [...selectedCV.certifications];
                        newCerts[index] = e.target.value;
                        setSelectedCV({
                          ...selectedCV,
                          certifications: newCerts,
                        });
                      }}
                      className="text-gray-700 border-none focus:ring-0 bg-transparent w-full"
                    />
                    <button
                      onClick={() => {
                        const newCerts = selectedCV.certifications.filter(
                          (_, i) => i !== index
                        );
                        setSelectedCV({
                          ...selectedCV,
                          certifications: newCerts,
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
                    certifications: [...selectedCV.certifications, ""],
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
      <ModalFooter>
        <Button
          color="gray"
          className="hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() => setId(null)}
        >
          Close
        </Button>
        {isEdit && (
          <Button
            color="blue"
            className="hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleSave}
          >
            Save
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
