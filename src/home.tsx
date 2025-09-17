import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { setTemperatureUnit } from './redux/settingsSlice';
import { RootState } from './redux/store';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const apiKey = '720fae6fe54e9576b8c9b1ce249d43a7';
const city = 'Delhi';

type ItemProps = {
  item: Article;
};

interface Article {
  name: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string; url: string };
}

const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [forecast, setForecast] = useState([]);
  const [mainWeather, setMainWeather] = useState([]);
  const [temperature, setTemperature] = useState();
  const [cityName, setCityName] = useState();
  const [expanded, setExpanded] = useState(false);
  const { temperatureUnit, newsCategories } = useSelector(
    (state: RootState) => state.settings,
  );

  useEffect(() => {
    fetchNews();
    fetchWeather();
    fetchDayWeather();
  }, []);

  const fetchWeather = async () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    )
      .then(response => response.json())
      .then(data => {
        const cityName = data.name;
        const mainWeather = data.weather[0].main;
        const temperature = data.main.temp;
        setMainWeather(mainWeather);
        setTemperature(temperature);
        setCityName(cityName);
        console.log('City:', cityName);
        console.log('Main:', mainWeather);
        console.log('Temp:', temperature);
      })
      .catch(error => console.error('Error fetching weather:', error));
  };

  const fetchDayWeather = async () => {
    try {
      const response = await fetch(
        'https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=267f205f55bf3100d04a08682b84c663&units=metric',
      );
      const data = await response.json();
      const dailyData: Record<string, number[]> = {};
      data.list.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item.main.temp);
      });
      const fiveDays: any = Object.keys(dailyData)
        .slice(0, 5)
        .map(date => {
          const temps = dailyData[date];
          const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

          return {
            day: moment(date).format('ddd'),
            temp: Math.round(avgTemp),
          };
        });

      console.log(fiveDays);
      setForecast(fiveDays);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchNews = async (): Promise<Article[]> => {
    try {
      const response = await fetch(
        'https://newsapi.org/v2/top-headlines/sources?apiKey=d115da3e68294127a4a33b5af4133187',
      );
      const data = await response.json();
      if (newsCategories.length === 0) {
        setArticles(data.sources);
      } else {
        setArticles(
          data.sources.filter((e: any) => newsCategories.includes(e.category)),
        );
      }

      return data.sources;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  };
  const convertTemp = (tempC: number, unit: 'C' | 'F') => {
    return unit === 'C' ? tempC : (tempC * 9) / 5 + 32;
  };

  const renderItem = ({ item }: ItemProps) => {
    return (
      <View style={{ marginVertical: 5 }}>
        <TouchableOpacity
          style={styles.newsItem}
          onPress={() => Linking.openURL(item.url)}
        >
          <View style={styles.newsText}>
            <Text style={styles.newsTitle}>{item.name}</Text>
            <Text style={styles.newsDescription}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeatherItem = ({ item, index }: any) => {
    const temp = Math.round(convertTemp(item.temp, temperatureUnit));
    return (
      <View style={[styles.forecastContainer]}>
        <Text numberOfLines={1} style={styles.forecastDay}>
          {' '}
          {String(item.day).toUpperCase()}
        </Text>
        <Text style={styles.forecastTemp}>
          {temp}°{temperatureUnit}
        </Text>
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchNews();
    }, [newsCategories]),
  );
  const temp = Math.round(convertTemp(Number(temperature), temperatureUnit));
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.weatherSection}>
        <View style={styles.rowViewStyle}>
          <View>
            <Text style={styles.city}>{cityName}</Text>
            <Text style={styles.temperature}>
              {temp}°{temperatureUnit}
            </Text>
            <Text style={styles.condition}>{mainWeather}</Text>
          </View>
          <Image
            source={require('./assests/cloudy.png')}
            style={styles.coludIConStyle}
          />
        </View>

        <View style={{ height: 100, width: '100%' }}>
          <FlatList
            contentContainerStyle={{
              width: '100%',
              justifyContent: 'space-evenly',
            }}
            data={forecast}
            renderItem={renderWeatherItem}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={articles}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          extraData={newsCategories}
          keyExtractor={(item, index) => index + 'news'}
        />
      </View>
    </SafeAreaView>
  );
};
export default Home;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  weatherSection: {
    backgroundColor: '#a7c0ecff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
  },
  city: { fontSize: 24, fontWeight: '700', color: '#000', marginTop: 10 },
  temperature: { fontSize: 30, fontWeight: '600', color: '#000' },
  condition: { fontSize: 18, color: '#000', marginBottom: 15 },
  forecastContainer: {
    borderRadius: 15,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    alignItems: 'center',
  },
  forecastItem: { width: '80%' },
  forecastDay: {
    fontWeight: '700',
    flex: 1,
    padding: 10,
    color: '#f6f6f6',
    textAlign: 'center',
    width: '100%',
  },
  forecastTemp: {
    fontSize: 14,
    flex: 1,
    padding: 10,
    textAlign: 'center',
    width: '100%',
    fontWeight: '600',
    color: '#000',
  },
  newsItem: {
    gap: 10,

    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 20,
    elevation: 1,
  },
  newsText: { flex: 1, padding: 10 },
  newsTitle: { fontWeight: '600', fontSize: 16 },
  newsDescription: { color: '#555', fontSize: 12 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 0.5,
    borderColor: '#000',
  },
  coludIConStyle: {
    height: 100,
    width: 100,
    margin: 10,
  },
  rowViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
