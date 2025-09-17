import React, { JSX, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
  Pressable,
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import { String } from './component/string';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { setTemperatureUnit, toggleNewsCategory } from './redux/settingsSlice';

export default function SettingsScreen(): JSX.Element {
  const [isEnabled, setIsEnabled] = useState(false);

  const dispatch = useDispatch();
  const temperatureUnit = useSelector(
    (state: RootState) => state.settings.temperatureUnit,
  );
  const newsCategories = useSelector(
    (state: RootState) => state.settings.newsCategories,
  );
  const [categories, setCategories] = useState({
    General: false,
    Business: false,
    Sports: false,
    Technology: false,
    Entertainment: false,
    Health: false,
    Science: false,
  });

  const [filters, setFilters] = useState({
    coldDepressing: false,
    hotFear: false,
    coolHappy: true,
  });

  const toggleCategory = (category: keyof typeof categories) => {
    setCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };
  useEffect(() => {
    const selected = [];
    for (const key in categories) {
      if (Object.prototype.hasOwnProperty.call(categories, key)) {
        const element = Object(categories)[key];
        if (element) {
          selected.push(key.toLowerCase());
        }
      }
    }
    dispatch(toggleNewsCategory(selected));
  }, [categories]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{String.setting}</Text>
        <Text style={styles.sectionTitle}>{String.preference}</Text>
        <Text style={styles.description}>{String.preTem}</Text>
        <View style={styles.radioGroup}>
          <View style={styles.toggleContainer}>
            {['C', 'F'].map(unit => (
              <Pressable
                key={unit}
                style={[
                  styles.toggleButton,
                  temperatureUnit === unit && styles.activeToggle,
                ]}
                onPress={() => dispatch(setTemperatureUnit(unit as 'C' | 'F'))}
              >
                <Text
                  style={[
                    styles.toggleText,
                    temperatureUnit === unit && styles.activeToggleText,
                  ]}
                >
                  {unit === 'C' ? 'Celsius' : 'Fahrenheit'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Text style={styles.sectionTitle}>{String.newsCAt}</Text>
        {Object.keys(categories).map(category => (
          <View key={category} style={styles.checkboxContainer}>
            <CheckBox
              value={categories[category as keyof typeof categories]}
              onValueChange={() =>
                toggleCategory(category as keyof typeof categories)
              }
              tintColors={{ true: '#007bff', false: '#999' }}
            />
            <Text style={styles.checkboxLabel}>{category}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>{String.weatherfilter}</Text>
        <View style={styles.switchContainer}>
          <Text>{String.coldShow}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#4092dfff' }}
            thumbColor={isEnabled ? '#0f0e04ff' : '#f4f3f4'}
            value={filters.coldDepressing}
            onValueChange={value =>
              setFilters({ ...filters, coldDepressing: value })
            }
          />
        </View>
        <View style={styles.switchContainer}>
          <Text>{String.fearweather}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#4092dfff' }}
            thumbColor={isEnabled ? '#0f0e04ff' : '#f4f3f4'}
            value={filters.hotFear}
            onValueChange={value => setFilters({ ...filters, hotFear: value })}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text>{String.happyWeather}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#4092dfff' }}
            thumbColor={isEnabled ? '#0f0e04ff' : '#f4f3f4'}
            value={filters.coolHappy}
            onValueChange={value =>
              setFilters({ ...filters, coolHappy: value })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    fontSize: 18,
  },
  description: { color: '#555', marginBottom: 10, fontSize: 12 },
  radioGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkboxLabel: { marginLeft: 8 },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  },

  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    borderRadius: 25,
    backgroundColor: '#ddd',
    padding: 5,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: '#4092dfff',
  },
  toggleText: {
    fontSize: 16,
    color: '#555',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
