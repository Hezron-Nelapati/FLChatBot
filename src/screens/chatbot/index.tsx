import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Chat,
  defaultTheme,
  MessageType,
  User,
} from '@flyerhq/react-native-chat-ui';
import Input from './components/Input.tsx';
import {
  COMMAND_HELP,
  COMMAND_HOW_TO_MAKE,
  COMMAND_LIST,
  COMMAND_SEARCH,
  HELP_MESSAGE,
  ITEM_LOADER,
  KEYWORD_INGREDIENTS,
  RECIPE_INFORMATION_ITEM,
  RECIPE_INGREDIENT_ITEM,
  RECIPE_INSTRUCTION_ITEM,
  RECIPE_LIST_ITEM,
  WELCOME_MESSAGE,
} from '../../common/enum.ts';
import Recipe, {
  APIResponse,
  Information,
  Ingredient,
  Instruction,
  SearchItem,
} from '../../api/recipe.ts';
import {
  filter,
  includes,
  isEmpty,
  isEqual,
  startsWith,
  toLower,
  words,
} from 'lodash';
import {getMessagesFromResponse, uuidv4} from './util.ts';
import useError from '../../hooks/use-error.ts';
import RecipeListItem from './components/RecipeListItem.tsx';
import {ActivityIndicator, Text, View} from 'react-native';
import RecipeInfoItem from './components/RecipeInfoItem.tsx';
import RecipeIngredientItem from './components/RecipeIngredientItem.tsx';
import RecipeInstructionItem from './components/RecipeInstructionItem.tsx';
import cache from '../../storage/cache.ts';
import {useNetInfo} from '@react-native-community/netinfo';

/**
 * ChatBot is a functional component that manages the chatbot interface,
 * handling user messages, voice recognition, and recipe information.
 *
 * @component
 * @returns {JSX.Element} The ChatBot component.
 */
