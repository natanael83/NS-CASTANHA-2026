
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  imagePath?: string; // Caminho no Storage
  benefits?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export type View = 'home' | 'products' | 'cart' | 'profile' | 'about';

export interface AppState {
  cart: CartItem[];
  currentView: View;
  darkMode: boolean;
  selectedSize: string;
}