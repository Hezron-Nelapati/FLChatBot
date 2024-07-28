import {
  API_INFORMATION,
  API_INGREDIENT,
  API_INSTRUCTION,
  API_SEARCH,
  RECIPE_INFORMATION_ITEM,
  RECIPE_INGREDIENT_ITEM,
  RECIPE_INSTRUCTION_ITEM,
  RECIPE_LIST_ITEM,
} from '../../common/enum.ts';
import {APIResponse, SearchItem} from '../../api/recipe.ts';
import {MessageType, User} from '@flyerhq/react-native-chat-ui';
import {concat} from 'lodash';

/**
 * Generates a UUID (version 4).
 * For testing purposes, you should probably use https://github.com/uuidjs/uuid.
 *
 * @returns {string} A UUID string.
 */
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

/**
 * Converts an API response into an array of custom messages.
 *
 * @param {APIResponse} result - The API response object.
 * @param {User} system - The system user object.
 * @returns {MessageType.Custom[]} An array of custom message objects.
 */
export const getMessagesFromResponse = (
  result: APIResponse,
  system: User,
): MessageType.Custom[] => {
  let messages: MessageType.Custom[] = [];
  const {type, response} = result;
  if (!response) {
    return messages;
  }

  switch (type) {
    case API_SEARCH:
      // @ts-ignore
      response.forEach((_: SearchItem) => {
        messages = concat(messages, {
          author: system,
          createdAt: Date.now(),
          id: uuidv4(),
          type: 'custom',
          metadata: {
            ITEM_TYPE: RECIPE_LIST_ITEM,
            ITEM_VALUE: JSON.stringify(_),
          },
        });
      });
      break;
    case API_INFORMATION:
      messages = concat(messages, {
        author: system,
        createdAt: Date.now(),
        id: uuidv4(),
        type: 'custom',
        metadata: {
          ITEM_TYPE: RECIPE_INFORMATION_ITEM,
          ITEM_VALUE: JSON.stringify(response),
        },
      });
      break;
    case API_INSTRUCTION:
      messages = concat(messages, {
        author: system,
        createdAt: Date.now(),
        id: uuidv4(),
        type: 'custom',
        metadata: {
          ITEM_TYPE: RECIPE_INSTRUCTION_ITEM,
          ITEM_VALUE: JSON.stringify(response),
        },
      });
      break;
    case API_INGREDIENT:
      messages = concat(messages, {
        author: system,
        createdAt: Date.now(),
        id: uuidv4(),
        type: 'custom',
        metadata: {
          ITEM_TYPE: RECIPE_INGREDIENT_ITEM,
          ITEM_VALUE: JSON.stringify(response),
        },
      });
      break;
  }
  return messages;
};