export default function ChatBot() {
  const user = useRef<User>({
    id: '06c33e8b-e835-4736-80f4-63f44b66666c',
    firstName: 'Futuristic',
    lastName: 'Labs',
  });
  const system = useRef<User>({
    id: '06c33e8b-e835-5736-80f4-63f44b66666c',
    firstName: 'Recipe',
    lastName: 'Bot',
  });
  const recipeAPI = useRef<Recipe>(new Recipe());
  const loaderMessage = useRef<MessageType.Custom>({
    author: system.current,
    createdAt: Date.now(),
    id: uuidv4(),
    type: 'custom',
    metadata: {ITEM_TYPE: ITEM_LOADER},
  });

  const {isConnected, isInternetReachable} = useNetInfo();
  const _err = useError('');

  const [messages, setMessages] = useState<MessageType.Any[]>([]);

  useEffect(() => {
    cache.get().then((_: MessageType.Any[]) => {
      if (!isEmpty(_)) {
        setMessages(_);
      } else {
        addMessage({
          author: system.current,
          createdAt: Date.now(),
          id: uuidv4(),
          text: WELCOME_MESSAGE,
          type: 'text',
        });
      }
    });
    return () => {
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    if (!isConnected || !isInternetReachable) {
      _err.set('No Internet Connection');
    } else {
      _err.clear();
    }
  }, [isConnected, isInternetReachable]);

  /**
   * Adds a message to the chat.
   * @param {MessageType.Any} message - The message to add.
   */
  const addMessage = useCallback((message: MessageType.Any) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setMessages(messages => {
      cache.set([message, ...messages]);
      return [message, ...messages];
    });
  }, []);

  /**
   * Removes a message from the chat.
   * @param {MessageType.Any} message - The message to remove.
   */
  const removeMessage = useCallback((message: MessageType.Any) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setMessages(messages => {
      const filtered = filter(messages, _ => _.id !== message.id);
      cache.set(filtered);
      return filtered;
    });
  }, []);

  /**
   * Handles commands input by the user.
   * @param {string} command - The command to handle.
   */
  const handleCommand = useCallback(async (command: string) => {
    if (isEqual(command, COMMAND_HELP)) {
      return addMessage({
        author: system.current,
        createdAt: Date.now(),
        id: uuidv4(),
        text: HELP_MESSAGE,
        type: 'text',
      });
    }
    const recipe_end_regex =
        /^(?:list |)([^\s]+(?:\s[^\s]+)*)\s(?:recipes|recipe)$/i,
      name_end_regex =
        /^(?:search recipes on |ingredients for |how to make )([^\s]+(?:\s[^\s]+)*)$/i;

    let recipe_name: string | null = null;
    if (command.match(recipe_end_regex)) {
      recipe_name = command.match(recipe_end_regex)?.[1] ?? null;
    } else if (command.match(name_end_regex)) {
      recipe_name = command.match(name_end_regex)?.[1] ?? null;
    }

    if (recipe_name) {
      const _words = words(command);
      let result: APIResponse;
      if (includes(_words, COMMAND_SEARCH) || includes(_words, COMMAND_LIST)) {
        /**
         * List / Search recipes on * - search recipes
         */
        result = await recipeAPI.current.search(recipe_name);
      } else if (
        startsWith(command, COMMAND_HOW_TO_MAKE) ||
        includes(_words, KEYWORD_INGREDIENTS)
      ) {
        /**
         * How to make * - Instructions
         * Ingredients for * - Ingredients
         */
        result = startsWith(command, COMMAND_HOW_TO_MAKE)
          ? await recipeAPI.current.instructions(recipe_name)
          : await recipeAPI.current.ingredients(recipe_name);
      } else {
        /**
         * * recipe - RecipeListItem Information / Summary
         */
        result = await recipeAPI.current.info(recipe_name);
      }
      if (result.message) {
        return addMessage({
          author: system.current,
          createdAt: Date.now(),
          id: uuidv4(),
          text: result.message,
          type: 'text',
        });
      }
      getMessagesFromResponse(result, system.current).forEach(msg =>
        addMessage(msg),
      );
    } else {
      addMessage({
        author: system.current,
        createdAt: Date.now(),
        id: uuidv4(),
        text: 'Unknown command: This command is currently not supported.',
        type: 'text',
      });
    }
  }, []);

  /**
   * Handles the send button press event.
   * @param {string} message - The message to send.
   */
  const handleSendPress = useCallback((message: string | any) => {
    const textMessage: MessageType.Text = {
      author: user.current,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message,
      type: 'text',
    };
    addMessage(textMessage);
    addMessage(loaderMessage.current);
    handleCommand(toLower(message))
      .then(_ => removeMessage(loaderMessage.current))
      .catch(_ => removeMessage(loaderMessage.current));
  }, []);

  /**
   * Custom input component for the chat.
   * @returns {JSX.Element} The custom input component.
   */
  const CustomInput = useCallback(() => {
    return <Input onSend={handleSendPress} />;
  }, [handleSendPress]);

  /**
   * Custom message renderer for the chat.
   * @param {MessageType.Custom} _message - The custom message to render.
   * @param {number} _messageWidth - The width of the message.
   * @returns {JSX.Element | null} The custom message component.
   */
  const CustomMessage = useCallback(
    (_message: MessageType.Custom, _messageWidth: number) => {
      const msgType: string | null = _message?.metadata?.ITEM_TYPE ?? null;
      let stringifiedItem: string | null =
        _message?.metadata?.ITEM_VALUE ?? null;
      if (!stringifiedItem) {
        return null;
      }
      const item: Information | SearchItem | Ingredient[] | Instruction[] =
        JSON.parse(stringifiedItem);
      switch (msgType) {
        case RECIPE_LIST_ITEM:
          // @ts-ignore
          return <RecipeListItem width={_messageWidth} item={item} />;
        case RECIPE_INFORMATION_ITEM:
          // @ts-ignore
          return <RecipeInfoItem width={_messageWidth} item={item} />;
        case RECIPE_INGREDIENT_ITEM:
          // @ts-ignore
          return <RecipeIngredientItem width={_messageWidth} item={item} />;
        case RECIPE_INSTRUCTION_ITEM:
          // @ts-ignore
          return <RecipeInstructionItem width={_messageWidth} item={item} />;
        case ITEM_LOADER:
          return (
            <ActivityIndicator
              color={defaultTheme.colors.primary}
              size={'small'}
            />
          );
      }
      return null;
    },
    [],
  );

  return (
    <View style={{flex: 1}}>
      {_err.value.bool ? (
        <Text style={{color: 'red', position: 'absolute', top: 12}}>
          {_err.value.msg}
        </Text>
      ) : null}
      <Chat
        locale="en"
        messages={messages}
        onSendPress={handleSendPress}
        user={user.current}
        showUserNames={true}
        customBottomComponent={CustomInput}
        renderCustomMessage={CustomMessage}
      />
    </View>
  );
}
