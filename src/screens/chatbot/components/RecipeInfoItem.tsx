import React, {FC} from 'react';
import {Image, Text, View} from 'react-native';
import {defaultTheme} from '@flyerhq/react-native-chat-ui';
import {Information} from '../../../api/recipe.ts';
import RenderHtml from 'react-native-render-html';

type RecipeInfoProps = {
  width: number;
  item: Information;
};

/**
 * RecipeInfoItem is a functional component that displays information about a recipe.
 *
 * @component
 * @example
 * const width = 300;
 * const item = {
 *   title: "Recipe Title",
 *   image: "https://example.com/image.jpg",
 *   summary: "<p>This is a summary of the recipe.</p>"
 * };
 * return <RecipeInfoItem width={width} item={item} />;
 *
 * @param {RecipeInfoProps} props - Props containing the width and item information.
 * @param {number} props.width - The width of the component.
 * @param {Information} props.item - The recipe information including title, image, and summary.
 *
 * @returns {JSX.Element} A view component displaying recipe information.
 */
const RecipeInfoItem: FC<RecipeInfoProps> = function ({width, item}) {
  return (
    <View
      style={{
        flexDirection: 'column',
        width: width,
        zIndex: 2,
        elevation: 2,
        padding: 16,
        alignItems: 'flex-start',
      }}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
        <Image
          style={{width: 70, height: 70, marginRight: 16}}
          source={{uri: item.image}}
          resizeMode={'contain'}
        />
        <Text
          selectable={true}
          style={{
            textAlign: 'center',
            color: defaultTheme.colors.primary,
            fontWeight: 'bold',
            fontSize: 16,
            textTransform: 'capitalize',
          }}>
          {item.title}
        </Text>
      </View>
      <RenderHtml contentWidth={width} source={{html: item.summary}} />
    </View>
  );
};

export default RecipeInfoItem;
