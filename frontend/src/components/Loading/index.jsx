import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
};

export default Loading;
