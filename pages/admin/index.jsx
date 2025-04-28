"use client";
import DefaultLayout from "@/components/default-layout";
import { IoPersonRemoveSharp } from "react-icons/io5";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "flowbite-react";
import { useEffect, useState } from "react";
import api from "@/service/api";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const fetchAdmins = async () => {
    try {
      const { data } = await api("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      let pages = Math.ceil(data.data.length / itemsPerPage);
      setTotalPages(pages);
      const indexOfLastItem_ = currentPage * itemsPerPage;
      const indexOfFirstItem_ = indexOfLastItem_ - itemsPerPage;
      const updatedCurrentItems = data.data.slice(
        indexOfFirstItem_,
        indexOfLastItem_
      );
      setCurrentItems(updatedCurrentItems);
      setAdmins(data.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };
  useEffect(() => {
    fetchAdmins();
  }, []);
  useEffect(() => {
    const indexOfLastItem_ = currentPage * itemsPerPage;
    const indexOfFirstItem_ = indexOfLastItem_ - itemsPerPage;
    const updatedCurrentItems = admins.slice(
      indexOfFirstItem_,
      indexOfLastItem_
    );
    let pages = Math.ceil(admins.length / itemsPerPage);
    setTotalPages(pages);
    setCurrentItems(updatedCurrentItems);
  }, [admins, currentPage, itemsPerPage]);
  const moveToAddAdmin = () => {
    router.push("/add-admin");
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-4 py-5">
        <h2 className="text-xl font-semibold ml-1">List Admin</h2>
        <Button
          onClick={moveToAddAdmin}
          color="blue"
          className="bg-[#1884f7] hover:bg-[#007AFF] cursor-pointer"
        >
          + Add Admin
        </Button>
      </div>
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Role</TableHeadCell>
            <TableHeadCell>Action</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {currentItems.map((admin, index) => (
            <TableRow
              key={index}
              className={
                index % 2 !== 0
                  ? "bg-white hover:bg-white border-[#F6F8FB]"
                  : "bg-[#edf6ff] hover:bg-[#edf6ff] border-[#F6F8FB]"
              }
            >
              <TableCell className="font-medium text-gray-900">
                {admin.name}
              </TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    admin.role === "HR"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {admin.role}
                </span>
              </TableCell>
              <TableCell>
                <Button color="gray" size="sm">
                  <IoPersonRemoveSharp />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Show Page</span>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <Button
            color="gray"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
          >
            First
          </Button>
          <Button
            color="gray"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            {"<"}
          </Button>

          {pageNumbers.map((number) => (
            <Button
              key={number}
              color={currentPage === number ? "blue" : "#EDF6FF"}
              size="sm"
              className={currentPage === number ? "" : "bg-[#EDF6FF]"}
              onClick={() => paginate(number)}
            >
              {number}
            </Button>
          ))}

          <Button
            color="gray"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            {">"}
          </Button>
          <Button
            color="gray"
            size="sm"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
