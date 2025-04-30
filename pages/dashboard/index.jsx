"use client";
import api from "@/service/api";
import BoardChart from "./_components/board-chart";
import SankeyChart from "./_components/sankey-chart";
import DefaultLayout from "@/components/default-layout";
import { useEffect, useState } from "react";

export default function Page() {
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

  const fetchData = async () => {
    console.log(localStorage.getItem("token"));

    const response = await api.get("/api/analytics", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log(response);
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
          <div className="animate-spin rounded-full h-40 w-40 border-t-12 border-b-12 border-blue-900 dark:border-white"></div>
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
              <></>
            )}
          </div>
        </>
      )}
    </DefaultLayout>
  );
}
