import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import bookCover1 from '@/assets/book-cover-1.jpg';
import bookCover2 from '@/assets/book-cover-2.jpg';
import bookCover3 from '@/assets/book-cover-3.jpg';
import bookCover4 from '@/assets/book-cover-4.jpg';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  description: string;
  category: string;
  isbn: string;
  pages: number;
  publishedYear: number;
  inStock: boolean;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  author: string;
  image: string;
  year: number;
  description: string;
}

interface StoreState {
  books: Book[];
  portfolio: PortfolioItem[];
  cart: CartItem[];
  addBook: (book: Book) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  updatePortfolioItem: (id: string, item: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;
}

const initialBooks: Book[] = [
  {
    id: '1',
    title: 'The Silent Echo',
    author: 'Aminul Islam',
    price: 450,
    image: bookCover1,
    description: 'A profound exploration of silence and its echoes in modern Bengali literature.',
    category: 'Fiction',
    isbn: '978-984-123-456-7',
    pages: 256,
    publishedYear: 2024,
    inStock: true,
  },
  {
    id: '2',
    title: 'Botanical Dreams',
    author: 'Fatima Rahman',
    price: 520,
    image: bookCover2,
    description: 'Poetry collection inspired by the natural beauty of Bangladesh.',
    category: 'Poetry',
    isbn: '978-984-123-457-4',
    pages: 128,
    publishedYear: 2024,
    inStock: true,
  },
  {
    id: '3',
    title: 'Watercolor Memories',
    author: 'Kamal Hossain',
    price: 680,
    image: bookCover3,
    description: 'An artistic memoir blending visual art with prose narratives.',
    category: 'Art & Design',
    isbn: '978-984-123-458-1',
    pages: 200,
    publishedYear: 2025,
    inStock: true,
  },
  {
    id: '4',
    title: 'Heritage Tales',
    author: 'Nusrat Jahan',
    price: 390,
    image: bookCover4,
    description: 'Stories rooted in the rich cultural heritage of Bengal.',
    category: 'Fiction',
    isbn: '978-984-123-459-8',
    pages: 312,
    publishedYear: 2024,
    inStock: true,
  },
];

const initialPortfolio: PortfolioItem[] = [
  {
    id: '1',
    title: 'The Silent Echo',
    author: 'Aminul Islam',
    image: bookCover1,
    year: 2024,
    description: 'Award-winning debut novel exploring themes of identity and belonging.',
  },
  {
    id: '2',
    title: 'Botanical Dreams',
    author: 'Fatima Rahman',
    image: bookCover2,
    year: 2024,
    description: 'Featured in the National Poetry Festival 2024.',
  },
  {
    id: '3',
    title: 'Watercolor Memories',
    author: 'Kamal Hossain',
    image: bookCover3,
    year: 2025,
    description: 'A unique fusion of visual art and literary narrative.',
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      books: initialBooks,
      portfolio: initialPortfolio,
      cart: [],
      
      addBook: (book) =>
        set((state) => ({ books: [...state.books, book] })),
      
      updateBook: (id, updatedBook) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? { ...book, ...updatedBook } : book
          ),
        })),
      
      deleteBook: (id) =>
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        })),
      
      addToCart: (book) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.book.id === book.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.book.id === book.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { book, quantity: 1 }] };
        }),
      
      removeFromCart: (bookId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.book.id !== bookId),
        })),
      
      updateCartQuantity: (bookId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.book.id === bookId ? { ...item, quantity } : item
          ),
        })),
      
      clearCart: () => set({ cart: [] }),
      
      addPortfolioItem: (item) =>
        set((state) => ({ portfolio: [...state.portfolio, item] })),
      
      updatePortfolioItem: (id, updatedItem) =>
        set((state) => ({
          portfolio: state.portfolio.map((item) =>
            item.id === id ? { ...item, ...updatedItem } : item
          ),
        })),
      
      deletePortfolioItem: (id) =>
        set((state) => ({
          portfolio: state.portfolio.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'udvasito-store',
    }
  )
);
