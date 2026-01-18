import { useEffect, useRef } from 'react';

const RunningText = ({ data, containerLength }) => {
  const textRef = useRef();

  useEffect(() => {
    if (textRef.current != null) {
      const length = textRef.current.offsetWidth;
      // if remark is longer than containerLength add move animation
      if (length > containerLength) {
        textRef.current.style.animation = `remark-move ${
          (length + containerLength) / 60
        }s linear 0s infinite`;
      }
    }

    return () => {
      if (textRef.current != null) {
        textRef.current.style.animation = '';
      }
    };
  }, [data]);

  return (
    <p ref={textRef} className="absolute">
      {data || ''}
    </p>
  );
};

export default RunningText;
