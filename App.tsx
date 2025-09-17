import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import BottomBar from './src/bottombar';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <BottomBar />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
