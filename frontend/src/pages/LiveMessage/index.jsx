import { useRef, useEffect, useState } from 'react';
import { notification, Cascader } from 'antd';
const { SHOW_CHILD } = Cascader;
import MessageBoard from '../../components/MessageBoard';
import Error from '../../components/Error';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import SelectTemplate from './SelectTemplate';
import {
  resetState,
  setBlock,
  resetBlock,
  setIsAutoTranslate,
  sendMessage,
  createMessageTemplate,
  translateText,
  setAutoTranslateLanguage,
  getMessageTemplate,
} from '../../store/slices/liveMessageSlice';
import {
  getAllScreens,
  setSelectedScreen,
} from '../../store/slices/screenSlice';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '../../hooks/useDebounce';

const fontSizes = [
  20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54,
];
const fontFamilys = [
  'Arial',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Verdana',
  'Helvetica',
  'Lucida Console',
  'Monaco',
  'Lucida Handwriting',
  'Papyrus',
];
const effects = [
  {
    id: 1,
    text: 'Continuously move from right to left',
    value: 'move-right-to-left',
  },
  {
    id: 2,
    text: 'Continuously move from left to right',
    value: 'move-left-to-right',
  },
];
const orders = [
  {
    id: 1,
    text: 'Translated message after message',
    value: false,
  },
  {
    id: 2,
    text: 'Translated message before message',
    value: true,
  },
];
const languages = [
  { language: 'English', code: 'en' },
  { language: 'Vietnamese', code: 'vi' },
  { language: 'Spanish', code: 'es' },
  { language: 'French', code: 'fr' },
  { language: 'German', code: 'de' },
  { language: 'Chinese (Simplified)', code: 'zh' },
  { language: 'Japanese', code: 'ja' },
  { language: 'Korean', code: 'ko' },
  { language: 'Italian', code: 'it' },
  { language: 'Portuguese', code: 'pt' },
  { language: 'Russian', code: 'ru' },
  { language: 'Arabic', code: 'ar' },
  { language: 'Dutch', code: 'nl' },
  { language: 'Hindi', code: 'hi' },
  { language: 'Polish', code: 'pl' },
  { language: 'Turkish', code: 'tr' },
  { language: 'Swedish', code: 'sv' },
  { language: 'Finnish', code: 'fi' },
  { language: 'Danish', code: 'da' },
  { language: 'Norwegian', code: 'no' },
  { language: 'Hebrew', code: 'he' },
];

const mappingScreen = (screens) => {
  const gates = [];

  // Group screens by gate
  const gateMap = screens.reduce((acc, screen) => {
    const gateKey = screen.gate; // Use screen.gate directly

    // Initialize gate entry if it doesn't exist
    if (!acc[gateKey]) {
      acc[gateKey] = {
        label: `Gate ${gateKey}`, // Adjust label accordingly
        value: gateKey,
        children: [],
      };
    }

    // Add screen to the corresponding gate
    acc[gateKey].children.push({
      label: screen.name,
      value: screen.id.toString(), // Convert id to string
    });

    return acc;
  }, {});

  // Convert gateMap to an array
  for (const gate in gateMap) {
    gates.push(gateMap[gate]);
  }

  // Sort gates by gate number
  gates.sort((a, b) => {
    return parseInt(a.value) - parseInt(b.value); // Sort by gate number
  });

  return [
    {
      label: 'All gate',
      value: 'all',
      children: gates,
    },
  ];
};

