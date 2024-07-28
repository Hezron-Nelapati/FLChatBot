import React, {FC, Fragment} from 'react';
import {Image, Text, View} from 'react-native';
import {Instruction, Step} from '../../../api/recipe.ts';
import {defaultTheme} from '@flyerhq/react-native-chat-ui';
import {isEmpty} from 'lodash';

type RecipeStepProps = {
  steps: Step[];
};

type RecipeInstructionProps = {
  width: number;
  item: Instruction[];
};

/**
 * RecipeSteps is a functional component that displays the steps of a recipe.
 *
 * @component
 * @example
 * const steps = [
 *   {
 *     number: 1,
 *     step: 'Mix flour and sugar',
 *     equipment: [],
 *     ingredients: [{id: 1, name: 'Flour', image: 'url_to_image'}]
 *   },
 *   {
 *     number: 2,
 *     step: 'Bake at 350 degrees',
 *     equipment: [{id: 1, name: 'Oven', image: 'url_to_image'}],
 *     ingredients: []
 *   }
 * ];
 * return <RecipeSteps steps={steps} />;
 *
 * @param {RecipeStepProps} props - Props containing the steps of the recipe.
 * @param {Step[]} props.steps - An array of steps for the recipe.
 *
 * @returns {JSX.Element} A view component displaying the steps of the recipe.
 */
const RecipeSteps: FC<RecipeStepProps> = function ({steps}) {
  return (
    <View style={{marginTop: 16}}>
      {steps.map((_, index) => {
        return (
          <Fragment key={`Step_${index + 1}_${_.step}`}>
            <View
              style={{
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
                {`Step ${_.number}: ${_.step}`}
              </Text>
              <Text
                selectable={true}
                style={{
                  color: 'black',
                  fontSize: 12,
                  textTransform: 'capitalize',
                  textAlign: 'left',
                  marginVertical: 6,
                  fontWeight: 'bold',
                }}>
                {isEmpty(_.equipment)
                  ? 'No equipments required.'
                  : 'Equipments:'}
              </Text>
              {isEmpty(_.equipment)
                ? null
                : _.equipment.map(e => {
                    return (
                      <Fragment key={`Equipment_${index + 1}_${e.id}`}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 8,
                          }}>
                          <Image
                            style={{width: 70, height: 70, marginRight: 16}}
                            source={{uri: e.image}}
                            resizeMode={'contain'}
                          />
                          <Text
                            selectable={true}
                            style={{
                              textAlign: 'center',
                              color: 'black',
                              fontWeight: 'bold',
                              fontSize: 12,
                              textTransform: 'capitalize',
                            }}>
                            {e.name}
                          </Text>
                        </View>
                      </Fragment>
                    );
                  })}
              <Text
                selectable={true}
                style={{
                  color: 'black',
                  fontSize: 12,
                  textTransform: 'capitalize',
                  textAlign: 'left',
                  marginVertical: 6,
                  fontWeight: 'bold',
                }}>
                {isEmpty(_.ingredients)
                  ? 'No ingredients required.'
                  : 'Ingredients:'}
              </Text>
              {isEmpty(_.ingredients)
                ? null
                : _.ingredients.map(i => {
                    return (
                      <Fragment key={`Ingredient_${index + 1}_${i.id}`}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 8,
                          }}>
                          <Image
                            style={{width: 70, height: 70, marginRight: 16}}
                            source={{uri: i.image}}
                            resizeMode={'contain'}
                          />
                          <Text
                            selectable={true}
                            style={{
                              textAlign: 'center',
                              color: 'black',
                              fontWeight: 'bold',
                              fontSize: 12,
                              textTransform: 'capitalize',
                            }}>
                            {i.name}
                          </Text>
                        </View>
                      </Fragment>
                    );
                  })}
            </View>
          </Fragment>
        );
      })}
    </View>
  );
};

/**
 * RecipeInstructionItem is a functional component that displays the instructions for a recipe.
 *
 * @component
 * @example
 * const width = 300;
 * const item = [
 *   {
 *     name: 'Instruction 1',
 *     steps: [
 *       {
 *         number: 1,
 *         step: 'Mix flour and sugar',
 *         equipment: [],
 *         ingredients: [{id: 1, name: 'Flour', image: 'url_to_image'}]
 *       },
 *       {
 *         number: 2,
 *         step: 'Bake at 350 degrees',
 *         equipment: [{id: 1, name: 'Oven', image: 'url_to_image'}],
 *         ingredients: []
 *       }
 *     ]
 *   }
 * ];
 * return <RecipeInstructionItem width={width} item={item} />;
 *
 * @param {RecipeInstructionProps} props - Props containing the width and instructions for the recipe.
 * @param {number} props.width - The width of the component.
 * @param {Instruction[]} props.item - An array of instructions for the recipe.
 *
 * @returns {JSX.Element} A view component displaying the instructions for the recipe.
 */
const RecipeInstructionItem: FC<RecipeInstructionProps> = function ({
  width,
  item,
}) {
  return (
    <View
      style={{
        width: width,
        zIndex: 2,
        elevation: 2,
        padding: 8,
      }}>
      <Text
        selectable={true}
        style={{
          color: defaultTheme.colors.primary,
          fontWeight: 'bold',
          fontSize: 16,
          textTransform: 'capitalize',
        }}>
        {'Instructions:'}
      </Text>
      <View style={{paddingHorizontal: 16, paddingVertical: 12}}>
        {item.map((_, index) => {
          return (
            <Fragment key={`Instruction_${index + 1}_${_.name}`}>
              <View
                style={{
                  marginBottom: 6,
                }}>
                <Text
                  selectable={true}
                  style={{
                    color: 'black',
                    fontSize: 12,
                    textTransform: 'capitalize',
                    textAlign: 'left',
                    fontWeight: 'bold',
                  }}>
                  {`Instruction on ${_.name}:`}
                </Text>
                <RecipeSteps steps={_.steps} />
              </View>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default RecipeInstructionItem;
