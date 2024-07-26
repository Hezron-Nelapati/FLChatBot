import Voice, {
  SpeechEndEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
} from '@react-native-voice/voice';
import {concat} from 'lodash';

class Recognizer {
  _startHandlers: ((event: SpeechStartEvent) => void)[] = [];
  _stopHandlers: ((event: SpeechEndEvent) => void)[] = [];
  _speechResultHandlers: ((value: SpeechResultsEvent) => void)[] = [];

  constructor() {
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
  }

  async isAvailable(): Promise<boolean> {
    let _isAvailable = false;
    try {
      _isAvailable = !!(await Voice.isAvailable());
    } catch (e) {
      console.error(e);
    }
    return _isAvailable;
  }

  async start(): Promise<void> {
    try {
      const _result = await Voice.start('en-US');
      if (_result !== null) {
        throw new Error(JSON.stringify(_result));
      }
    } catch (e) {
      console.error(e);
    }
  }

  async stop(): Promise<void> {
    try {
      const _result = await Voice.stop();
      if (_result !== null) {
        throw new Error(JSON.stringify(_result));
      }
    } catch (e) {
      console.error(e);
    }
  }

  onSpeechStartHandler(event: SpeechStartEvent) {
    this._startHandlers.forEach(_handler => {
      _handler(event);
    });
  }

  onSpeechEndHandler(event: SpeechEndEvent) {
    this._stopHandlers.forEach(_handler => {
      _handler(event);
    });
  }

  onSpeechResultsHandler(event: SpeechResultsEvent) {
    this._speechResultHandlers.forEach(_handler => {
      _handler(event);
    });
  }

  attachListeners(
    startHandler: ((value: SpeechStartEvent) => void) | null,
    stopHandler: ((value: SpeechEndEvent) => void) | null,
    speechResultHandler: ((value: SpeechResultsEvent) => void) | null,
  ) {
    if (startHandler) {
      this._startHandlers = concat(this._startHandlers, startHandler);
    }
    if (stopHandler) {
      this._stopHandlers = concat(this._stopHandlers, stopHandler);
    }
    if (speechResultHandler) {
      this._speechResultHandlers = concat(
        this._speechResultHandlers,
        speechResultHandler,
      );
    }
  }

  detachListeners() {
    this._startHandlers = [];
    this._stopHandlers = [];
    this._speechResultHandlers = [];
    Voice.removeAllListeners();
  }
}

export default new Recognizer();
