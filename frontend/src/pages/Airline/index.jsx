import { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { message, Popconfirm, Pagination } from 'antd';
import AirlineCreateForm from './AirlineCreateForm';
import AirlineEditForm from './AirlineEditForm';
import { getAirlines, deleteAirline } from '../../services/airlineService';
import Loading from '../../components/Loading';
import Button from '../../components/Button';

const Airline = () => {
  const [airlines, setAirlines] = useState([]);
  const [totalAirline, setTotalAirline] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [airlineIdEdit, setAirlineIdEdit] = useState(0);
  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    fetchAirlines(1, 10);
  }, [rerender]);

  const fetchAirlines = async (page, pageSize) => {
    try {
      setIsLoading(true);
      const res = await getAirlines(page, pageSize);
      setAirlines(res.data.data);
      setTotalAirline(res.data.totalCount);
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
    setAirlineIdEdit(id);
    setShowEditForm(true);
  };

  const confirmDeleteAirline = async (id) => {
    try {
      const res = await deleteAirline(id);
      console.log(res);
      message.success('Airline deleted successfully');
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
      <AirlineCreateForm
        open={showCreateForm}
        setOpen={setShowCreateForm}
        setRerender={setRerender}
      />
      <AirlineEditForm
        key={airlineIdEdit}
        open={showEditForm}
        setOpen={setShowEditForm}
        setRerender={setRerender}
        data={airlines[airlineIdEdit]}
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
                  <th className="py-3 px-6 text-left">Country</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm">
                {airlines.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6">{item.name}</td>
                    <td className="py-3 px-6">{item.code}</td>
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
                        title="Delete the airline"
                        description="Are you sure to delete this airline?"
                        onConfirm={() => {
                          confirmDeleteAirline(item.id);
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
            fetchAirlines(page, pageSize);
            setCurrentPage(page);
          }}
          current={currentPage}
          total={totalAirline}
        />
      </div>
    </div>
  );
};

export default Airline;
