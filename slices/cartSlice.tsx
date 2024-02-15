import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ id: string; name: string; price: number }>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity++;
      } else {
        state.items.push({
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          quantity: 1
        });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;