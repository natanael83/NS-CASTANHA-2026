
import React from 'react';
import { Home, LayoutGrid, ShoppingBasket, User } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const navItems: { icon: any; label: string; view: View }[] = [
    { icon: Home, label: 'Home', view: 'home' },
    { icon: LayoutGrid, label: 'Produtos', view: 'products' },
    { icon: ShoppingBasket, label: 'Carrinho', view: 'cart' },
    { icon: User, label: 'Perfil', view: 'profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-8 flex justify-between items-center z-50">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => onViewChange(item.view)}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${currentView === item.view ? 'text-emerald-700' : 'text-gray-400'
            }`}
        >
          <item.icon className={`w-6 h-6 ${currentView === item.view ? 'fill-emerald-700/10' : ''}`} />
          <span className="text-[10px] font-semibold">{item.label}</span>
        </button>
      ))}
    </div>
  );
};
