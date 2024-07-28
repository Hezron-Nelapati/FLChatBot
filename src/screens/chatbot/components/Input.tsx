import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {defaultTheme} from '@flyerhq/react-native-chat-ui';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {isEmpty, trim} from 'lodash';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Recognizer from '../../../common/voice';
import {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
} from '@react-native-voice/voice';
import useBoolean from '../../../hooks/use-boolean.ts';

type InputProps = {
  onSend: (text: string) => void;
};

/**
 * Input is a functional component that provides a text input field with voice recognition capabilities.
 *
 * @component
 * @example
 * const handleSend = (text) => { console.log(text); };
 * return <Input onSend={handleSend} />;
 *
 * @param {InputProps} props - Props containing the onSend callback function.
 * @param {function} props.onSend - Callback function to handle sending the input text.
 *
 * @returns {JSX.Element} A view component with a text input field and voice recognition functionality.
 */
const Input: FC<InputProps> = function ({onSend}) {
  const _isVoiceAvailable = useBoolean();
  const _isRecognizing = useBoolean();

  const [text, setText] = useState('');

  useEffect(() => {
    Recognizer.isAvailable().then(isVoiceAvailable =>
      isVoiceAvailable ? _isVoiceAvailable.toggle() : null,
    );
    Recognizer.attachListeners(
      startListener,
      stopListener,
      errorListener,
      resultListener,
    );
    return () => {
      Recognizer.detachListeners();
    };
  }, []);

  const startListener = useCallback((event: SpeechStartEvent) => {
    if (event.error) {
      console.error('Error occurred while starting voice recognition');
      return;
    }
    _isRecognizing.toggle(true);
  }, []);

  const stopListener = useCallback((event: SpeechEndEvent) => {
    if (event.error) {
      console.error('Error occurred while stopping voice recognition');
    }
    _isRecognizing.toggle(false);
  }, []);

  const errorListener = useCallback((event: SpeechErrorEvent) => {
    if (event.error) {
      console.error('Error occurred while stopping voice recognition');
    }
    _isRecognizing.toggle(false);
  }, []);

  const resultListener = useCallback((event: SpeechResultsEvent) => {
    const _result = event.value?.[0] ?? '';
    setText(_result);
    _isRecognizing.toggle(false);
  }, []);

  const stopVoiceRecognition = useCallback(async () => {
    await Recognizer.stop();
  }, []);

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

  const onSendAction = useCallback(() => {
    setText('');
    if (isEmpty(trim(text))) {
      return;
    }
    onSend(text);
  }, [text, onSend]);

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: defaultTheme.colors.inputBackground,
        alignItems: 'center',
      }}>
      {_isVoiceAvailable.value ? (
        _isRecognizing.value ? (
          <TouchableOpacity onPress={stopVoiceRecognition}>
            <MaterialCommunityIcons
              name={'cancel'}
              color={defaultTheme.colors.inputText}
              size={24}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={checkPermissionAndStartVoiceRecognition}>
            <MaterialCommunityIcons
              name={'microphone-outline'}
              color={defaultTheme.colors.inputText}
              size={24}
            />
          </TouchableOpacity>
        )
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          marginLeft: _isVoiceAvailable.value ? 8 : 0,
          marginRight: 8,
        }}>
        <TextInput
          value={text}
          style={{
            backgroundColor: defaultTheme.colors.inputBackground,
            color: defaultTheme.colors.inputText,
          }}
          onChangeText={setText}
        />
        {_isRecognizing.value ? (
          <ActivityIndicator
            color={defaultTheme.colors.primary}
            size={'small'}
          />
        ) : null}
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
