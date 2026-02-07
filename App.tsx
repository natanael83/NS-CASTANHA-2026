import React, { useState, useEffect } from 'react';
import {
  Moon, Sun, Instagram, ChevronRight, MessageCircle, ShoppingBasket,
  Trash2, ArrowRight, Loader2, ChevronLeft, Heart, Minus, Plus, Check, ShoppingBag,
  ArrowLeft, Lock, X
} from 'lucide-react';
import { View, CartItem, Product } from './types';
import { SIZES, WHATSAPP_NUMBER, INSTAGRAM_HANDLE, FALLBACK_PRODUCTS } from './constants';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { supabase } from './supabase';
import { Auth } from './components/Auth';
import { User } from '@supabase/supabase-js';

// Mocks to replace Firebase
const fetchProducts = async (): Promise<Product[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Return fallback products, ensuring all have an image
  return FALLBACK_PRODUCTS.map(p => ({
    ...p,
    image: p.image || 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=800'
  }));
};

const saveOrderToSupabase = async (cart: CartItem[], total: number) => {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total_amount: total,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error saving order:", orderError);
    return null;
  }

  // Insert order items
  const orderItems = cart.map(item => ({
    order_id: order.id,
    product_name: item.name,
    quantity: item.quantity,
    size: item.selectedSize,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error("Error saving order items:", itemsError);
  }

  return order.id;
};

// Images mapping for sizes
const SIZE_IMAGES: Record<string, string> = {
  '250g': 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=800',
  '500g': 'https://images.unsplash.com/photo-1596506306797-400db32e6a14?auto=format&fit=crop&q=80&w=800',
  '1kg': 'https://images.unsplash.com/photo-1536620948425-6393349c87ed?auto=format&fit=crop&q=80&w=800'
};

// --- Sub-components ---

const ProductModal: React.FC<{
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size: string) => void;
}> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('500g');

  // Pricing logic
  const getPriceMultiplier = (size: string) => {
    if (size === '250g') return 0.6;
    if (size === '1kg') return 1.9;
    return 1;
  };
  const currentPrice = product.price * getPriceMultiplier(selectedSize);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-colors z-10 backdrop-blur-md"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="h-56 bg-gray-100 relative shrink-0">
          <img
            src={product.image || SIZE_IMAGES['500g']}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 overflow-y-auto">
          <h3 className="text-xl font-black text-emerald-950 leading-tight mb-2">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">{product.description}</p>

          {/* Size Selector */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Escolha o Peso</p>
            <div className="flex gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${selectedSize === size
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/20'
                    : 'bg-white text-gray-400 border-gray-100 hover:border-emerald-200'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-auto">
            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 h-14 px-2 shrink-0">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-lg text-emerald-900 font-bold hover:bg-gray-100 rounded-lg transition-colors">-</button>
              <span className="w-8 text-center font-black text-gray-900 text-lg">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-lg text-emerald-900 font-bold hover:bg-gray-100 rounded-lg transition-colors">+</button>
            </div>
            <button
              onClick={() => {
                onAddToCart(product, quantity, selectedSize);
                onClose();
              }}
              className="flex-1 bg-emerald-900 text-white h-14 rounded-xl font-bold flex flex-col items-center justify-center shadow-xl shadow-emerald-900/20 active:scale-95 transition-transform hover:bg-emerald-800"
            >
              <span className="text-[10px] font-medium opacity-80 uppercase tracking-widest">Adicionar</span>
              <span className="text-lg leading-none">{(currentPrice * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

const HomeView: React.FC<{
  onOrderNow: () => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
}> = ({ onOrderNow, selectedSize, onSizeChange }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 400);
    return () => clearTimeout(timer);
  }, [selectedSize]);

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-6 md:px-12 pb-32 md:pb-0 overflow-y-auto no-scrollbar">
      <div className="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center md:items-start text-center md:text-left relative z-10">
          <div className={`md:hidden mx-auto w-64 h-64 rounded-full bg-emerald-700/50 p-2 border-4 border-white/10 mt-4 mb-8 overflow-hidden shadow-2xl transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
            <img
              src={SIZE_IMAGES[selectedSize] || SIZE_IMAGES['500g']}
              alt="Main Nuts"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="absolute -top-20 -left-10 opacity-5 hidden lg:block pointer-events-none select-none">
            <h1 className="text-[180px] font-black tracking-tighter text-white">NUTS</h1>
          </div>
          <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-[3px] px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-orange-500/20">
            Premium & Natural
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.9]">
            Sabor <br className="hidden md:block" /> <span className="text-orange-500">Puro.</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-md leading-relaxed mb-10">
            Cultivadas com carinho, nossas castanhas trazem a energia da natureza direto para o seu dia. Um momento de prazer crocante em cada punhado.
          </p>
          <div className="w-full max-w-xs md:max-w-sm mb-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-bold text-white/40 tracking-[2px] uppercase whitespace-nowrap">Escolha seu kit</span>
              <div className="h-[1px] bg-white/10 flex-1"></div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => onSizeChange(size)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xs font-black transition-all border-2 ${selectedSize === size
                    ? 'bg-white text-emerald-900 border-white scale-110 shadow-xl shadow-white/10'
                    : 'bg-transparent text-white border-white/20 hover:border-white/50'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onOrderNow}
              className="w-full sm:w-auto bg-white text-emerald-900 px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all active:scale-95 text-lg"
            >
              Pedir agora <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.open(`https://instagram.com/${INSTAGRAM_HANDLE}`, '_blank')}
              className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="hidden md:flex justify-center items-center relative">
          <div className="absolute w-[120%] h-[120%] bg-white/5 rounded-full blur-3xl"></div>
          <div className={`relative w-full aspect-square max-w-lg rounded-[60px] bg-emerald-700/50 p-4 border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 rotate-3 group hover:rotate-0 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <img
              src={SIZE_IMAGES[selectedSize] || SIZE_IMAGES['500g']}
              alt={`Premium Nuts ${selectedSize}`}
              className="w-full h-full object-cover rounded-[50px] group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Pacote {selectedSize}</p>
              <p className="text-2xl font-black">Qualidade Garantida</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsView: React.FC<{
  products: Product[];
  onProductClick: (p: Product) => void;
  cart: CartItem[];
}> = ({ products, onProductClick, cart }) => (
  <div className="flex-1 bg-gradient-to-br from-emerald-900 via-emerald-800 to-orange-500 rounded-t-[40px] md:rounded-none">
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-orange-300 font-black text-xs uppercase tracking-widest mb-2 block">Catálogo</span>
          <h2 className="text-4xl md:text-5xl font-black text-white">Seleção Especial</h2>
        </div>
        <p className="text-emerald-100 font-medium max-w-xs">Escolha o melhor da natureza para o seu bem-estar diário.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => {
          const inCart = cart.find(item => item.id === product.id);
          return (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className="group bg-white rounded-[40px] p-4 border border-white/10 flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <div className="aspect-square rounded-[32px] overflow-hidden mb-5 bg-gray-50 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-emerald-950 uppercase shadow-sm">Premium</div>
              </div>
              <div className="px-2 pb-2 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-emerald-950 mb-2 leading-tight group-hover:text-orange-600 transition-colors">{product.name}</h3>
                <div className="mt-auto">
                  <p className="text-gray-400 text-xs font-medium mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-emerald-900 font-black text-xl">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <button
                      className={`w-12 h-12 rounded-2xl transition-all active:scale-90 flex items-center justify-center shadow-lg ${inCart ? 'bg-orange-500 text-white' : 'bg-emerald-900 text-white hover:bg-emerald-800'}`}
                    >
                      {inCart ? <ShoppingBasket className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const CartView: React.FC<{
  cart: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string, size: string) => void;
  onGoBack: () => void;
}> = ({ cart, onUpdateQty, onRemove, onGoBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const SHIPPING_COST = 15.00;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + SHIPPING_COST;

  const handleCheckout = async () => {
    setIsSubmitting(true);

    await saveOrderToSupabase(cart, total);

    const text = `Olá! Gostaria de finalizar meu pedido:\n\n${cart.map(i => `*${i.quantity}x ${i.name}* (${i.selectedSize})`).join('\n')}\n\nSubtotal: ${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nFrete: ${SHIPPING_COST.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n*Total: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');

    setIsSubmitting(false);
  };

  if (cart.length === 0) {
    return (
      <div className="flex-1 bg-gradient-to-br from-emerald-900 via-emerald-800 to-orange-500 flex flex-col min-h-screen">
        {/* Header even for empty cart */}
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <button onClick={onGoBack}><ArrowLeft className="w-6 h-6 text-white" /></button>
          <div className="text-center">
            <p className="text-[10px] font-bold text-orange-300 uppercase tracking-widest">NS CASTANHAS</p>
            <h1 className="text-lg font-bold text-white">Meu Carrinho</h1>
          </div>
          <div className="w-6"></div> {/* Spacer */}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mb-6 text-white/60">
            <ShoppingBasket className="w-16 h-16" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Seu carrinho está vazio</h3>
          <p className="text-emerald-100 mb-8">Adicione produtos deliciosos agora mesmo.</p>
          <button onClick={onGoBack} className="bg-white text-emerald-950 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-lg">
            Voltar as Compras
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-emerald-900 via-emerald-800 to-orange-500 flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-emerald-900/40 backdrop-blur-md border-b border-white/5 shadow-lg">
        <button onClick={onGoBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-extrabold text-orange-300 uppercase tracking-widest mb-0.5">NS CASTANHAS</p>
          <h1 className="text-lg font-black text-white leading-none">Meu Carrinho</h1>
        </div>
        <div className="relative w-10 h-10 -mr-2 flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-white" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-emerald-900 rounded-full"></span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32 max-w-lg mx-auto w-full">
        {cart.map((item) => (
          <div key={`${item.id}-${item.selectedSize}`} className="bg-white p-4 rounded-3xl shadow-lg border border-white/10 flex gap-4 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => onRemove(item.id, item.selectedSize)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1 z-10"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="w-24 h-24 rounded-2xl bg-gray-50 shrink-0 overflow-hidden">
              <img src={item.image || SIZE_IMAGES[item.selectedSize] || SIZE_IMAGES['500g']} alt={item.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 py-1 flex flex-col justify-between">
              <div className="pr-8">
                <h3 className="font-bold text-gray-900 text-base leading-tight">{item.name}</h3>
                <p className="text-gray-400 text-sm font-medium mt-1">Peso: {item.selectedSize}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs font-bold text-green-600">Em estoque</span>
                </div>
              </div>

              <div className="flex items-end justify-between mt-3">
                <span className="text-lg font-black text-gray-900">
                  {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>

                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 h-8">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors text-lg font-medium"
                  >−</button>
                  <span className="w-6 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="w-8 h-full flex items-center justify-center bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Summary Card */}
        <div className="bg-white rounded-[30px] p-6 shadow-xl border border-gray-100 mt-6">
          <h3 className="font-bold text-lg text-gray-900 mb-6">Resumo do Pedido</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-gray-500 text-sm font-medium">
              <span>Subtotal ({cart.length} itens)</span>
              <span className="text-gray-900">{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 text-sm font-medium">
              <span>Frete</span>
              <span className="text-gray-900">{SHIPPING_COST.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-6">
            <span className="font-bold text-lg text-gray-900">Total</span>
            <span className="font-black text-2xl text-orange-500">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>

          <div className="bg-green-50 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-green-800 text-xs font-bold uppercase tracking-wide">
            <Lock className="w-3.5 h-3.5" />
            Compra 100% Segura e Garantida
          </div>
        </div>
      </div>

      {/* Footer Button - Dark Glass */}
      <div className="bg-emerald-900/80 backdrop-blur-xl p-4 border-t border-white/10 sticky bottom-0 z-50 pb-8 md:pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] w-full">
        <div className="max-w-lg mx-auto w-full">
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="w-full bg-white text-emerald-900 hover:bg-orange-50 py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-base">Processando...</span>
              </>
            ) : (
              <>
                <span>Finalizar Compra</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingView: React.FC = () => (
  <div className="flex-1 flex items-center justify-center bg-white md:bg-gray-50">
    <Loader2 className="w-12 h-12 text-emerald-700 animate-spin" />
  </div>
);


const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('500g');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]); // For Admin
  const [profile, setProfile] = useState<{ points: number; full_name?: string } | null>(null);

  const isAdmin = user?.email === 'natanael83@gmail.com'; // Change to your actual admin email

  const fetchAllOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), profiles(full_name)')
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching all orders:", error);
    else setAllOrders(data || []);
  };

  const confirmOrder = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', orderId);

    if (error) alert("Erro ao confirmar: " + error.message);
    else {
      alert("Pedido confirmado! Pontos adicionados ao cliente.");
      if (isAdmin) fetchAllOrders();
      if (user) fetchOrders(user.id);
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('points, full_name')
      .eq('id', userId)
      .single();

    if (error) console.error("Error fetching profile:", error);
    else setProfile(data);
  };

  const fetchOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching orders:", error);
    else setOrders(data || []);
  };

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchOrders(session.user.id);
        fetchProfile(session.user.id);
        if (session.user.email === 'natanael83@gmail.com') fetchAllOrders();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchOrders(session.user.id);
        fetchProfile(session.user.id);
        if (session.user.email === 'natanael83@gmail.com') fetchAllOrders();
      } else {
        setOrders([]);
        setProfile(null);
        setAllOrders([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    let fetchedProducts = await fetchProducts();

    if (fetchedProducts.length === 0) {
      fetchedProducts = FALLBACK_PRODUCTS;
    }

    setProducts(fetchedProducts);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addToCart = (product: Product, quantity: number = 1, sizeOverride?: string) => {
    setCart(prev => {
      const sizeToUse = sizeOverride || selectedSize;
      const existing = prev.find(item => item.id === product.id && item.selectedSize === sizeToUse);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.selectedSize === sizeToUse) ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity: quantity, selectedSize: sizeToUse }];
    });
    // Optional: auto go to cart or just show notification (currently no-op)
  };

  const handleOrderNow = () => {
    if (products.length === 0) return;
    const flagshipProduct = products.find(p => p.id === '4') || products[0];
    handleProductClick(flagshipProduct);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    // Removed setView('product-detail');
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const renderContent = () => {
    if (isLoading && view === 'products') {
      return <LoadingView />;
    }

    switch (view) {
      case 'home':
        return <HomeView onOrderNow={handleOrderNow} selectedSize={selectedSize} onSizeChange={setSelectedSize} />;
      case 'products':
        return <ProductsView products={products} onProductClick={handleProductClick} cart={cart} />;
      case 'cart':
        return <CartView cart={cart} onUpdateQty={(id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))} onRemove={removeFromCart} onGoBack={() => setView('products')} />;
      case 'profile':
        if (!user) {
          return (
            <div className="flex-1 bg-gradient-to-br from-emerald-900 via-emerald-800 to-orange-500 flex items-center justify-center p-6">
              <Auth onSuccess={() => setView('profile')} />
            </div>
          );
        }
        const points = profile?.points || 0;
        const getLevel = (pts: number) => {
          if (pts >= 600) return { name: 'Ouro', next: null, min: 600 };
          if (pts >= 300) return { name: 'Prata', next: 'Ouro', min: 300, nextMin: 600 };
          return { name: 'Bronze', next: 'Prata', min: 0, nextMin: 300 };
        };
        const level = getLevel(points);
        const progress = level.nextMin ? ((points - level.min) / (level.nextMin - level.min)) * 100 : 100;

        return (
          <div className="flex-1 bg-white">
            <div className="max-w-md mx-auto px-6 py-12 flex flex-col items-center">
              {/* User Avatar & Info */}
              <div className="w-32 h-32 rounded-full bg-orange-100 border-4 border-orange-50 mb-4 overflow-hidden shadow-lg">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-black text-emerald-950 mb-1">{user.email?.split('@')[0]}</h2>
              <p className="text-gray-400 font-bold mb-1">Nível {level.name}</p>
              <p className="text-orange-600 font-black text-xl mb-8">{points} pontos</p>

              {/* Progress Bar */}
              {level.next && (
                <div className="w-full mb-10">
                  <div className="flex justify-between items-end mb-2">
                    <p className="font-bold text-emerald-950 text-sm">Próximo nível: {level.next}</p>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all duration-1000"
                      style={{ width: `${Math.max(5, progress)}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                    Faltam {level.nextMin! - points} pontos
                  </p>
                </div>
              )}

              {/* Levels Grid */}
              <div className="w-full space-y-4 mb-10">
                {[
                  { name: 'Bronze', range: '0 - 299 pontos', color: 'bg-orange-100' },
                  { name: 'Prata', range: '300 - 599 pontos', color: 'bg-gray-100' },
                  { name: 'Ouro', range: '600+ pontos', color: 'bg-yellow-100' }
                ].map((l) => (
                  <div key={l.name} className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${level.name === l.name ? 'border-orange-500 bg-orange-50/30' : 'border-gray-50 bg-white'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${l.color} flex items-center justify-center font-black text-emerald-900`}>
                        {l.name[0]}
                      </div>
                      <div>
                        <p className={`font-black ${level.name === l.name ? 'text-emerald-950' : 'text-gray-400'}`}>{l.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{l.range}</p>
                      </div>
                    </div>
                    {level.name === l.name && (
                      <div className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Atual</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => supabase.auth.signOut()}
                className="w-full py-4 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-colors mb-8"
              >
                Sair da Conta
              </button>

              {/* Admin Section */}
              {isAdmin && (
                <div className="w-full border-t border-gray-100 pt-10">
                  <div className="bg-emerald-950 rounded-[40px] p-8 text-white">
                    <h3 className="text-xl font-black mb-6">Painel Administrativo</h3>
                    <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest mb-6">Pedidos para Confirmar</p>

                    <div className="space-y-4">
                      {allOrders.filter(o => o.status === 'pending').map((order) => (
                        <div key={order.id} className="bg-white/5 border border-white/10 rounded-3xl p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-sm font-bold">Cliente: {order.profiles?.full_name || 'Usuário'}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-tighter">ID: #{order.id.slice(0, 8)}</p>
                            </div>
                            <p className="font-black text-orange-500">
                              {Number(order.total_amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                          </div>

                          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                            {order.order_items?.map((item: any, idx: number) => (
                              <span key={idx} className="text-[10px] bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                                {item.quantity}x {item.product_name}
                              </span>
                            ))}
                          </div>

                          <button
                            onClick={() => confirmOrder(order.id)}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                          >
                            Confirmar Pagamento & Dar Pontos
                          </button>
                        </div>
                      ))}

                      {allOrders.filter(o => o.status === 'pending').length === 0 && (
                        <p className="text-center text-emerald-100/40 text-sm py-4">Nenhum pedido pendente.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="flex-1 bg-gradient-to-br from-emerald-900 via-emerald-800 to-orange-500">
            <div className="max-w-7xl mx-auto px-6 py-20">
              <div className="bg-white rounded-[60px] p-12 md:p-20 shadow-2xl border border-white/10 flex flex-col md:flex-row gap-12 items-center">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-[50px] bg-gray-50 shrink-0 overflow-hidden shadow-2xl rotate-3">
                  <img src="https://images.unsplash.com/photo-1596506306797-400db32e6a14?auto=format&fit=crop&q=80&w=800" alt="Sobre Nós" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-orange-500 font-black text-sm uppercase tracking-widest mb-4 block">Bem-vindo à NS Castanhas</span>
                  <h2 className="text-4xl md:text-5xl font-black text-emerald-950 mb-6">Sua Saúde é <br /> Nossa Prioridade.</h2>
                  <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mb-10">
                    Somos apaixonados por oferecer castanhas selecionadas, frescas e de alta qualidade.
                    Nossa missão é facilitar o acesso a alimentos saudáveis e saborosos diretamente na sua casa,
                    garantindo procedência e o melhor sabor em cada punhado.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-emerald-900 font-black text-2xl">10k+</p>
                      <p className="text-gray-400 font-bold text-xs uppercase tracking-tighter">Clientes Felizes</p>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-emerald-900 font-black text-2xl">100%</p>
                      <p className="text-gray-400 font-bold text-xs uppercase tracking-tighter">Qualidade</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <HomeView onOrderNow={handleOrderNow} selectedSize={selectedSize} onSizeChange={setSelectedSize} />;
    }
  };

  // Define full screen views where global header/nav should be hidden
  const isFullScreenView = view === 'cart';

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 ${darkMode ? 'bg-emerald-950' : (isFullScreenView ? 'bg-gray-50' : 'bg-emerald-800')}`}>
      <div className="w-full flex flex-col relative">
        {/* Only show Global Header if NOT in full screen views */}
        {!isFullScreenView && (
          <Header cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onCartClick={() => setView('cart')} onViewChange={setView} currentView={view} showCart={true} />
        )}

        <main className={`flex-1 flex flex-col ${isFullScreenView ? 'min-h-screen' : 'min-h-[calc(100vh-80px)]'}`}>
          {renderContent()}
        </main>

        {/* Only show Dark Mode toggle if NOT in full screen views (to keep UI clean) */}
        {!isFullScreenView && (
          <button onClick={() => setDarkMode(!darkMode)} className="fixed bottom-24 md:bottom-12 right-6 md:right-12 w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center z-[60] transition-all hover:scale-110 active:scale-90 group border border-gray-100">
            {darkMode ? <Sun className="w-7 h-7 text-orange-500" /> : <Moon className="w-7 h-7 text-emerald-900" />}
          </button>
        )}

        {/* Only show Bottom Nav if NOT in full screen views */}
        {!isFullScreenView && (
          <BottomNav currentView={view} onViewChange={setView} />
        )}
      </div>

      {/* Product Selection Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, qty, s) => {
            addToCart(p, qty, s);
            // Optionally auto-open cart: setView('cart');
          }}
        />
      )}
    </div>
  );
};

export default App;