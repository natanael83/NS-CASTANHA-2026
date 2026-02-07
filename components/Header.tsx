
import React from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { View } from '../types';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onViewChange: (view: View) => void;
  currentView: View;
  showCart?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onCartClick, 
  onViewChange, 
  currentView,
  showCart = true 
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:py-5">
        <button 
          onClick={() => onViewChange('home')}
          className="flex items-center gap-1 group transition-transform active:scale-95"
        >
          <span className="text-2xl md:text-3xl font-extrabold text-emerald-700">NS</span>
          <span className="text-2xl md:text-3xl font-extrabold text-orange-500">Castanhas</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onViewChange('home')}
            className={`text-sm font-bold tracking-wide uppercase transition-colors ${currentView === 'home' ? 'text-emerald-700' : 'text-gray-500 hover:text-emerald-700'}`}
          >
            Início
          </button>
          <button 
            onClick={() => onViewChange('products')}
            className={`text-sm font-bold tracking-wide uppercase transition-colors ${currentView === 'products' ? 'text-emerald-700' : 'text-gray-500 hover:text-emerald-700'}`}
          >
            Produtos
          </button>
          <button 
            onClick={() => onViewChange('profile')}
            className={`text-sm font-bold tracking-wide uppercase transition-colors ${currentView === 'profile' ? 'text-emerald-700' : 'text-gray-500 hover:text-emerald-700'}`}
          >
            Sobre
          </button>
          <button 
            onClick={onCartClick}
            className={`relative p-2 transition-all active:scale-90 ${currentView === 'cart' ? 'text-emerald-700' : 'text-gray-500 hover:text-emerald-700'}`}
            aria-label="Carrinho de compras"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm min-w-[20px] text-center">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
        
        <div className="flex items-center gap-4">
          {showCart && (
            <button 
              onClick={onCartClick}
              className="relative bg-gray-50 p-2.5 rounded-xl border border-gray-100 transition-all hover:bg-emerald-50 active:scale-95 md:hidden"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          <button className="md:hidden text-emerald-900 p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
