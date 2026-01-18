import React from 'react';
import { Modal, notification } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import MessageBoard from '../../components/MessageBoard';
import Button from '../../components/Button';
import {
  setSelectedTemplate,
  deleteMessageTemplate,
  deleteAllMessageTemplate,
  setBlock,
} from '../../store/slices/liveMessageSlice';

const SelectTemplate = ({ open, setOpen }) => {
  // Get state from redux
  const {
    messageTemplates,
    selectedTemplate,
    deleteTemplateLoading,
    deleteAllTemplateLoading,
  } = useSelector((state) => state.liveMessage);
  const dispatch = useDispatch();

  const handleSelect = () => {
    // Dispatche the action with the current flight data
    dispatch(
      setBlock(messageTemplates.find((item) => item.id === selectedTemplate))
    );
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteMessageTemplate(selectedTemplate))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Notification',
          duration: 10,
          description: 'Message template deleted successfully',
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Notification',
          duration: 10,
          description: error,
        });
      });
  };

  const handleDeleteAll = () => {
    dispatch(deleteAllMessageTemplate())
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Notification',
          duration: 10,
          description: 'Message template deleted successfully',
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Notification',
          duration: 10,
          description: error,
        });
      });
  };

  return (
    <Modal
      open={open}
      // onOk={handleSubmit}
      // isLoading={isLoading}

      centered
      width={1150}
      onCancel={handleCancel}
      footer={
        <div className="flex justify-between">
          <div className="flex gap-x-2">
            <Button color="gray" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSelect}>Select</Button>
          </div>
          <div className="flex gap-x-2">
            <Button
              color="red"
              isLoading={deleteTemplateLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              color="yellow"
              isLoading={deleteAllTemplateLoading}
              onClick={handleDeleteAll}
            >
              Clear all
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-y-4 mt-5 p-2 max-h-[500px] overflow-auto">
        {messageTemplates.map((item) => (
          <div
            key={item.id}
            className={`${
              selectedTemplate === item.id
                ? 'outline-4 outline-double outline-lime-500'
                : null
            }`}
            onClick={() => {
              dispatch(setSelectedTemplate(item.id));
            }}
          >
            <MessageBoard block={item} isInfinite={true} />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default SelectTemplate;
