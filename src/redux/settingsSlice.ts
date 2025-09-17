import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  temperatureUnit: 'C' | 'F';
  newsCategories: string[];
}

const initialState: SettingsState = {
  temperatureUnit: 'C',
  newsCategories: [],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTemperatureUnit(state, action: PayloadAction<'C' | 'F'>) {
      state.temperatureUnit = action.payload;
    },
    toggleNewsCategory(state, action: PayloadAction<string[]>) {
      const category = action.payload;

      state.newsCategories = [...category];
    },
  },
});

export const { setTemperatureUnit, toggleNewsCategory } = settingsSlice.actions;
export default settingsSlice.reducer;
