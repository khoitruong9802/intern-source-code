import React, { useState } from 'react';
import { Modal, notification } from 'antd';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { createScreen, getScreens } from '../../store/slices/screenSlice';

// Initial value of the screen form data
const initialScreenData = {
  name: '',
  area: '',
  gate: '',
};

const CreateForm = ({ open, setOpen }) => {
  // Get state from redux
  const { createLoading } = useSelector((state) => state.screen);
  const dispatch = useDispatch();

  // Form data state
  const [screenData, setScreenData] = useState(initialScreenData);

  const handleSubmit = () => {
    // Dispatche the action with the current screen data
    dispatch(createScreen(screenData))
      .unwrap()
      .then((data) => {
        // Get updated list of screens after a screen is inserted
        dispatch(getScreens([1, 10]));
        // Reset the screen data to its initial state
        setScreenData(initialScreenData);
        // Close create form
        setOpen(false);
        notification.success({
          message: 'Notification',
          duration: 10,
          description: 'Screen created successfully',
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
          <Button isLoading={createLoading} onClick={handleSubmit}>
            Save
          </Button>
        </div>
      }
    >
      <h2 className="text-2xl font-bold mb-4">Add Screen</h2>
      <form onSubmit={handleSubmit}>
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
            <option value="">Choose area</option>
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

export default CreateForm;
