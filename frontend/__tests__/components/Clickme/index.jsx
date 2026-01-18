import { useState } from 'react';

const Clickme = ({ title }) => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('click');
    alert('server error');
  };

  return (
    <div>
      <button onClick={handleClick}>Button11</button>
      {count && <h1>{title || 'default title'}</h1>}
    </div>
  );
};
export default Clickme;
