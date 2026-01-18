import { useEffect, useState } from 'react';
import { adminSocket as socket } from '../../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
  ExportOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import Button from '../../components/Button';
import { notification, Popconfirm, Pagination } from 'antd';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import {
  getScreens,
  deleteScreen,
  setCurrentPage,
  setEditId,
  setControlId,
  setScreenStatus,
  resetState,
} from '../../store/slices/screenSlice';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
import Control from './Control';

const ScreenManagement = () => {
  // Get state from redux
  const {
    screens,
    totalScreen,
    error,
    readLoading,
    currentPage,
    editId,
    controlId,
  } = useSelector((state) => state.screen);
  const dispatch = useDispatch();

  // Open/close popup
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showControl, setShowControl] = useState(false);

  useEffect(() => {
    // Fetch screens from API
    dispatch(getScreens([1, 10]));

    return () => {
      dispatch(resetState());
    };
  }, []);

  useEffect(() => {
    socket.connect();

    const onScreenStatus = (screenStatus) => {
      // console.log(screenStatus);
      dispatch(setScreenStatus(screenStatus));
    };
    const onConnect = () => {
      console.log('connect');
    };
    const onDisconnect = () => {
      console.log('disconnect');
    };
    const onConnectError = () => {
      console.log('connect error');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('screen-status', onScreenStatus);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('screen-status', onScreenStatus);
      socket.disconnect();
    };
  }, []);

  const openCreateForm = () => {
    setShowCreateForm(true);
  };
  const openEditForm = (id) => {
    dispatch(setEditId(id));
    setShowEditForm(true);
  };
  const openControl = (id) => {
    dispatch(setControlId(id));
    setShowControl(true);
  };

  // Action executed when the confirm button is clicked for deletion
  const confirmDeleteScreen = async (id) => {
    dispatch(deleteScreen(id))
      .unwrap()
      .then(() => {
        dispatch(getScreens([1, 10]));
        notification.success({
          message: 'Notification',
          duration: 10,
          description: 'Screen deleted successfully',
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
      <EditForm
        key={'edit' + editId}
        open={showEditForm}
        setOpen={setShowEditForm}
      />
      <Control
        key={'control' + controlId}
        open={showControl}
        setOpen={setShowControl}
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
                  <th className="py-3 px-6 text-left">Area</th>
                  <th className="py-3 px-6 text-left">Gate</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm">
                {screens.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6">{item.name}</td>
                    <td className="py-3 px-6">{item.area}</td>
                    <td className="py-3 px-6">{item.gate}</td>
                    <td className="py-3 px-6">
                      {item.status === -1 ? (
                        <p className="text-red-600">Power off</p>
                      ) : item.status === 0 ? (
                        <p className="text-green-600">Off</p>
                      ) : (
                        <p className="text-green-600">On</p>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => {
                          openControl(index);
                        }}
                        className="border border-yellow-300 text-yellow-500 text-lg px-1 rounded mr-2 shadow-lg active:shadow-gray-400 transition-all duration-200 hover:border-yellow-400 hover:text-yellow-600"
                      >
                        <DesktopOutlined />
                      </button>
                      <button
                        onClick={() => {
                          openEditForm(index);
                        }}
                        className="border border-gray-300 text-gray-500 text-lg px-1 rounded mr-2 shadow-lg active:shadow-gray-400 transition-all duration-200 hover:border-indigo-400 hover:text-indigo-600"
                      >
                        <EditOutlined />
                      </button>

                      <Popconfirm
                        title="Delete the screen"
                        description="Are you sure to delete this screen?"
                        onConfirm={() => {
                          confirmDeleteScreen(item.id);
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
            dispatch(getScreens([page, pageSize]));
            dispatch(setCurrentPage(page));
          }}
          current={currentPage}
          total={totalScreen}
        />
      </div>
    </div>
  );
};

export default ScreenManagement;
