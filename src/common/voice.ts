import Voice, {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
} from '@react-native-voice/voice';
import {concat} from 'lodash';

/**
 * Class Recognizer handles speech recognition functionality.
 */
class Recognizer {
  _startHandlers: ((event: SpeechStartEvent) => void)[] = [];
  _stopHandlers: ((event: SpeechEndEvent) => void)[] = [];
  _speechErrorHandlers: ((event: SpeechErrorEvent) => void)[] = [];
  _speechResultHandlers: ((value: SpeechResultsEvent) => void)[] = [];

  constructor() {
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    Voice.onSpeechError = this.onSpeechErrorHandler.bind(this);
  }

  /**
   * Checks if voice recognition is available on the device.
   * @returns {Promise<boolean>} A promise that resolves to true if available, otherwise false.
   */

  async isAvailable(): Promise<boolean> {
    let _isAvailable = false;
    try {
      _isAvailable = !!(await Voice.isAvailable());
    } catch (e) {
      console.error(e);
    }
    return _isAvailable;
  }

  /**
   * Starts the voice recognition service.
   * @returns {Promise<void>}
   */
  async start(): Promise<void> {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Stops the voice recognition service.
   * @returns {Promise<void>}
   */
  async stop(): Promise<void> {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Handles the speech start event.
   * @param {SpeechStartEvent} event - The speech start event.
   */
  onSpeechStartHandler(event: SpeechStartEvent) {
    this._startHandlers.forEach(_handler => {
      _handler(event);
    });
  }

  /**
   * Handles the speech end event.
   * @param {SpeechEndEvent} event - The speech end event.
   */
  onSpeechEndHandler(event: SpeechEndEvent) {
    this._stopHandlers.forEach(_handler => {
      _handler(event);
    });
  }

  /**
   * Handles the speech results event.
   * @param {SpeechResultsEvent} event - The speech results event.
   */
  onSpeechResultsHandler(event: SpeechResultsEvent) {
    this._speechResultHandlers.forEach(_handler => {
      _handler(event);
    });
  }

  /**
   * Handles the speech error event.
   * @param {SpeechErrorEvent} event - The speech error event.
   */
  onSpeechErrorHandler(event: SpeechErrorEvent) {
    this._speechErrorHandlers.forEach(_handler => {
      _handler(event);
    });
  }

  /**
   * Attaches event handlers for speech events.
   * @param {((event: SpeechStartEvent) => void) | null} startHandler - Handler for speech start event.
   * @param {((event: SpeechEndEvent) => void) | null} stopHandler - Handler for speech end event.
   * @param {((event: SpeechErrorEvent) => void) | null} errorHandler - Handler for speech error event.
   * @param {((event: SpeechResultsEvent) => void) | null} speechResultHandler - Handler for speech results event.
   */
  attachListeners(
    startHandler: ((value: SpeechStartEvent) => void) | null,
    stopHandler: ((value: SpeechEndEvent) => void) | null,
    errorHandler: ((value: SpeechErrorEvent) => void) | null,
    speechResultHandler: ((value: SpeechResultsEvent) => void) | null,
  ) {
    if (startHandler) {
      this._startHandlers = concat(this._startHandlers, startHandler);
    }
    if (stopHandler) {
      this._stopHandlers = concat(this._stopHandlers, stopHandler);
    }
    if (errorHandler) {
      this._speechErrorHandlers = concat(
        this._speechErrorHandlers,
        errorHandler,
      );
    }
    if (speechResultHandler) {
      this._speechResultHandlers = concat(
        this._speechResultHandlers,
        speechResultHandler,
      );
    }
  }

  /**
   * Detaches all event handlers and removes all listeners.
   */
  detachListeners() {
    this._startHandlers = [];
    this._stopHandlers = [];
    this._speechErrorHandlers = [];
    this._speechResultHandlers = [];
    Voice.removeAllListeners();
  }
}

export default new Recognizer();
