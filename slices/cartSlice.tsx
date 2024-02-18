import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: {
    id:number;
    image: string;
    eventtype:string;
    tag: string;
    price: number;
    amount: number;
    // seat: number | null;
    // table: number | null; 
  }[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ id:number; image: string; tag:string; eventtype:string; price: number; amount: number; }>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.amount=item.amount+action.payload.amount;
      } else {
        state.items = [...state.items, action.payload]
        // state.items.push({
        //   id: action.payload.id,
        //   image: action.payload.image,
        //   tag: action.payload.tag,
        //   eventtype:action.payload.eventtype,
        //   price: action.payload.price,
        //   amount: action.payload.amount,
        // });
        
      }
      
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export const selectItems = (state: CartState) => state.items;
console.log(selectItems)
export const selectTotal =(state: CartState) => state.items.reduce((total, item) => total + item.price, 0);
export default cartSlice.reducer;