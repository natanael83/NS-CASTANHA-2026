
import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Info, Home, LayoutGrid, User, ShoppingBag } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Início', view: 'home' as View, icon: Home },
    { label: 'Produtos', view: 'products' as View, icon: LayoutGrid },
    { label: 'Sobre Nós', view: 'about' as View, icon: Info },
    { label: 'Minha Conta', view: 'profile' as View, icon: User },
  ];

  const handleMobileNav = (view: View) => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

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
            onClick={() => onViewChange('about')}
            className={`text-sm font-bold tracking-wide uppercase transition-colors ${currentView === 'about' ? 'text-emerald-700' : 'text-gray-500 hover:text-emerald-700'}`}
          >
            Sobre
          </button>
          <button
            onClick={() => onViewChange('profile')}
            className={`text-sm font-bold tracking-wide uppercase transition-colors ${currentView === 'profile' ? 'text-emerald-700' : 'text-gray-500 hover:text-emerald-700'}`}
          >
            Minha Conta
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
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-emerald-900 p-2 transition-transform active:scale-90"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top duration-300 z-40">
          <div className="flex flex-col p-4 gap-2">
            {menuItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleMobileNav(item.view)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  currentView === item.view 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-base">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => {
                onCartClick();
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between p-4 rounded-2xl text-emerald-700 bg-orange-50 mt-2"
            >
              <div className="flex items-center gap-4">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-base">Meu Carrinho</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-full">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
