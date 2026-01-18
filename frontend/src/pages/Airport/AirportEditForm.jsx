import React, { useState } from 'react';
import { Modal, message } from 'antd';
import Button from '../../components/Button';
import { updateAirport } from '../../services/airportService';

const AirportEditForm = ({ open, setOpen, setRerender, data }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [airportData, setAirportData] = useState({
    id: data?.id,
    name: data?.name,
    code: data?.code,
    city: data?.city,
    country: data?.country,
  });

  const handleSubmit = async () => {
    setConfirmLoading(true);
    try {
      const res = await updateAirport(airportData);
      setAirportData({ name: '', code: '', city: '', country: '' });
      setRerender((prev) => prev + 1);
      setOpen(false);
      message.success('Airport edited successfully');
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
    setAirportData({ ...airportData, [name]: value });
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
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Airport</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Airport Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={airportData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Airport Name"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700"
          >
            Airport Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={airportData.code}
            maxLength={5}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Code (e.g., LAX)"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={airportData.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="City"
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
            value={airportData.country}
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

export default AirportEditForm;
