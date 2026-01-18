// EditForm.jsx
import React, { useState } from 'react';
import { Modal, notification } from 'antd';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { updateFlight, getFlights } from '../../store/slices/flightSlice';

const convertToInputFormat = (datetime) => {
  // Create a Date object from the UTC string
  const utcDate = new Date(datetime);

  // Adjust for UTC+7
  const localTimeOffset = 7 * 60; // UTC+7 in minutes
  const localDate = new Date(utcDate.getTime() + localTimeOffset * 60000); // Convert to local time

  // Format to YYYY-MM-DDTHH:MM
  const formattedDate = localDate.toISOString().slice(0, 16);
  return formattedDate;
};

const EditForm = ({ open, setOpen }) => {
  const { airlines } = useSelector((state) => state.airline);
  const { airports } = useSelector((state) => state.airport);
  const { flights, updateLoading, editId } = useSelector(
    (state) => state.flight
  );
  const dispatch = useDispatch();

  const [flightData, setFlightData] = useState(() => {
    return flights[editId] === undefined
      ? {}
      : {
          ...flights[editId],
          departureTime: convertToInputFormat(flights[editId].departureTime),
          arrivalTime: convertToInputFormat(flights[editId].arrivalTime),
        };
  });

  const handleSubmit = async () => {
    const { airline, arrivalAirport, departureAirport, ...flight } = flightData;
    dispatch(updateFlight(flight))
      .unwrap()
      .then((data) => {
        console.log(data);
        dispatch(getFlights([1, 10]));
        setOpen(false);
        notification.success({
          message: 'Notification',
          duration: 10,
          description: 'Flight edited successfully',
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
          <Button isLoading={updateLoading} onClick={handleSubmit}>
            Save
          </Button>
        </div>
      }
    >
      <h2 className="text-2xl font-bold mb-4">Edit Flight</h2>
      <form>
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

export default EditForm;
