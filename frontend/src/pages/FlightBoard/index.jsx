import React, { useEffect } from 'react';
import { PoweroffOutlined, ToolOutlined } from '@ant-design/icons';
import { socket } from '../../utils/socket';
import { useSelector, useDispatch } from 'react-redux';
import {
  setArea,
  enqueueBlock,
  setFlights,
  setIsConnected,
  setIsConnecting,
  setSelectedScreen,
  setIsOpen,
} from '../../store/slices/flightBoardSlice';
import { getAllScreens } from '../../store/slices/screenSlice';
import { getAirlinesImg } from '../../store/slices/airlineSlice';
import Board from './Board';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

const FlightBoard = () => {
  const { selectedScreen, isConnected, isOpen, isConnecting, area } =
    useSelector((state) => state.flightBoard);
  const { screens, readLoading: screenReadLoading } = useSelector(
    (state) => state.screen
  );
  const { readLoading: airlineReadLoading } = useSelector(
    (state) => state.airline
  );
  const dispatch = useDispatch();

  const connectSocket = () => {
    if (socket.active) {
      socket.disconnect();
    } else {
      dispatch(setIsConnecting(true));
      socket.connect();
    }
  };

  // const toggleOnOffScreen = () => {
  //   if (!isConnected) {
  //     return;
  //   }
  //   console.log('toggle');
  //   if (isOpen) {
  //     socket.timeout(2000).emit('on-off', 0, (error, response) => {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log(response);
  //         dispatch(setIsOpen(false));
  //       }
  //     });
  //   } else {
  //     socket.timeout(2000).emit('on-off', 1, (error, response) => {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log(response);
  //         dispatch(setIsOpen(true));
  //       }
  //     });
  //   }
  // };

  useEffect(() => {
    dispatch(getAllScreens());
    dispatch(getAirlinesImg());
  }, []);

  useEffect(() => {
    const onDisconnect = () => {
      dispatch(setIsConnected(false));
    };
    const onConnectError = () => {
      console.log('connect error');
    };

    const onLiveMessage = (data, callback) => {
      dispatch(enqueueBlock(data));
      // console.log(data);
      callback('ok');
    };

    const onOnOff = (data, callback) => {
      callback('ok');
      dispatch(setIsOpen(data));
    };

    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('live-message', onLiveMessage);
    socket.on('on-off', onOnOff);

    return () => {
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('live-message', onLiveMessage);
      socket.off('on-off', onOnOff);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log(selectedScreen);
      socket
        .timeout(2000)
        .emit('register', Number(selectedScreen), (error, response) => {
          if (error) {
            console.log(error);
            socket.disconnect();
          } else {
            console.log(response);
            dispatch(setArea(response.area));
            dispatch(setFlights([]));
            dispatch(setIsConnected(true));
          }
          dispatch(setIsConnecting(false));
          dispatch(setIsOpen(true));
        });
      console.log('connected');
    };

    socket.on('connect', onConnect);
    return () => {
      socket.off('connect', onConnect);
    };
  }, [selectedScreen]);

  useEffect(() => {
    const onUpcomingFlight = (data, callback) => {
      // console.log(data)
      dispatch(setFlights(data));
      callback('ok');
    };

    socket.on(
      area === 'departure' ? 'departure-flight' : 'arrival-flight',
      onUpcomingFlight
    );

    return () => {
      socket.off(
        area === 'departure' ? 'departure-flight' : 'arrival-flight',
        onUpcomingFlight
      );
    };
  }, [area]);

  if (screenReadLoading || airlineReadLoading) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-full flex flex-col gap-y-4 justify-center items-center">
      <div className="flex gap-x-2">
        <select
          id="screen"
          name="screen"
          onChange={(event) => {
            dispatch(setSelectedScreen(event.target.value));
          }}
          value={selectedScreen}
          disabled={isConnected}
          required
          className="block p-2 border rounded-lg border-gray-300"
        >
          {screens.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        {/* <Button
          isDisabled={isConnecting}
          onClick={connectSocket}
          color="yellow"
        >
          <ToolOutlined className="text-xl" />
        </Button> */}
        <Button isDisabled={isConnecting} onClick={connectSocket} color="red">
          <PoweroffOutlined className="text-xl" />
        </Button>
        <p className="text-xl self-center ml-4">
          <span className="">Status: </span>
          <span
            className={`${
              isConnected ? 'text-green-600' : 'text-red-600'
            } font-bold`}
          >
            {isConnected ? 'Running' : 'Power off'}
          </span>
        </p>
      </div>
      {isConnected && isOpen ? (
        <Board />
      ) : (
        <div className="w-[1050px] h-[638px] bg-black"></div>
      )}
    </div>
  );
};

export default FlightBoard;
