import React from 'react';
import { Modal, notification } from 'antd';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { controlScreen } from '../../store/slices/screenSlice';

const Control = ({ open, setOpen }) => {
  // Get state from redux
  const { screens, controlId, controlLoading } = useSelector(
    (state) => state.screen
  );
  const dispatch = useDispatch();

  const status = screens[controlId]?.status;

  const handleSubmit = () => {
    dispatch(
      controlScreen({
        screen: screens[controlId]?.id,
        status: 1 - status, // status 1: on, status 0: off, 1 - status = toggle(status)
      })
    )
      .unwrap()
      .then((data) => {
        notification.success({
          message: 'Notification',
          duration: 10,
          description: data.message,
        });
        setOpen(false);
      })
      .catch((error) => {
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

  return (
    <Modal
      open={open}
      // onOk={handleSubmit}
      // isLoading={isLoading}
      centered
      onCancel={handleCancel}
      footer={<></>}
    >
      <h2 className="text-2xl font-bold mb-4">Control Screen</h2>
      <div className="flex gap-x-2">
        {status === -1 ? (
          <p className="text-red-600">
            This screen is powered off. Please contact the technician.
          </p>
        ) : (
          <Button
            isLoading={controlLoading}
            onClick={handleSubmit}
            color={`${status === 0 ? 'blue' : 'red'}`}
          >
            {status === 0 ? 'Turn on' : 'Turn off'}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default Control;
