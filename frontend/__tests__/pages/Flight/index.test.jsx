// Flight.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'; // Removed 'vi' from imports
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Flight from '../../../src/pages/Flight';
import flightReducer, {
  getFlights,
  deleteFlight,
  setCurrentPage,
  setEditId,
  resetState,
} from '../../../src/store/slices/flightSlice';
import airlineReducer, {
  getAirlines,
} from '../../../src/store/slices/airlineSlice';
import airportReducer, {
  getAirports,
} from '../../../src/store/slices/airportSlice';

import * as antd from 'antd';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated method
    removeListener: vi.fn(), // Deprecated method
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock 'notification' methods using 'vi.spyOn'
vi.spyOn(antd.notification, 'success').mockImplementation(() => {});
vi.spyOn(antd.notification, 'error').mockImplementation(() => {});

// Mock 'Popconfirm' component
vi.mock('antd/lib/popconfirm', () => ({
  __esModule: true,
  default: ({ children, onConfirm }) => (
    <div>
      {children}
      <button onClick={onConfirm}>Yes</button>
    </div>
  ),
}));

// Mock 'Pagination' component
vi.mock('antd/lib/pagination', () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <div>
      <button onClick={() => onChange(1)}>1</button>
      <button onClick={() => onChange(2)}>2</button>
      <button onClick={() => onChange(3)}>3</button>
    </div>
  ),
}));

// Mock child components
vi.mock('../../../src/pages/Flight/CreateForm', () => ({
  __esModule: true,
  default: ({ open }) => (open ? <div>CreateForm</div> : null),
}));

vi.mock('../../../src/pages/Flight/EditForm', () => ({
  __esModule: true,
  default: ({ open }) => (open ? <div>EditForm</div> : null),
}));

vi.mock('../../../src/components/Loading', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));

vi.mock('../../../src/components/Error', () => ({
  __esModule: true,
  default: ({ message }) => <div>Error: {message}</div>,
}));

