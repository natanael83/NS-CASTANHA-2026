
import { Product } from './types';

export const WHATSAPP_NUMBER = "5569984416841";
export const INSTAGRAM_HANDLE = "ns_castanhas";

export const SIZES = ['250g', '500g', '1kg'];

// Dados de fallback caso o Firebase não retorne produtos.
// Isso garante que o app sempre tenha dados para exibir.
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'F5NOHjAPaSg5ZK9GZ9Xh',
    name: 'Castanha do Pará',
    price: 45.90,
    image: '',
    description: 'Castanhas inteiras e crocantes do coração da Amazônia.',
    benefits: [
      "Rica em Selênio, poderoso antioxidante.",
      "Fonte de gorduras boas para o coração.",
      "Auxilia na redução do colesterol ruim."
    ]
  },
  {
    id: '2',
    name: 'Castanha de Caju',
    price: 38.50,
    image: 'https://images.unsplash.com/photo-1615485925824-3814f68a54a4?auto=format&fit=crop&q=80&w=800',
    description: 'Torradas e levemente salgadas para o lanche perfeito.',
    benefits: [
      "Rica em gorduras monoinsaturadas.",
      "Fortalece o sistema imunológico.",
      "Fonte de magnésio e zinco."
    ]
  },
  {
    id: '3',
    name: 'Amêndoas Chilenas',
    price: 52.90,
    image: 'https://images.unsplash.com/photo-1600271813134-23a5e769363a?auto=format&fit=crop&q=80&w=800',
    description: 'Amêndoas de alta qualidade, perfeitas para uma dieta saudável.',
    benefits: [
      "Alto teor de vitamina E.",
      "Ajuda no controle do açúcar no sangue.",
      "Promove a saciedade."
    ]
  },
  {
    id: '4',
    name: 'Mix de Nuts Premium',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1607569708044-a068a0a653c2?auto=format&fit=crop&q=80&w=800',
    description: 'Uma combinação equilibrada de diversos tipos de nuts.',
    benefits: [
      "Mix completo de nutrientes.",
      "Energia rápida e saudável.",
      "Ideal para lanches intermediários."
    ]
  }
];