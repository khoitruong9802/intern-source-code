import React, { useState } from 'react';
import { Modal, message } from 'antd';
import Button from '../../components/Button';
import { createAirline } from '../../services/airlineService';

const AirlineCreateForm = ({ open, setOpen, setRerender }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [airlineData, setAirlineData] = useState({
    name: '',
    code: '',
    country: '',
  });

  const handleSubmit = async () => {
    setConfirmLoading(true);
    try {
      const res = await createAirline(airlineData);
      setAirlineData({ name: '', code: '', country: '' });
      setRerender((prev) => prev + 1);
      setOpen(false);
      message.success('Airline created successfully');
    } catch (error) {
      message.error('Server error');
      console.log(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAirlineData({ ...airlineData, [name]: value });
  };

  return (
    <Modal
      open={open}
      // onOk={handleSubmit}
      // confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button color="gray" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button isLoading={confirmLoading} onClick={handleSubmit}>
          Save
        </Button>,
      ]}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">New Airline</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Airline Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={airlineData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Airline Name"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700"
          >
            Airline Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={airlineData.code}
            maxLength={5}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Code (e.g., LAX)"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={airlineData.country}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Country"
          />
        </div>
      </form>
    </Modal>
  );
};

export default AirlineCreateForm;
