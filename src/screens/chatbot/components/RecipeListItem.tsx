import React, {FC} from 'react';
import {defaultTheme} from '@flyerhq/react-native-chat-ui';
import {Image, Text, View} from 'react-native';
import {SearchItem} from '../../../api/recipe.ts';

type RecipeProps = {
  width: number;
  item: SearchItem;
};

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
