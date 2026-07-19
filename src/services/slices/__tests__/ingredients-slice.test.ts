import { TIngredient } from '@utils-types';
import reducer, { fetchIngredients } from '../ingredients-slice';

describe('редьюсер слайса ingredients', () => {
  const initialState = {
    items: [] as TIngredient[],
    isLoading: false,
    error: null as string | null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
    }
  ];

  it('неизвестный экшен с undefined состоянием возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('fetchIngredients.pending выставляет isLoading в true', () => {
    const state = reducer(initialState, fetchIngredients.pending('requestId'));

    expect(state).toEqual({ items: [], isLoading: true, error: null });
  });

  it('fetchIngredients.fulfilled записывает ингредиенты и снимает isLoading', () => {
    const stateBefore = { ...initialState, isLoading: true };

    const state = reducer(
      stateBefore,
      fetchIngredients.fulfilled(mockIngredients, 'requestId')
    );

    expect(state).toEqual({
      items: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  it('fetchIngredients.rejected записывает текст ошибки и снимает isLoading', () => {
    const stateBefore = { ...initialState, isLoading: true };

    const state = reducer(
      stateBefore,
      fetchIngredients.rejected(
        new Error('Не удалось загрузить ингредиенты'),
        'requestId'
      )
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Не удалось загрузить ингредиенты'
    });
  });
});