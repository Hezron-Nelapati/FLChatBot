import axios, {AxiosInstance} from 'axios';
import {
  API_FIND,
  API_INFORMATION,
  API_INGREDIENT,
  API_INSTRUCTION,
  API_SEARCH,
} from '../common/enum.ts';

export type Information = {
  id: number;
  title: string;
  image: string;
  summary: string;
};

export type SearchItem = {
  id: number;
  title: string;
  image: string;
  imageType: string;
};
type SearchResponse = {
  results: SearchItem[];
};

type Metric = {
  unit: string;
  value: number;
};
type Amount = {
  metric: Metric;
  us: Metric;
};
export type Ingredient = {
  name: string;
  image: string;
  amount: Amount;
};
type IngredientResponse = {
  ingredients: Ingredient[];
};

type Temperature = {
  number: number;
  unit: string;
};
type Equipment = {
  id: number;
  name: string;
  image: string;
  temperature?: Temperature;
};
type StepIngredient = {
  id: number;
  name: string;
  image: string;
};
type Length = {
  number: number;
  unit: string;
};
export type Step = {
  number: number;
  step: string;
  length?: Length;
  ingredients: StepIngredient[];
  equipment: Equipment[];
};
export type Instruction = {
  name: string;
  steps: Step[];
};

export type APIResponse = {
  response?: Information | SearchItem[] | Ingredient[] | Instruction[];
  message?: string;
  type: string;
};

export default class Recipe {
  recipeAPI: AxiosInstance | null = null;

  constructor() {
    this.recipeAPI = axios.create({
      baseURL: 'https://api.spoonacular.com/recipes',
      timeout: 3000,
      headers: {
        'x-api-key': 'a75ab578b92a4e179003663991f40e1b',
      },
    });
  }

  async find(recipe_name: string): Promise<APIResponse> {
    try {
      const {results}: SearchResponse = (
        await this.recipeAPI?.({
          url: `/complexSearch?query=${recipe_name}&number=1`,
          method: 'get',
        })
      )?.data ?? {results: []};
      return {response: results, type: API_FIND};
    } catch (_err) {
      console.error(_err);
      return {
        message: `Error: Failed to find recipe ${recipe_name}`,
        type: API_FIND,
      };
    }
  }

  async info(recipe_name: string): Promise<APIResponse> {
    try {
      const recipe_id: number | null =
        (<SearchItem[] | undefined>(await this.find(recipe_name)).response)?.[0]
          ?.id ?? null;
      if (recipe_id === null) {
        throw new Error('RecipeListItem not found');
      }

      const information: Information = (
        await this.recipeAPI?.({
          url: `/${recipe_id}/information`,
          method: 'get',
        })
      )?.data ?? {results: []};
      return {response: information, type: API_INFORMATION};
    } catch (_err) {
      console.error(_err);
      return {
        message: `Error: Failed to get information for recipe ${recipe_name}`,
        type: API_INFORMATION,
      };
    }
  }

  async search(recipe_name: string): Promise<APIResponse> {
    try {
      const {results}: SearchResponse = (
        await this.recipeAPI?.({
          url: `/complexSearch?query=${recipe_name}&number=6`,
          method: 'get',
        })
      )?.data ?? {results: []};
      return {response: results, type: API_SEARCH};
    } catch (_err) {
      console.error(_err);
      return {
        message: `Error: Failed to search ${recipe_name}`,
        type: API_SEARCH,
      };
    }
  }

  async ingredients(recipe_name: string): Promise<APIResponse> {
    try {
      const recipe_id: number | null =
        (<SearchItem[] | undefined>(await this.find(recipe_name)).response)?.[0]
          ?.id ?? null;
      if (recipe_id === null) {
        throw new Error('RecipeListItem not found');
      }

      const {ingredients: _ingredients}: IngredientResponse = (
        await this.recipeAPI?.({
          url: `/${recipe_id}/ingredientWidget.json`,
          method: 'get',
        })
      )?.data ?? {results: []};
      return {response: _ingredients, type: API_INGREDIENT};
    } catch (_err) {
      console.error(_err);
      return {
        message: `Error: Failed to get ingredients for recipe ${recipe_name}`,
        type: API_INGREDIENT,
      };
    }
  }

  async instructions(recipe_name: string): Promise<APIResponse> {
    try {
      const recipe_id: number | null =
        (<SearchItem[] | undefined>(await this.find(recipe_name)).response)?.[0]
          ?.id ?? null;
      if (recipe_id === null) {
        throw new Error('RecipeListItem not found');
      }

      const _instructions: Instruction[] = (
        await this.recipeAPI?.({
          url: `/${recipe_id}/analyzedInstructions`,
          method: 'get',
        })
      )?.data ?? {results: []};
      return {response: _instructions, type: API_INSTRUCTION};
    } catch (_err) {
      console.error(_err);
      return {
        message: `Error: Failed to get instructions for recipe ${recipe_name}`,
        type: API_INSTRUCTION,
      };
    }
  }
}
