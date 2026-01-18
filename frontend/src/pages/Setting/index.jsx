import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSettings, updateSetting } from '../../store/slices/settingSlice';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { notification } from 'antd';

const Setting = () => {
  const { settings, readLoading, updateLoading } = useSelector(
    (state) => state.setting
  );
  const dispatch = useDispatch();
  const [settingData, setSettingData] = useState({});

  useEffect(() => {
    dispatch(getSettings())
      .unwrap()
      .then((res) => setSettingData(res))
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = () => {
    if (settingData.screenInterval < 1 || settingData.screenInterval > 20000) {
      notification.error({
        message: 'Notification',
        duration: 10,
        description: 'Screen interval must be between 1ms and 20000ms',
      });
      return;
    }

    dispatch(updateSetting(settingData))
      .unwrap()
      .then((res) => {
        console.log(res);
        notification.success({
          message: 'Notification',
          duration: 10,
          description: 'Setting edited successfully',
        });
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: 'Notification',
          duration: 10,
          description: error,
        });
        setSettingData(settings);
      });
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setSettingData((prev) => ({ ...prev, [name]: value }));
  // };

  if (readLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Setting</h2>
      <form>
        <div className="mb-4">
          <label
            htmlFor="screenInterval"
            className="block text-sm font-medium text-gray-700"
          >
            Screen interval
          </label>
          <input
            type="text"
            id="screenInterval"
            name="screenInterval"
            value={settingData.screenInterval}
            onChange={(event) => {
              const value = event.target.value;
              const numericValue = value.replace(/[^0-9]/g, '');
              setSettingData((prev) => ({
                ...prev,
                screenInterval: Number(numericValue),
              }));
            }}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Screen interval"
          />
        </div>
      </form>
      <div className="self-start">
        <Button isLoading={updateLoading} onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Setting;
