import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = () => {
  async function getData<Type>(key: string): Promise<Type | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? (JSON.parse(jsonValue) as Type) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async function storeData<Type>(key: string, data: Type) {
    try {
      const stringifyValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, stringifyValue);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return {
    storeData,
    getData,
  };
};
