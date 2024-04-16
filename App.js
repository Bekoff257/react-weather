import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, View } from "react-native";
import Loader from "./components/loader";
import { useEffect, useState } from "react";
import Weather from "./components/weather";
import * as Location from "expo-location";
import axios from "axios";

const API_KEY = "22d4b636da71a82eacdc2d29860a3761";

export default function App() {
  const [isLoader, setIsLoader] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);

  const getWeather = async (longitude, latitude) => {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    setLocation(data);
    setIsLoader(false);
  };

  const setWeather = async (query) => {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`
      );
      setLocation(data);
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      Alert.alert("I can't find this city! :(. Try again!");
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});

      getWeather(longitude, latitude);
    } catch (error) {
      Alert.alert("I can't find your current Location! :(. Try again!");
    }
  };

  // getLocation();

  useEffect(() => {
    getLocation();
  }, []);
  return isLoader ? (
    <Loader />
  ) : (
    <Weather
      setWeather={setWeather}
      temp={location.main.temp}
      name={location.name}
      condition={location.weather[0].main}
    />
  );
}

const styles = StyleSheet.create({});
