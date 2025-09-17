import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './home';
import Setting from './setting';
import { NavigationContainer } from '@react-navigation/native';
import { Images } from './component/images';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

const TabBarIcons = ({ route, focused }: any) => {
  let iconName, setColor;
  if (route.name === 'Home') {
    iconName = Images.home;
    setColor = focused ? 'blue' : 'black';
  } else if (route.name === 'Setting') {
    iconName = Images.settingTint;
    setColor = focused ? 'blue' : 'black';
  }
  return (
    <Image
      tintColor={setColor}
      style={{ width: 25, height: 25 }}
      source={iconName}
    />
  );
};

const BottomBar = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            return <TabBarIcons focused={focused} style={{}} route={route} />;
          },
          headerShown: false,
          tabBarActiveTintColor: 'rgba(23, 88, 228, 1)',
          tabBarInactiveTintColor: '#FFF',
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            color: '#000',
          },
          tabBarStyle: {
            backgroundColor: 'rgba(129, 161, 236, 1)',
            height: 80,
            borderTopWidth: 0.5,
            borderTopColor: '#e6d9d9ff',
            elevation: 10,
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Setting" component={Setting} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default BottomBar;