const LiveMessage = () => {
  const {
    isAutoTranslate,
    sendLoading,
    block,
    error,
    readTemplateLoading,
    createTemplateLoading,
    autoTranslateLanguage,
  } = useSelector((state) => state.liveMessage);
  const {
    screens,
    selectedScreen,
    readLoading: readScreenLoading,
  } = useSelector((state) => state.screen);
  const dispatch = useDispatch();
  const messageRef = useRef();

  // Open/close popup
  const [showSelectTemplate, setShowSelectTemplate] = useState(false);
  const debouncedValue = useDebounce(block.message, 300); // 500ms delay

  useEffect(() => {
    if (debouncedValue && isAutoTranslate) {
      console.log('API Call or update with:', debouncedValue);
      console.log({
        sourceLanguage: 'vi',
        targetLanguage: autoTranslateLanguage,
        text: block.message,
      });
      dispatch(
        translateText({
          sourceLanguage: 'vi',
          targetLanguage: autoTranslateLanguage,
          text: block.message,
        })
      );
    }
  }, [debouncedValue, isAutoTranslate, autoTranslateLanguage]);

  useEffect(() => {
    if (messageRef.current) {
      dispatch(
        setBlock({ ...block, messageLength: messageRef.current.offsetWidth })
      );
    }
  }, [
    block.message,
    block.translatedMessage,
    block.isBold,
    block.isItalic,
    block.isUnderlined,
    block.fontFamily,
    block.fontSize,
  ]);

  useEffect(() => {
    dispatch(getAllScreens());
    dispatch(getMessageTemplate());

    return () => {
      dispatch(resetState());
    };
  }, []);

  const openSelectTemplate = () => {
    setShowSelectTemplate(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setBlock({ ...block, [name]: value }));
  };

  const send = async () => {
    dispatch(sendMessage({ screens: selectedScreen, block: block }))
      .unwrap()
      .then((data) => {
        const okMessage = data.message.ok;
        const failMessage = data.message.fail;
        if (okMessage !== '') {
          notification.success({
            message: 'Notification',
            duration: 10,
            description: okMessage,
          });
        }
        if (failMessage !== '') {
          notification.error({
            message: 'Notification',
            duration: 10,
            description: failMessage,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const createTemplate = () => {
    dispatch(createMessageTemplate(block))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Notification',
          duration: 10,
          description: 'Message template created successfully',
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

  // Show error page
  if (error) {
    return <Error message={error} />;
  }

  // Show loading page
  if (readTemplateLoading || readScreenLoading) {
    return <Loading />;
  }

  const onChangeSelectedScreen = (value) => {
    dispatch(setSelectedScreen(value.map((item) => Number(item[2]))));
  };

  return (
    <div className="w-full flex flex-col justify-start items-center p-2 gap-y-4">
      <SelectTemplate
        open={showSelectTemplate}
        setOpen={setShowSelectTemplate}
      />

      <div className="border border-gray-300 rounded-lg w-full p-4">
        <p className="block text-sm font-medium text-gray-700 mb-1">
          Select screens
        </p>
        <Cascader
          style={{
            width: '100%',
          }}
          showSearch={true}
          options={mappingScreen(screens)}
          onChange={onChangeSelectedScreen}
          showCheckedStrategy={SHOW_CHILD}
          multiple
          maxTagCount="responsive"
        />
      </div>

      <div className="border border-gray-300 rounded-lg w-full p-4">
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            onChange={handleChange}
            value={block.message}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="translate-message"
            className="block text-sm font-medium text-gray-700"
          >
            Translated message
          </label>
          <div className="mt-1 flex justify-evenly items-center w-full border border-gray-300 rounded-t-md">
            <div className="flex items-center w-4/12 ml-6">
              <input
                type="checkbox"
                id="isAutoTranslate"
                checked={isAutoTranslate}
                onChange={(event) => {
                  dispatch(setIsAutoTranslate(event.target.checked));
                }}
                className="mr-2"
              />
              <label
                htmlFor="isAutoTranslate"
                className="text-gray-700 select-none"
              >
                Translate automatically
              </label>
            </div>
            <select
              id="language"
              name="language"
              required
              disabled={!isAutoTranslate}
              onChange={(event) => {
                dispatch(setAutoTranslateLanguage(event.target.value));
              }}
              value={autoTranslateLanguage}
              className="block p-2 border-l-2 border-gray-300 w-8/12"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.language}
                </option>
              ))}
            </select>
          </div>
          <textarea
            id="translatedMessage"
            name="translatedMessage"
            required
            disabled={isAutoTranslate}
            onChange={handleChange}
            value={block.translatedMessage}
            className="block w-full p-2 border border-gray-300 rounded-b-md"
          />
        </div>

        <div className="flex gap-x-8 border border-gray-300 p-2 rounded-md">
          <div className="flex flex-col w-6/12 gap-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Text editor
            </label>
            <div className="flex gap-x-2">
              <select
                id="fontFamily"
                name="fontFamily"
                required
                onChange={handleChange}
                value={block.fontFamily}
                className="block p-2 border rounded-lg border-gray-300 w-9/12"
              >
                <option value="">Default font</option>
                {fontFamilys.map((item) => (
                  <option key={item} value={`${item}`}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                id="fontSize"
                name="fontSize"
                required
                onChange={handleChange}
                value={block.fontSize}
                className="block p-2 border rounded-lg border-gray-300 w-3/12"
              >
                {fontSizes.map((item) => (
                  <option key={item} value={`${item}px`}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-x-2 items-center">
              <button
                onClick={() => {
                  dispatch(setBlock({ ...block, isBold: !block.isBold }));
                }}
                className={`border ${
                  block.isBold ? 'border-gray-900 bg-gray-300' : null
                } rounded-md p-1 hover:bg-gray-200`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinejoin="round"
                    d="M6.75 3.744h-.753v8.25h7.125a4.125 4.125 0 0 0 0-8.25H6.75Zm0 0v.38m0 16.122h6.747a4.5 4.5 0 0 0 0-9.001h-7.5v9h.753Zm0 0v-.37m0-15.751h6a3.75 3.75 0 1 1 0 7.5h-6m0-7.5v7.5m0 0v8.25m0-8.25h6.375a4.125 4.125 0 0 1 0 8.25H6.75m.747-15.38h4.875a3.375 3.375 0 0 1 0 6.75H7.497v-6.75Zm0 7.5h5.25a3.75 3.75 0 0 1 0 7.5h-5.25v-7.5Z"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  dispatch(setBlock({ ...block, isItalic: !block.isItalic }));
                }}
                className={`border ${
                  block.isItalic ? 'border-gray-900 bg-gray-300' : null
                } rounded-md p-1 hover:bg-gray-200`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.248 20.246H9.05m0 0h3.696m-3.696 0 5.893-16.502m0 0h-3.697m3.697 0h3.803"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  dispatch(
                    setBlock({ ...block, isUnderlined: !block.isUnderlined })
                  );
                }}
                className={`border ${
                  block.isUnderlined ? 'border-gray-900 bg-gray-300' : null
                } rounded-md p-1 hover:bg-gray-200`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.995 3.744v7.5a6 6 0 1 1-12 0v-7.5m-2.25 16.502h16.5"
                  />
                </svg>
              </button>
              <input
                type="color"
                id="color"
                name="color"
                required
                onChange={handleChange}
                value={block.color}
              />
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                required
                onChange={handleChange}
                value={block.backgroundColor}
              />
            </div>
          </div>

          <div className="w-1 h-auto bg-gray-300"></div>

          <div className="flex flex-col w-6/12 gap-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Effect
            </label>

            <div className="flex gap-x-2">
              <select
                id="effect"
                name="effect"
                required
                onChange={handleChange}
                value={block.effect}
                className="block p-2 border rounded-lg border-gray-300 w-8/12"
              >
                <option value="">No effect</option>
                {effects.map((item) => (
                  <option key={item.id} value={`${item.value}`}>
                    {item.text}
                  </option>
                ))}
              </select>
              <div className="relative w-4/12">
                <input
                  type="text"
                  id="stopOver"
                  name="stopOver"
                  required
                  maxLength={3}
                  disabled={block.isStopBySeconds}
                  onChange={(event) => {
                    const value = event.target.value;
                    const numericValue = value.replace(/[^0-9]/g, '');
                    dispatch(
                      setBlock({ ...block, stopOver: Number(numericValue) })
                    );
                  }}
                  value={block.stopOver}
                  className="block w-full py-2 px-6 border border-gray-300 rounded-md"
                />
                <p className="absolute right-4 top-2">times</p>
              </div>
            </div>
            <div className="flex gap-x-2 items-center">
              <select
                id="translatedMesBefore"
                name="translatedMesBefore"
                required
                onChange={(event) => {
                  dispatch(
                    setBlock({
                      ...block,
                      translatedMesBefore: event.target.value === 'true',
                    })
                  );
                }}
                value={block.translatedMesBefore}
                className="block p-2 border rounded-lg border-gray-300 w-full"
              >
                {orders.map((item) => (
                  <option key={item.id} value={`${item.value}`}>
                    {item.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <MessageBoard block={block} isInfinite={true} ref={messageRef} />

      <div className="flex justify-between w-full">
        <div className="flex gap-x-4">
          <Button onClick={openSelectTemplate}>Use a template</Button>
          <Button onClick={createTemplate} isLoading={createTemplateLoading}>
            Save as template
          </Button>
        </div>
        <div className="flex gap-x-4">
          <Button color="gray" onClick={() => dispatch(resetBlock())}>
            Reset
          </Button>
          <Button
            disabled={selectedScreen.length === 0}
            onClick={send}
            color="emerald"
            isLoading={sendLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
            <p className="ml-1">Send</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveMessage;
