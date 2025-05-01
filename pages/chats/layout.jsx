"use client";
import { useState, useEffect } from "react";
import api from "@/service/api";
import { useRouter } from "next/router";
import { RiBookMarkedLine } from "react-icons/ri";
import { MdOutlineDelete } from "react-icons/md";
import DefaultLayout from "@/components/default-layout";

export default function Layout({ children }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/chats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(data.chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await api.delete(`/api/chats/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex h-screen border border-t-0 rounded-t-none rounded-xl border-gray-200">
        {/* Sidebar */}
        <div className="w-2/5 p-4 border-r border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <RiBookMarkedLine className="text-2xl text-blue-600" />
            <h1 className="text-xl font-semibold">Chat History</h1>
          </div>
          <div className="space-y-4">
            {data.map((item) => (
              <div
                key={item.id}
                className={
                  "bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 " +
                  (isLoading ? "cursor-not-allowed" : "cursor-pointer")
                }
                onClick={() => router.push(`/chats/${item.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <MdOutlineDelete className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
            {!isLoading && !data.length ? (
              <p className="text-lg font-semibold">No Data</p>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
