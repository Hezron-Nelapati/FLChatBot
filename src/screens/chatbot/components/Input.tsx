import React, {FC, useCallback, useEffect, useState} from 'react';
import {Alert, Platform, TextInput, TouchableOpacity, View} from 'react-native';
import {defaultTheme} from '@flyerhq/react-native-chat-ui';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {isEmpty, join, trim} from 'lodash';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Recognizer from '../../../common/voice';
import {SpeechResultsEvent, SpeechStartEvent} from '@react-native-voice/voice';

type InputProps = {
  onSend: (text: string) => void;
};

const Input: FC<InputProps> = function ({onSend}) {
  const [text, setText] = useState('');
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);

  useEffect(() => {
    Recognizer.isAvailable().then(_isVoiceAvailable =>
      setIsVoiceAvailable(_isVoiceAvailable),
    );
    Recognizer.attachListeners(startListener, null, resultListener);
    return () => {
      Recognizer.detachListeners();
    };
  }, []);

  const onSendAction = useCallback(() => {
    setText('');
    if (isEmpty(trim(text))) {
      return;
    }
    onSend(text);
  }, [text, onSend]);

  const startListener = useCallback((event: SpeechStartEvent) => {
    if (event.error) {
      Alert.alert('Error occurred while starting voice recognition');
    }
  }, []);

  const resultListener = useCallback(
    (event: SpeechResultsEvent) => {
      const _result = join(event.value ?? [], ' ');
      onSend(_result);
    },
    [onSend],
  );

  const checkPermissionAndStartVoiceRecognition = useCallback(async () => {
    try {
      const result = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.SPEECH_RECOGNITION
          : PERMISSIONS.ANDROID.RECORD_AUDIO,
      );
      if (result !== RESULTS.GRANTED) {
        throw new Error(result);
      }
      await Recognizer.start();
    } catch (e) {
      console.error(e);
      Alert.alert(
        'Microphone permission is required. Please try again after enabling permission.',
      );
      await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.SPEECH_RECOGNITION
          : PERMISSIONS.ANDROID.RECORD_AUDIO,
      );
    }
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: defaultTheme.colors.inputBackground,
        alignItems: 'center',
      }}>
      {isVoiceAvailable ? (
        <TouchableOpacity onPress={checkPermissionAndStartVoiceRecognition}>
          <MaterialCommunityIcons
            name={'microphone-outline'}
            color={defaultTheme.colors.inputText}
            size={24}
          />
        </TouchableOpacity>
      ) : null}
      <View
        style={{flex: 1, marginLeft: isVoiceAvailable ? 8 : 0, marginRight: 8}}>
        <TextInput
          value={text}
          style={{
            backgroundColor: defaultTheme.colors.inputBackground,
            color: defaultTheme.colors.inputText,
          }}
          onChangeText={setText}
        />
      </View>
      <TouchableOpacity onPress={onSendAction}>
        <FontAwesome
          name={'send-o'}
          color={defaultTheme.colors.inputText}
          size={16}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Input;
