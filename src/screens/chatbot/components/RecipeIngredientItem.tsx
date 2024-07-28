import React, {FC} from 'react';
import {Text, View} from 'react-native';
import {Ingredient} from '../../../api/recipe.ts';
import {defaultTheme} from '@flyerhq/react-native-chat-ui';

type RecipeIngredientProps = {
  width: number;
  item: Ingredient[];
};

/**
 * RecipeIngredientItem is a functional component that displays a list of recipe ingredients.
 *
 * @component
 * @example
 * const width = 300;
 * const item = [
 *   {name: 'Flour', amount: {us: {value: 2, unit: 'cups'}}},
 *   {name: 'Sugar', amount: {us: {value: 1, unit: 'cup'}}},
 * ];
 * return <RecipeIngredientItem width={width} item={item} />;
 *
 * @param {RecipeIngredientProps} props - Props containing the width and list of ingredients.
 * @param {number} props.width - The width of the component.
 * @param {Ingredient[]} props.item - The list of ingredients, where each ingredient includes a name and an amount.
 *
 * @returns {JSX.Element} A view component displaying the list of ingredients.
 */
const RecipeIngredientItem: FC<RecipeIngredientProps> = function ({
  width,
  item,
}) {
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
      <Text
        selectable={true}
        style={{
          textAlign: 'center',
          color: defaultTheme.colors.primary,
          fontWeight: 'bold',
          fontSize: 16,
          textTransform: 'capitalize',
        }}>
        {'List of Ingredients:'}
      </Text>
      <View style={{paddingHorizontal: 16, paddingVertical: 12}}>
        {item.map((_, index) => {
          return (
            <React.Fragment key={`Ingredient_${index + 1}_${_.name}`}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 6,
                }}>
                <Text
                  selectable={true}
                  style={{
                    color: 'black',
                    fontSize: 12,
                    textTransform: 'capitalize',
                    textAlign: 'left',
                  }}>
                  {`${index + 1}). ${_.name} -  ${_.amount.us.value}${
                    _.amount.us.unit
                  }`}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default RecipeIngredientItem;
