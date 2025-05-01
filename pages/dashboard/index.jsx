"use client";
import api from "@/service/api";
import BoardChart from "./_components/board-chart";
import SankeyChart from "./_components/sankey-chart";
import DefaultLayout from "@/components/default-layout";
import { useEffect, useState } from "react";
import isAuth from "@/components/is-auth";
import Employees from "./_components/employees";

function Page() {
  const [page, setPage] = useState("main"); // main, education, list
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    education_to_job_title: {
      links: [],
      nodes: [],
    },
    experience_level_distribution: [],
    job_title_distribution: [],
    top_skills: [],
  });
  const [employees, setEmployees] = useState([
    {
      email: "raka.pmtech@gmail.com",
      file_url: null,
      full_name: "Raka Pratama",
      id: 501,
      job_title: "Project Manager",
      resign_date: null,
      resign_status: false,
    },
    {
      email: "nara.pythondev@gmail.com",
      file_url: null,
      full_name: "Nara Mulyana",
      id: 502,
      job_title: "Junior Python Developer",
      resign_date: null,
      resign_status: false,
    },
    {
      email: "fajar.dbadev@gmail.com",
      file_url: null,
      full_name: "Fajar Nugroho",
      id: 306,
      job_title: "SQL Server DBA & Developer",
      resign_date: null,
      resign_status: false,
    },
    {
      email: "ahmad.rafi.dev@gmail.com",
      file_url: null,
      full_name: "Ahmad Rafi Prasetya",
      id: 307,
      job_title: "Back End Engineer",
      resign_date: null,
      resign_status: false,
    },
    {
      email: "alya.pmlead@gmail.com",
      file_url: null,
      full_name: "Alya Ramadhani",
      id: 5,
      job_title: "Project Manager",
      resign_date: null,
      resign_status: false,
    },
    {
      email: "nadia.frontdev@gmail.com",
      file_url: null,
      full_name: "Nadia Arifin",
      id: 106,
      job_title: "Frontend Developer",
      resign_date: null,
      resign_status: false,
    },
    {
      email: "rafi.alamsyah@gmail.com",
      file_url: null,
      full_name: "Rafi Alamsyah",
      id: 1,
      job_title: "Junior Business Analyst",
      resign_date: null,
      resign_status: false,
    },
    {
      email: "rizky.pythondev@gmail.com",
      file_url: null,
      full_name: "Rizky Maulana",
      id: 6,
      job_title: "Backend Python Developer",
      resign_date: null,
      resign_status: false,
    },
    {
      email: "intan.ba@gmail.com",
      file_url: null,
      full_name: "Intan Permata Sari",
      id: 102,
      job_title: "Business Analyst",
      resign_date: null,
      resign_status: false,
    },
    {
      email: "bima.devfrontend@gmail.com",
      file_url: null,
      full_name: "Bima Santosa",
      id: 505,
      job_title: "Junior Front End Developer",
      resign_date: null,
      resign_status: false,
    },
  ]);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await api.get("/api/analytics", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const response2 = await api.get("/api/employees", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setEmployees(response2.data);
    setData(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DefaultLayout>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-40 w-40 border-t-12 border-b-12 border-blue-900 "></div>
        </div>
      ) : (
        <>
          <div className="flex gap-0.5 mt-4">
            <button
              className={`tab px-4 py-1 bg-gray-100 rounded-t-lg ${
                page === "main" ? "active font-bold" : ""
              }`}
              onClick={() => setPage("main")}
            >
              Report
            </button>
            <button
              className={`tab px-4 py-1 bg-gray-100 rounded-t-lg ${
                page === "education" ? "active font-bold" : ""
              }`}
              onClick={() => setPage("education")}
            >
              Education Distribution
            </button>
            <button
              className={`tab px-4 py-1 bg-gray-100 rounded-t-lg ${
                page === "list" ? "active font-bold" : ""
              }`}
              onClick={() => setPage("list")}
            >
              Table IT Talent
            </button>
          </div>
          <div className="flex flex-col gap-8 border border-gray-200 px-3 py-4 min-h-[80dvh]">
            {page === "main" ? (
              <BoardChart data={data} />
            ) : page === "education" ? (
              <SankeyChart dataSankey={data.education_to_job_title} />
            ) : (
              <Employees employees={employees} fetchData={fetchData} />
            )}
          </div>
        </>
      )}
    </DefaultLayout>
  );
}

export default isAuth(Page);
