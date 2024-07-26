import AsyncStorage from '@react-native-async-storage/async-storage';
import {MessageType} from '@flyerhq/react-native-chat-ui';

const CACHE_KEY: string = 'fl_chatbot_cache';

class Cache {
  async set(data: MessageType.Any[]) {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(CACHE_KEY, jsonValue);
    } catch (e) {
      // saving error
      console.error(e);
    }
  }

  async get(): Promise<MessageType.Any[]> {
    let messages: MessageType.Any[] = [];
    try {
      const jsonValue = await AsyncStorage.getItem(CACHE_KEY);
      if (jsonValue != null) {
        messages = JSON.parse(jsonValue);
      }
    } catch (e) {
      // error reading value
      console.error(e);
    }
    return messages;
  }
}

export default new Cache();
