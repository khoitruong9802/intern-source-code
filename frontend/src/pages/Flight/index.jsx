import { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
  ExportOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { notification, Popconfirm, Pagination } from 'antd';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { useDispatch, useSelector } from 'react-redux';
import { getAirlines } from '../../store/slices/airlineSlice';
import { getAirports } from '../../store/slices/airportSlice';
import {
  getFlights,
  deleteFlight,
  setCurrentPage,
  setEditId,
  resetState,
} from '../../store/slices/flightSlice';
import Button from '../../components/Button';

const Flight = () => {
  // Get state from redux
  const { flights, totalFlight, readLoading, error, currentPage, editId } =
    useSelector((state) => state.flight);
  const dispatch = useDispatch();

  // Open/close popup
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    // Fetch airlines from API
    dispatch(getAirlines());
    // Fetch airports from API
    dispatch(getAirports());
    // Fetch flights from API
    dispatch(getFlights([1, 10]));

    return () => {
      dispatch(resetState());
    };
  }, []);

  const openCreateForm = () => {
    setShowCreateForm(true);
  };
  const openEditForm = (id) => {
    dispatch(setEditId(id));
    setShowEditForm(true);
  };

  // Action executed when the confirm button is clicked for deletion
  const confirmDeleteFlight = async (id) => {
    dispatch(deleteFlight(id))
      .unwrap()
      .then(() => {
        dispatch(getFlights([1, 10]));
        notification.success({
          message: 'Notification',
          duration: 10,
          description: 'Flight deleted successfully',
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Notification',
          duration: 10,
          description: error,
        });
      });
  };

  // Show error page
  if (error) {
    return <Error message={error} />;
  }

  // Show loading page
  if (readLoading) {
    return <Loading />;
  }

  return (
    <div>
      <CreateForm open={showCreateForm} setOpen={setShowCreateForm} />
      <EditForm key={editId} open={showEditForm} setOpen={setShowEditForm} />

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
                  <th className="py-3 px-6 text-left">Flight number</th>
                  <th className="py-3 px-6 text-left">Arrival airport</th>
                  <th className="py-3 px-6 text-left">Airline</th>
                  <th className="py-3 px-6 text-left">Departure time</th>
                  <th className="py-3 px-6 text-left">Arrival time</th>
                  <th className="py-3 px-6 text-left">Gate</th>
                  <th className="py-3 px-6 text-left">Remark</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm">
                {flights.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6">{item.flightNumber}</td>
                    <td className="py-3 px-6">{item.arrivalAirport}</td>
                    <td className="py-3 px-6">{item.airline}</td>
                    <td className="py-3 px-6">
                      {new Date(item.departureTime).toLocaleString()}
                    </td>
                    <td className="py-3 px-6">
                      {new Date(item.arrivalTime).toLocaleString()}
                    </td>
                    <td className="py-3 px-6">{item.gate}</td>
                    <td className="py-3 px-6">{item.remark}</td>
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
                        title="Delete the flight"
                        description="Are you sure to delete this flight?"
                        onConfirm={() => {
                          confirmDeleteFlight(item.id);
                        }}
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
            dispatch(getFlights([page, pageSize]));
            dispatch(setCurrentPage(page));
          }}
          current={currentPage}
          total={totalFlight}
        />
      </div>
    </div>
  );
};

export default Flight;
