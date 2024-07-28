import React, {FC} from 'react';
import {defaultTheme} from '@flyerhq/react-native-chat-ui';
import {Image, Text, View} from 'react-native';
import {SearchItem} from '../../../api/recipe.ts';

type RecipeProps = {
  width: number;
  item: SearchItem;
};

/**
 * RecipeListItem is a functional component that displays a recipe item.
 *
 * @component
 * @example
 * const width = 300;
 * const item = {
 *   title: 'Recipe Title',
 *   image: 'https://example.com/image.jpg'
 * };
 * return <RecipeListItem width={width} item={item} />;
 *
 * @param {RecipeProps} props - Props containing the width and item information.
 * @param {number} props.width - The width of the component.
 * @param {SearchItem} props.item - The recipe item information including title and image.
 *
 * @returns {JSX.Element} A view component displaying a recipe item.
 */
const RecipeListItem: FC<RecipeProps> = function ({width, item}) {
  return (
    <View
      style={{
        flexDirection: 'column',
        width: width,
        alignItems: 'center',
        zIndex: 2,
        elevation: 2,
      }}>
      <Image
        style={{width: width, height: 70, marginBottom: 4}}
        source={{uri: item.image}}
        resizeMode={'contain'}
      />
      <Text
        selectable={true}
        style={{
          textAlign: 'center',
          padding: 4,
          color: defaultTheme.colors.primary,
          fontWeight: 'bold',
          textTransform: 'capitalize',
        }}>
        {item.title}
      </Text>
    </View>
  );
};

export default RecipeListItem;
