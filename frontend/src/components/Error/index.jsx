import { Result } from 'antd';
import Button from '../Button';

const Error = ({ message }) => {
  return (
    <Result
      status="error"
      title={message}
      extra={
        <div className="flex justify-center">
          <Button onClick={() => window.location.reload()} color="blue">
            Reload this page
          </Button>
        </div>
      }
    />
  );
};

export default Error;
