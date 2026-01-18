import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendMessage as sendMessageService } from '../../services/liveMessageService';
import {
  createMessageTemplate as createMessageTemplateService,
  getMessageTemplate as getMessageTemplateService,
  deleteMessageTemplate as deleteMessageTemplateService,
  deleteAllMessageTemplate as deleteAllMessageTemplateService,
} from '../../services/messageTemplateService';
import { getTranslatedText } from '../../services/translationService';

// Create the thunk
export const sendMessage = createAsyncThunk(
  'liveMessage/sendMessage',
  async (data, { rejectWithValue }) => {
    try {
      const res = await sendMessageService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const getMessageTemplate = createAsyncThunk(
  'liveMessage/getMessageTemplate',
  async (data, { rejectWithValue }) => {
    try {
      const res = await getMessageTemplateService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const createMessageTemplate = createAsyncThunk(
  'liveMessage/createMessageTemplate',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createMessageTemplateService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const deleteMessageTemplate = createAsyncThunk(
  'liveMessage/deleteMessageTemplate',
  async (data, { rejectWithValue }) => {
    try {
      const res = await deleteMessageTemplateService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const deleteAllMessageTemplate = createAsyncThunk(
  'liveMessage/deleteAllMessageTemplate',
  async (data, { rejectWithValue }) => {
    try {
      const res = await deleteAllMessageTemplateService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const translateText = createAsyncThunk(
  'liveMessage/translateText',
  async (data, { rejectWithValue }) => {
    try {
      const res = await getTranslatedText(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialBlock = {
  message: '',
  messageLength: 0,
  translatedMessage: '',
  fontFamily: 'Arial',
  isBold: false,
  isItalic: false,
  isUnderlined: false,
  fontSize: '16px',
  color: '#C9BA2B',
  backgroundColor: '#08172C',
  effect: '',
  stopOver: 1,
  translatedMesBefore: false,
};

const initialState = {
  messageTemplates: [],
  selectedTemplate: 0,
  isAutoTranslate: false,
  autoTranslateLanguage: 'en',
  block: initialBlock,
  sendLoading: false,
  readTemplateLoading: false,
  createTemplateLoading: false,
  deleteTemplateLoading: false,
  deleteAllTemplateLoading: false,
  error: '',
};

export const liveMessageSlice = createSlice({
  name: 'liveMessage',
  initialState,
  reducers: {
    resetState: (state) => {
      return initialState;
    },
    setIsAutoTranslate: (state, action) => {
      state.isAutoTranslate = action.payload;
    },
    setBlock: (state, action) => {
      state.block = action.payload;
    },
    resetBlock: (state, action) => {
      state.block = initialBlock;
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    setAutoTranslateLanguage: (state, action) => {
      state.autoTranslateLanguage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      // Add user to the state array
      state.sendLoading = false;
    }),
      builder.addCase(sendMessage.pending, (state, action) => {
        state.sendLoading = true;
      }),
      builder.addCase(sendMessage.rejected, (state, action) => {
        console.log('rejected ', action);
        state.sendLoading = false;
      });
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getMessageTemplate.fulfilled, (state, action) => {
      // Add user to the state array
      state.messageTemplates = action.payload;
      state.readTemplateLoading = false;
      state.error = '';
    }),
      builder.addCase(getMessageTemplate.pending, (state, action) => {
        state.readTemplateLoading = true;
      }),
      builder.addCase(getMessageTemplate.rejected, (state, action) => {
        console.log('rejected ', action);
        state.readTemplateLoading = false;
        state.error = 'Server error';
      });
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(createMessageTemplate.fulfilled, (state, action) => {
      // Add user to the state array
      state.messageTemplates.push(action.payload);
      state.createTemplateLoading = false;
    }),
      builder.addCase(createMessageTemplate.pending, (state, action) => {
        state.createTemplateLoading = true;
      }),
      builder.addCase(createMessageTemplate.rejected, (state, action) => {
        console.log('rejected ', action);
        state.createTemplateLoading = false;
      });
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(deleteMessageTemplate.fulfilled, (state, action) => {
      // Add user to the state array
      state.messageTemplates = state.messageTemplates.filter(
        (item) => item.id !== action.payload.id
      );

      state.deleteTemplateLoading = false;
    }),
      builder.addCase(deleteMessageTemplate.pending, (state, action) => {
        state.deleteTemplateLoading = true;
      }),
      builder.addCase(deleteMessageTemplate.rejected, (state, action) => {
        console.log('rejected ', action);
        state.deleteTemplateLoading = false;
      });
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(deleteAllMessageTemplate.fulfilled, (state, action) => {
      // Add user to the state array
      state.messageTemplates = [];

      state.deleteAllTemplateLoading = false;
    }),
      builder.addCase(deleteAllMessageTemplate.pending, (state, action) => {
        state.deleteAllTemplateLoading = true;
      }),
      builder.addCase(deleteAllMessageTemplate.rejected, (state, action) => {
        console.log('rejected ', action);
        state.deleteAllTemplateLoading = false;
      });
    builder.addCase(translateText.fulfilled, (state, action) => {
      // Add user to the state array
      console.log(action.payload);
      state.block.translatedMessage = action.payload.text;

      // state.deleteAllTemplateLoading = false;
    }),
      builder.addCase(translateText.pending, (state, action) => {
        // state.deleteAllTemplateLoading = true;
      }),
      builder.addCase(translateText.rejected, (state, action) => {
        console.log('rejected ', action);
        // state.deleteAllTemplateLoading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  resetState,
  setBlock,
  resetBlock,
  setIsAutoTranslate,
  setSelectedTemplate,
  setAutoTranslateLanguage,
} = liveMessageSlice.actions;

export default liveMessageSlice.reducer;
