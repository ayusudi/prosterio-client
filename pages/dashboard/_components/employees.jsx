import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "flowbite-react";
import { IoTrashOutline } from "react-icons/io5";
import { GiPencil } from "react-icons/gi";
import ModalEmployee from "./modal-employee";
import api from "@/service/api";
export default function Employees({ employees, fetchData }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState(null);
  useEffect(() => {
    // Filter employees based on search term
    const filtered = employees.filter((employee) =>
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Calculate total pages
    const pages = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(pages);
    // Update current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const updatedCurrentItems = filtered.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    setCurrentItems(updatedCurrentItems);
    setLoading(false);
  }, [employees, currentPage, itemsPerPage, searchTerm]);

  // Uncomment this to fetch real data from API
  // useEffect(() => {

  // }, []);

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      let res = await api.delete(`/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-40 w-40 border-t-12 border-b-12 border-blue-900"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 py-5">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <Table className="!drop-shadow-none" hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Job Title</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {currentItems.map((employee, index) => (
                <TableRow
                  key={employee.id}
                  className={
                    index % 2 !== 0
                      ? "bg-white hover:bg-white border-[#F6F8FB]"
                      : "bg-[#edf6ff] hover:bg-[#edf6ff] border-[#F6F8FB]"
                  }
                >
                  <TableCell className="font-medium">
                    {employee.full_name}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {employee.job_title}
                    </span>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button
                      color="gray"
                      className="cursor-pointer focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      size="sm"
                      onClick={() => {
                        setId(employee.id);
                      }}
                    >
                      <GiPencil />
                    </Button>
                    <Button
                      color="red"
                      className="cursor-pointer focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <IoTrashOutline />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
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
              <br />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <Button
                color="gray"
                className="hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                size="sm"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
              >
                First
              </Button>
              <Button
                color="gray"
                className="hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                className="hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                {">"}
              </Button>
              <Button
                color="gray"
                className="hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                size="sm"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
              >
                Last
              </Button>
            </div>
          </div>
          <p className="w-full mt-2 text-gray-500 font-semibold text-sm text-right self-end pr-1">
            Total {employees.length} employees
          </p>
        </>
      )}
      {id ? (
        <ModalEmployee setId={setId} id={id} fetchData={fetchData} />
      ) : (
        <></>
      )}
    </div>
  );
}
