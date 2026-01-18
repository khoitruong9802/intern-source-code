import { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { message, Popconfirm, Pagination } from 'antd';
import AirportCreateForm from './AirportCreateForm';
import AirportEditForm from './AirportEditForm';
import { getAirports, deleteAirport } from '../../services/airportService';
import Loading from '../../components/Loading';
import Button from '../../components/Button';

const Airport = () => {
  const [airports, setAirports] = useState([]);
  const [totalAirport, setTotalAirport] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [airportIdEdit, setAirportIdEdit] = useState(0);
  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    fetchAirports(1, 10);
  }, [rerender]);

  const fetchAirports = async (page, pageSize) => {
    try {
      setIsLoading(true);
      const res = await getAirports(page, pageSize);
      setAirports(res.data.data);
      setTotalAirport(res.data.totalCount);
    } catch (error) {
      console.log(error);
      message.error('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    setShowCreateForm(true);
  };

  const openEditForm = (id) => {
    setAirportIdEdit(id);
    setShowEditForm(true);
  };

  const confirmDeleteAirport = async (id) => {
    try {
      const res = await deleteAirport(id);
      console.log(res);
      message.success('Airport deleted successfully');
      setRerender((prev) => prev + 1);
    } catch (error) {
      message.error('Server error');
      console.log(error);
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <AirportCreateForm
        open={showCreateForm}
        setOpen={setShowCreateForm}
        setRerender={setRerender}
      />
      <AirportEditForm
        key={airportIdEdit}
        open={showEditForm}
        setOpen={setShowEditForm}
        setRerender={setRerender}
        data={airports[airportIdEdit]}
      />

      <div className="p-6 min-h-screen flex flex-col justify-between">
        <div>
          <div className="flex justify-between mb-4">
            <Button onClick={openCreateForm} color="indigo">
              <PlusSquareOutlined className="mr-2" />
              Create
            </Button>

            <Button color="emerald">
              <ExportOutlined className="mr-2" />
              Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-800 text-sm">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Code</th>
                  <th className="py-3 px-6 text-left">City</th>
                  <th className="py-3 px-6 text-left">Country</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm">
                {airports.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6">{item.name}</td>
                    <td className="py-3 px-6">{item.code}</td>
                    <td className="py-3 px-6">{item.city}</td>
                    <td className="py-3 px-6">{item.country}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => {
                          openEditForm(index);
                        }}
                        className="border border-gray-300 text-gray-500 text-lg px-1 rounded mr-2 shadow-lg active:shadow-gray-400 transition-all duration-200 hover:border-indigo-400 hover:text-indigo-600"
                      >
                        <EditOutlined />
                      </button>

                      <Popconfirm
                        title="Delete the airport"
                        description="Are you sure to delete this airport?"
                        onConfirm={() => {
                          confirmDeleteAirport(item.id);
                        }}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button className="border border-red-300 text-red-500 text-lg px-1 rounded shadow-lg active:shadow-red-400 transition-all duration-200 hover:border-red-400 hover:text-red-600">
                          <DeleteOutlined />
                        </button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          align="end"
          onChange={(page, pageSize) => {
            fetchAirports(page, pageSize);
            setCurrentPage(page);
          }}
          current={currentPage}
          total={totalAirport}
        />
      </div>
    </div>
  );
};

export default Airport;
