import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, BookOpen } from 'lucide-react';
import { useStore } from '@/lib/store';
import { config } from '@/lib/config';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cart = useStore((state) => state.cart);
  const navigate = useNavigate();
  
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 4) {
      e.preventDefault();
      clickCountRef.current = 0;
      navigate(config.admin.url);
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1000);
  }, [navigate]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          <div 
            className="flex items-center gap-3 group cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <div className="relative">
              <BookOpen className="w-7 h-7 text-foreground transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-foreground/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl tracking-wide text-foreground leading-tight">
                Udvasito Pathshala
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Publication
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className="nav-link relative group">
              <span>Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/shop" className="nav-link relative group">
              <span>Shop</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/portfolio" className="nav-link relative group">
              <span>Portfolio</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/contact" className="nav-link relative group">
              <span>Contact</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              to="/cart" 
              className="relative p-2 transition-all duration-300 hover:scale-110 group"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center animate-scale-in">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <button
              className="md:hidden p-2 transition-transform duration-300 hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-6 border-t border-border/30 animate-slide-up">
            <div className="flex flex-col gap-4">
              <Link to="/" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Shop</Link>
              <Link to="/portfolio" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
              <Link to="/contact" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
