import React, { useState } from 'react';
import { Modal, notification } from 'antd';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { updateScreen, getScreens } from '../../store/slices/screenSlice';

const EditForm = ({ open, setOpen }) => {
  // Get state from redux
  const { screens, updateLoading, editId } = useSelector(
    (state) => state.screen
  );
  const dispatch = useDispatch();

  const [screenData, setScreenData] = useState(() => {
    return screens[editId] || {};
  });

  const handleSubmit = async () => {
    const { status, ...screen } = screenData;
    dispatch(updateScreen(screen))
      .unwrap()
      .then((data) => {
        console.log(data);
        dispatch(getScreens([1, 10]));
        setOpen(false);
        notification.success({
          message: 'Notificaion',
          description: 'Screen edited successfully',
        });
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: 'Notification',
          duration: 10,
          description: error,
        });
      });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScreenData({ ...screenData, [name]: value });
  };

  return (
    <Modal
      open={open}
      // onOk={handleSubmit}
      // isLoading={isLoading}
      centered
      onCancel={handleCancel}
      footer={
        <div className="flex gap-x-2">
          <Button color="gray" onClick={handleCancel}>
            Cancel
          </Button>
          <Button isLoading={updateLoading} onClick={handleSubmit}>
            Save
          </Button>
        </div>
      }
    >
      <h2 className="text-2xl font-bold mb-4">Edit Screen</h2>
      <form>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Screen name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={screenData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="area"
            className="block text-sm font-medium text-gray-700"
          >
            Area
          </label>
          <select
            id="area"
            name="area"
            required
            value={screenData.area}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="departure">departure</option>
            <option value="arrival">arrival</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="gate"
            className="block text-sm font-medium text-gray-700"
          >
            Gate
          </label>
          <input
            type="text"
            id="gate"
            name="gate"
            required
            value={screenData.gate}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditForm;