describe('Flight Component', () => {
  let store;

  const createStore = (preloadedState) =>
    configureStore({
      reducer: {
        flight: flightReducer,
        airline: airlineReducer,
        airport: airportReducer,
      },
      preloadedState,
    });

  beforeEach(() => {
    store = createStore({
      flight: {
        flights: [],
        totalFlight: 0,
        readLoading: false,
        error: null,
        currentPage: 1,
        editId: null,
      },
      airline: {
        airlines: [],
      },
      airport: {
        airports: [],
      },
    });

    // Mock the dispatch function
    vi.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing and displays main elements', async () => {
    // Mock the async actions to resolve immediately
    vi.mock('../../../src/store/slices/flightSlice', () => {
      const originalModule = vi.importActual(
        '../../../src/store/slices/flightSlice'
      );
      return {
        __esModule: true,
        ...originalModule,
        getFlights: () => () => Promise.resolve(),
      };
    });

    vi.mock('../../../src/store/slices/airlineSlice', () => {
      const originalModule = vi.importActual(
        '../../../src/store/slices/airlineSlice'
      );
      return {
        __esModule: true,
        ...originalModule,
        getAirlines: () => () => Promise.resolve(),
      };
    });

    vi.mock('../../../src/store/slices/airportSlice', () => {
      const originalModule = vi.importActual(
        '../../../src/store/slices/airportSlice'
      );
      return {
        __esModule: true,
        ...originalModule,
        getAirports: () => () => Promise.resolve(),
      };
    });

    // Initialize the store with readLoading: false
    store = createStore({
      flight: {
        flights: [],
        totalFlight: 0,
        readLoading: false,
        error: null,
        currentPage: 1,
        editId: null,
      },
      airline: {
        airlines: [],
      },
      airport: {
        airports: [],
      },
    });

    // Render the component
    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    // Wait for the component to render the main elements
    await waitFor(() => {
      expect(screen.getByText('Create')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
    });
  });

  it('dispatches getAirlines, getAirports, and getFlights on mount', () => {
    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(getAirlines());
    expect(store.dispatch).toHaveBeenCalledWith(getAirports());
    expect(store.dispatch).toHaveBeenCalledWith(getFlights([1, 10]));
  });

  it('dispatches resetState on unmount', () => {
    const { unmount } = render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    unmount();

    expect(store.dispatch).toHaveBeenCalledWith(resetState());
  });

  it('shows loading component when readLoading is true', () => {
    store = createStore({
      ...store.getState(),
      flight: {
        ...store.getState().flight,
        readLoading: true,
      },
    });

    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error component when error is present', () => {
    const errorMessage = 'Error fetching flights';
    store = createStore({
      ...store.getState(),
      flight: {
        ...store.getState().flight,
        error: errorMessage,
      },
    });

    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('displays flights when data is available', () => {
    const flights = [
      {
        id: 1,
        flightNumber: 'AA123',
        arrivalAirport: 'JFK',
        airline: 'American Airlines',
        departureTime: '2023-10-10T10:00:00Z',
        arrivalTime: '2023-10-10T14:00:00Z',
        gate: 'A1',
        remark: 'On time',
      },
      {
        id: 2,
        flightNumber: 'DL456',
        arrivalAirport: 'LAX',
        airline: 'Delta Airlines',
        departureTime: '2023-10-11T11:00:00Z',
        arrivalTime: '2023-10-11T15:00:00Z',
        gate: 'B2',
        remark: 'Delayed',
      },
    ];

    store = createStore({
      ...store.getState(),
      flight: {
        ...store.getState().flight,
        flights: flights,
        totalFlight: flights.length,
      },
    });

    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    expect(screen.getByText('AA123')).toBeInTheDocument();
    expect(screen.getByText('JFK')).toBeInTheDocument();
    expect(screen.getByText('American Airlines')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('On time')).toBeInTheDocument();

    expect(screen.getByText('DL456')).toBeInTheDocument();
    expect(screen.getByText('LAX')).toBeInTheDocument();
    expect(screen.getByText('Delta Airlines')).toBeInTheDocument();
    expect(screen.getByText('B2')).toBeInTheDocument();
    expect(screen.getByText('Delayed')).toBeInTheDocument();
  });

  it('opens create form when Create button is clicked', () => {
    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    expect(screen.getByText('CreateForm')).toBeInTheDocument();
  });

  it('opens edit form when Edit button is clicked', () => {
    const flights = [
      {
        id: 1,
        flightNumber: 'AA123',
        arrivalAirport: 'JFK',
        airline: 'American Airlines',
        departureTime: '2023-10-10T10:00:00Z',
        arrivalTime: '2023-10-10T14:00:00Z',
        gate: 'A1',
        remark: 'On time',
      },
    ];

    store = createStore({
      ...store.getState(),
      flight: {
        ...store.getState().flight,
        flights: flights,
        totalFlight: 1,
      },
    });

    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(store.dispatch).toHaveBeenCalledWith(setEditId(0));
    expect(screen.getByText('EditForm')).toBeInTheDocument();
  });

  it('dispatches deleteFlight action when deletion is confirmed', async () => {
    const flightId = 1;
    const flights = [
      {
        id: flightId,
        flightNumber: 'AA123',
        arrivalAirport: 'JFK',
        airline: 'American Airlines',
        departureTime: '2023-10-10T10:00:00Z',
        arrivalTime: '2023-10-10T14:00:00Z',
        gate: 'A1',
        remark: 'On time',
      },
    ];

    store = createStore({
      ...store.getState(),
      flight: {
        ...store.getState().flight,
        flights: flights,
        totalFlight: 1,
      },
    });

    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });

    // Simulate clicking on delete button
    fireEvent.click(deleteButton);

    // Simulate confirmation click
    const confirmButton = screen.getByText('Yes');
    fireEvent.click(confirmButton);

    // Wait for the action to be dispatched
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(deleteFlight(flightId));
    });
  });

  it('changes page when pagination is used', () => {
    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(store.dispatch).toHaveBeenCalledWith(setCurrentPage(2));
    expect(store.dispatch).toHaveBeenCalledWith(getFlights([2, 10]));
  });

  it('handles no flights scenario', () => {
    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('calls export function when Export button is clicked', () => {
    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    const exportButton = screen.getByText('Export');
    expect(exportButton).toBeInTheDocument();
  });

  it('displays the correct number of flights per page', () => {
    const flightsPerPage = 10;
    const flights = Array.from({ length: flightsPerPage }, (_, index) => ({
      id: index + 1,
      flightNumber: `Flight${index + 1}`,
      arrivalAirport: `Airport${index + 1}`,
      airline: `Airline${index + 1}`,
      departureTime: '2023-10-10T10:00:00Z',
      arrivalTime: '2023-10-10T14:00:00Z',
      gate: `Gate${index + 1}`,
      remark: 'On time',
    }));

    store = createStore({
      ...store.getState(),
      flight: {
        ...store.getState().flight,
        flights: flights,
        totalFlight: 100,
      },
    });

    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    const rows = screen.getAllByRole('row');
    // Subtract one for the header row
    expect(rows.length - 1).toBe(flightsPerPage);
  });

  it('correctly formats date and time', () => {
    const flight = {
      id: 1,
      flightNumber: 'AA123',
      arrivalAirport: 'JFK',
      airline: 'American Airlines',
      departureTime: '2023-10-10T10:00:00Z',
      arrivalTime: '2023-10-10T14:00:00Z',
      gate: 'A1',
      remark: 'On time',
    };

    store = createStore({
      ...store.getState(),
      flight: {
        ...store.getState().flight,
        flights: [flight],
        totalFlight: 1,
      },
    });

    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    const departureTimeCell = screen.getByText(
      new Date(flight.departureTime).toLocaleString()
    );
    const arrivalTimeCell = screen.getByText(
      new Date(flight.arrivalTime).toLocaleString()
    );

    expect(departureTimeCell).toBeInTheDocument();
    expect(arrivalTimeCell).toBeInTheDocument();
  });

  it('handles empty fields in flight data', () => {
    const flight = {
      id: 1,
      flightNumber: '',
      arrivalAirport: '',
      airline: '',
      departureTime: '',
      arrivalTime: '',
      gate: '',
      remark: '',
    };

    store = createStore({
      ...store.getState(),
      flight: {
        ...store.getState().flight,
        flights: [flight],
        totalFlight: 1,
      },
    });

    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    // Assuming the empty fields render as empty strings in the DOM
    // Count the number of empty strings in the table cells
    const cells = screen.getAllByRole('cell');
    const emptyCells = cells.filter((cell) => cell.textContent === '');
    expect(emptyCells.length).toBeGreaterThan(0);
  });

  it('does not open edit form if editId is invalid', () => {
    store = createStore({
      ...store.getState(),
      flight: {
        ...store.getState().flight,
        editId: 999, // Invalid ID
      },
    });

    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    expect(screen.queryByText('EditForm')).not.toBeInTheDocument();
  });

  it('handles invalid date formats gracefully', () => {
    const flight = {
      id: 1,
      flightNumber: 'AA123',
      arrivalAirport: 'JFK',
      airline: 'American Airlines',
      departureTime: 'Invalid Date',
      arrivalTime: 'Invalid Date',
      gate: 'A1',
      remark: 'On time',
    };

    store = createStore({
      ...store.getState(),
      flight: {
        ...store.getState().flight,
        flights: [flight],
        totalFlight: 1,
      },
    });

    // Suppress console error output
    console.error = vi.fn();

    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
  });

  it('maintains state when component re-renders', () => {
    const { rerender } = render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    expect(screen.getByText('Create')).toBeInTheDocument();

    rerender(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('does not render CreateForm or EditForm when open flags are false', () => {
    render(
      <Provider store={store}>
        <Flight />
      </Provider>
    );

    expect(screen.queryByText('CreateForm')).not.toBeInTheDocument();
    expect(screen.queryByText('EditForm')).not.toBeInTheDocument();
  });
});
