import { TIngredient } from '@utils-types';
import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../burger-constructor-slice';

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));

describe('редьюсер слайса burgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const bun: TIngredient = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png'
  };

  const main: TIngredient = {
    _id: 'main-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
  };

  const sauce: TIngredient = {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
  };

  it('неизвестный экшен с undefined состоянием возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('addIngredient кладёт булку в state.bun, а начинку — в конец ingredients', () => {
    const withBun = reducer(initialState, addIngredient(bun));
    expect(withBun.bun).toEqual({ ...bun, id: 'mock-uuid' });

    const withMain = reducer(withBun, addIngredient(main));
    expect(withMain.ingredients).toEqual([{ ...main, id: 'mock-uuid' }]);
  });

  it('removeIngredient убирает ингредиент с переданным id', () => {
    const stateBefore = {
      bun: null,
      ingredients: [
        { ...main, id: '1' },
        { ...sauce, id: '2' }
      ]
    };

    const state = reducer(stateBefore, removeIngredient('1'));

    expect(state.ingredients).toEqual([{ ...sauce, id: '2' }]);
  });

  it('moveIngredientUp меняет местами ингредиент с предыдущим', () => {
    const stateBefore = {
      bun: null,
      ingredients: [
        { ...main, id: '1' },
        { ...sauce, id: '2' }
      ]
    };

    const state = reducer(stateBefore, moveIngredientUp(1));

    expect(state.ingredients.map((item) => item.id)).toEqual(['2', '1']);
  });

  it('moveIngredientDown меняет местами ингредиент со следующим', () => {
    const stateBefore = {
      bun: null,
      ingredients: [
        { ...main, id: '1' },
        { ...sauce, id: '2' }
      ]
    };

    const state = reducer(stateBefore, moveIngredientDown(0));

    expect(state.ingredients.map((item) => item.id)).toEqual(['2', '1']);
  });

  it('clearConstructor сбрасывает булку и список начинок', () => {
    const stateBefore = {
      bun: { ...bun, id: '1' },
      ingredients: [{ ...main, id: '2' }]
    };

    const state = reducer(stateBefore, clearConstructor());

    expect(state).toEqual(initialState);
  });
});