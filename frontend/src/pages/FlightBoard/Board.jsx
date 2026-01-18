import { useState, useEffect, useRef } from 'react';
import departure from '../../assets/departure.png';
import arrival from '../../assets/arrival.png';
import MessageBoard from '../../components/MessageBoard';
import { useDispatch, useSelector } from 'react-redux';
import { dequeueBlock } from '../../store/slices/flightBoardSlice';
import RunningText from '../../components/RunningText';

const Board = () => {
  const { flights, blocks, area } = useSelector((state) => state.flightBoard);
  const { airlines } = useSelector((state) => state.airline);
  const dispatch = useDispatch();
  const messageRef = useRef();
  const [resetElement, setResetElement] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState('');

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Get hours and pad with 0 if needed
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes and pad with 0 if needed
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const handleAnimationEnd = () => {
      console.log('animation end!!!!!!!!!!!');
      dispatch(dequeueBlock());
      setResetElement((prev) => prev + 1);
    };

    const element = messageRef.current;
    if (element) {
      element.addEventListener('animationend', handleAnimationEnd);
    }

    // Clean up the event listener on unmount
    return () => {
      if (element) {
        element.removeEventListener('animationend', handleAnimationEnd);
      }
    };
  }, [resetElement]);

  useEffect(() => {
    setCurrentDateTime(getCurrentTime());
    const interval = setInterval(() => {
      setCurrentDateTime(getCurrentTime());
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col w-[1050px]">
      <div className="flex justify-between bg-[#08172C] p-1 items-center gap-x-2">
        <img
          className="h-[64px] object-cover rounded-md border-[3px] border-black"
          src={area === 'departure' ? departure : arrival}
          alt=""
        />
        <div className="flex justify-between flex-grow p-2">
          <p className="text-5xl font-medium text-white">
            {area === 'departure'
              ? 'Chuyến đi / Departures'
              : 'Chuyến đến / Arrivals'}
          </p>
          <p className="text-5xl text-white">{currentDateTime}</p>
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className={`flex ${
            area === 'departure' ? 'bg-[#1e90ff]' : 'bg-[#a51e1c]'
          } text-white`}
        >
          <div className="font-medium w-[110px] border-r border-[#08172C] p-2">
            <p className="text-center">KẾ HOẠCH</p>
            <p className="text-center">SCHEDULED</p>
          </div>
          <div className="font-medium w-[110px] border-r border-[#08172C] p-2">
            <p className="text-center">DỰ KIẾN</p>
            <p className="text-center">ESTIMATED</p>
          </div>
          <div className="font-medium w-[220px] border-r border-[#08172C] text-left p-2">
            <p>{area === 'departure' ? 'NƠI ĐẾN' : 'ĐẾN TỪ'}</p>
            <p>{area === 'departure' ? 'DESTINATION' : 'FROM'}</p>
          </div>
          <div className="font-medium w-[100px] border-r border-[#08172C] p-2">
            <p className="text-center">HÃNG</p>
            <p className="text-center">AIRLINES</p>
          </div>
          <div className="font-medium w-[80px] border-r border-[#08172C] text-left p-2">
            <p className="text-center">CHUYẾN</p>
            <p className="text-center">FLIGHT</p>
          </div>
          <div className="font-medium w-[60px] border-r border-[#08172C] p-2">
            <p className="text-center">CỬA</p>
            <p className="text-center">GATE</p>
          </div>
          <div className="font-medium w-[370px] text-left p-2">
            <p>GHI CHÚ</p>
            <p>REMARKS</p>
          </div>
        </div>
        {Array.from({ length: 12 }).map((_, index) => {
          const flight = flights[index] || {};
          return (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? 'bg-black' : 'bg-[#484848]'
              } text-white h-9`}
            >
              <div className="text-nowrap overflow-hidden w-[110px] border-r border-[#08172C] text-center p-2">
                {flight.departureTime
                  ? (() => {
                      const date = new Date(flight.departureTime);
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        '0'
                      );
                      return `${hours}:${minutes}`;
                    })()
                  : ''}
              </div>
              <div className="text-nowrap overflow-hidden w-[110px] border-r border-[#08172C] text-yellow-300 text-center p-2">
                {flight.estimated || ''}
              </div>
              <div className="text-nowrap overflow-hidden w-[220px] border-r border-[#08172C] p-2">
                <RunningText
                  data={flight.arrivalAirport}
                  containerLength={220}
                />
              </div>
              <div className="text-nowrap overflow-hidden w-[100px] border-r border-[#08172C]">
                <img
                  src={
                    flight.airlineId
                      ? airlines
                        ? airlines.find((item) => item.id === flight.airlineId)
                            ?.image
                        : null
                      : null
                  }
                  alt=""
                />
              </div>
              <div className="text-nowrap overflow-hidden w-[80px] border-r border-[#08172C] p-2">
                {flight.flightNumber || ''}
              </div>
              <div className="text-nowrap overflow-hidden w-[60px] border-r border-[#08172C] text-yellow-300 text-center p-2">
                {flight.gate || ''}
              </div>
              <div className="text-nowrap overflow-hidden w-[370px] p-2 text-yellow-300 relative">
                <RunningText data={flight.remark} containerLength={370} />
              </div>
            </div>
          );
        })}
      </div>
      <MessageBoard
        key={resetElement}
        block={blocks.length > 0 ? blocks[0] : undefined}
        isInfinite={false}
        ref={messageRef}
      />

      {/* <div className="flex">
        {blocks.map((item) => (
          <>
            <p>
              (message = {item.message}, stopOver = {item.stopOver})
            </p>
          </>
        ))}
      </div> */}
    </div>
  );
};

export default Board;
