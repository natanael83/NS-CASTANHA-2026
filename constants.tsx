
import { Product } from './types';

export const WHATSAPP_NUMBER = "5569984416841";
export const INSTAGRAM_HANDLE = "ns_castanhas";

export const SIZES = ['250g', '500g', '1kg', '2kg', '3kg'];

// Dados de fallback caso o Firebase não retorne produtos.
// Isso garante que o app sempre tenha dados para exibir.
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Castanha-do-Pará descascada',
    price: 25.00,
    image: 'https://djctljpxkvmfogvttdle.supabase.co/storage/v1/object/public/foto%20ns/1kg%20castanha.png',
    description: 'Castanhas inteiras, descascadas e crocantes, prontas para o consumo.',
    availableSizes: ['250g', '500g', '1kg'],
    benefits: [
      "Rica em Selênio, poderoso antioxidante.",
      "Fonte de gorduras boas para o coração.",
      "Auxilia na redução do colesterol ruim."
    ]
  },
  {
    id: '2',
    name: 'Castanha-do-Pará granulada',
    price: 15.00,
    image: '/pote_granulado.webp',
    description: 'Castanha granulada em pote, ideal para acompanhamentos e receitas.',
    availableSizes: ['Pote 150g'],
    benefits: [
      "Praticidade para o dia a dia.",
      "Ideal para iogurtes e saladas.",
      "Mantém todas as propriedades nutricionais."
    ]
  },
  {
    id: '3',
    name: 'Castanha-do-Pará com casca',
    price: 25.00,
    image: '/em casca.png',
    description: 'Castanhas in natura com casca, preservando o frescor original.',
    availableSizes: ['1kg', '2kg', '3kg'],
    benefits: [
      "Máximo frescor preservado pela casca.",
      "Atividade prazerosa de descascar.",
      "Fonte natural de energia."
    ]
  }
];