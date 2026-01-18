import React, { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { createFlight, getFlights } from '../../store/slices/flightSlice';

// Initial value of the flight form data
const initialFlightData = {
  flightNumber: '',
  arrivalAirportId: '',
  airlineId: '',
  departureTime: '',
  arrivalTime: '',
  gate: '',
  remark: '',
};

const CreateForm = ({ open, setOpen }) => {
  // Get state from redux
  const { createLoading } = useSelector((state) => state.flight);
  const { airlines } = useSelector((state) => state.airline);
  const { airports } = useSelector((state) => state.airport);
  const dispatch = useDispatch();

  // Form data state
  const [flightData, setFlightData] = useState(initialFlightData);

  const handleSubmit = () => {
    // Dispatche the action with the current flight data
    dispatch(createFlight(flightData))
      .unwrap()
      .then((data) => {
        // Get updated list of flights after a flight is inserted
        dispatch(getFlights([1, 10]));
        // Reset the flight data to its initial state
        setFlightData(initialFlightData);
        // Close create form
        setOpen(false);
        notification.success({
          message: 'Notification',
          duration: 10,
          description: 'Flight created successfully',
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
    setFlightData({ ...flightData, [name]: value });
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
      <h2 className="text-2xl font-bold mb-4">Add Flight</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="flightNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Flight Number
          </label>
          <input
            type="text"
            id="flightNumber"
            name="flightNumber"
            required
            value={flightData.flightNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="arrivalAirportId"
            className="block text-sm font-medium text-gray-700"
          >
            Arrival Airport
          </label>
          <select
            id="arrivalAirportId"
            name="arrivalAirportId"
            required
            value={flightData.arrivalAirportId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Airport</option>
            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="airlineId"
            className="block text-sm font-medium text-gray-700"
          >
            Airline
          </label>
          <select
            id="airlineId"
            name="airlineId"
            required
            value={flightData.airlineId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Airline</option>
            {airlines.map((airline) => (
              <option key={airline.id} value={airline.id}>
                {airline.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="departureTime"
            className="block text-sm font-medium text-gray-700"
          >
            Departure Time
          </label>
          <input
            type="datetime-local"
            id="departureTime"
            name="departureTime"
            required
            value={flightData.departureTime}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="arrivalTime"
            className="block text-sm font-medium text-gray-700"
          >
            Arrival Time
          </label>
          <input
            type="datetime-local"
            id="arrivalTime"
            name="arrivalTime"
            required
            value={flightData.arrivalTime}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
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
            value={flightData.gate}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="remark"
            className="block text-sm font-medium text-gray-700"
          >
            Remark
          </label>
          <input
            type="text"
            id="remark"
            name="remark"
            required
            value={flightData.remark}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateForm;
