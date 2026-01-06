import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, LogOut, Loader2, Plus, Trash2, Edit2, BookOpen, X, Upload } from 'lucide-react';
import { useBooks, usePortfolio, useCreateBook, useCreatePortfolio, useUploadImage, apiRequest } from '@/hooks/use-api';
import { toast } from 'sonner';
import { config } from '@/lib/config';
import { queryClient } from '@/lib/queryClient';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'books' | 'portfolio'>('books');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
  const createBook = useCreateBook();
  const createPortfolio = useCreatePortfolio();
  const uploadImage = useUploadImage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === config.admin.password) {
      setIsAuthenticated(true);
      toast.success('Welcome to Admin Panel');
    } else {
      toast.error('Incorrect password');
    }
  };

  const [newBook, setNewBook] = useState({
    title: '', author: '', price: 0, coverImage: '', description: '', category: '', isbn: '', pages: 0, publishedYear: new Date().getFullYear(), inStock: true, featured: false
  });

  const [newPortfolio, setNewPortfolio] = useState({
    title: '', description: '', image: '', category: '', author: '', year: new Date().getFullYear()
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'book' | 'portfolio') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { url } = await uploadImage.mutateAsync(file);
        if (type === 'book') setNewBook(prev => ({ ...prev, coverImage: url }));
        else setNewPortfolio(prev => ({ ...prev, image: url }));
        toast.success('Image uploaded successfully');
      } catch (err) {
        toast.error('Image upload failed');
      }
    }
  };

  const handleAddBook = async () => {
    try {
      await createBook.mutateAsync(newBook);
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      setShowAddForm(false);
      setNewBook({ title: '', author: '', price: 0, coverImage: '', description: '', category: '', isbn: '', pages: 0, publishedYear: new Date().getFullYear(), inStock: true, featured: false });
      toast.success('Book added successfully');
    } catch (err) {
      toast.error('Failed to add book');
    }
  };

  const handleAddPortfolio = async () => {
    try {
      console.log("Submitting new portfolio:", newPortfolio);
      const payload = {
        ...newPortfolio,
        year: parseInt(newPortfolio.year.toString()) || new Date().getFullYear()
      };
      await createPortfolio.mutateAsync(payload);
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setShowAddForm(false);
      setNewPortfolio({ title: '', description: '', image: '', category: '', author: '', year: new Date().getFullYear() });
      toast.success('Portfolio item added successfully');
    } catch (err) {
      console.error("Portfolio addition error:", err);
      toast.error('Failed to add portfolio item');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md p-8 bg-card border border-border animate-scale-in">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-foreground text-background rounded-full">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h1 className="heading-display text-2xl mb-6 text-center">Secure Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Admin Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="input-editorial w-full text-center tracking-widest" 
                autoFocus 
              />
            </div>
            <button type="submit" className="btn-editorial w-full justify-center">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-foreground text-background py-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <h1 className="font-heading text-xl tracking-tight">Udvasito CMS</h1>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex bg-card p-1 border border-border rounded-lg">
            <button 
              onClick={() => { setActiveTab('books'); setShowAddForm(false); }} 
              className={`px-8 py-2 text-sm font-medium transition-all rounded-md ${activeTab === 'books' ? 'bg-foreground text-background shadow-md' : 'hover:bg-muted'}`}
            >
              Books
            </button>
            <button 
              onClick={() => { setActiveTab('portfolio'); setShowAddForm(false); }} 
              className={`px-8 py-2 text-sm font-medium transition-all rounded-md ${activeTab === 'portfolio' ? 'bg-foreground text-background shadow-md' : 'hover:bg-muted'}`}
            >
              Portfolio
            </button>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="btn-editorial bg-foreground text-background hover:bg-transparent hover:text-foreground"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showAddForm ? 'Cancel' : `Add ${activeTab === 'books' ? 'Book' : 'Item'}`}</span>
          </button>
        </div>

        {showAddForm && (
          <div className="bg-card p-8 md:p-12 mb-12 border border-border shadow-xl animate-slide-up">
            <h2 className="heading-display text-3xl mb-8">New {activeTab === 'books' ? 'Book' : 'Portfolio Item'}</h2>
            
            {activeTab === 'books' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground ml-1">Book Title</label>
                    <input placeholder="Enter title..." value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} className="input-editorial w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground ml-1">Author Name</label>
                    <input placeholder="Enter author name..." value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} className="input-editorial w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground ml-1">Price (৳)</label>
                      <input type="number" placeholder="0.00" value={newBook.price} onChange={e => setNewBook({...newBook, price: parseInt(e.target.value) || 0})} className="input-editorial w-full" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground ml-1">Category</label>
                      <input placeholder="e.g. Novel, Poetry..." value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} className="input-editorial w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground ml-1">ISBN</label>
                      <input placeholder="ISBN..." value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} className="input-editorial w-full" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground ml-1">Total Pages</label>
                      <input type="number" placeholder="0" value={newBook.pages} onChange={e => setNewBook({...newBook, pages: parseInt(e.target.value) || 0})} className="input-editorial w-full" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground ml-1">Pub. Year</label>
                      <input type="number" placeholder="2024" value={newBook.publishedYear} onChange={e => setNewBook({...newBook, publishedYear: parseInt(e.target.value) || 0})} className="input-editorial w-full" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <textarea placeholder="Description" value={newBook.description} onChange={e => setNewBook({...newBook, description: e.target.value})} className="input-editorial w-full h-[120px] resize-none" />
                  <div className="border-2 border-dashed border-border p-4 text-center hover:bg-muted/50 transition-colors">
                    <input type="file" onChange={e => handleImageUpload(e, 'book')} className="hidden" id="book-img" />
                    <label htmlFor="book-img" className="cursor-pointer block">
                      <div className="flex flex-col items-center gap-2">
                        {newBook.coverImage ? (
                          <img src={newBook.coverImage} className="h-24 object-contain shadow-md" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Upload Cover Image</span>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newBook.featured} onChange={e => setNewBook({...newBook, featured: e.target.checked})} className="w-4 h-4" />
                      <span className="text-sm">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newBook.inStock} onChange={e => setNewBook({...newBook, inStock: e.target.checked})} className="w-4 h-4" />
                      <span className="text-sm">In Stock</span>
                    </label>
                  </div>
                </div>
                <button onClick={handleAddBook} disabled={createBook.isPending} className="btn-editorial md:col-span-2 w-full justify-center">
                  {createBook.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Book'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <input placeholder="Project Title" value={newPortfolio.title} onChange={e => setNewPortfolio({...newPortfolio, title: e.target.value})} className="input-editorial w-full" />
                  <input placeholder="Author/Artist" value={newPortfolio.author} onChange={e => setNewPortfolio({...newPortfolio, author: e.target.value})} className="input-editorial w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Category" value={newPortfolio.category} onChange={e => setNewPortfolio({...newPortfolio, category: e.target.value})} className="input-editorial w-full" />
                    <input type="number" placeholder="Year" value={newPortfolio.year} onChange={e => setNewPortfolio({...newPortfolio, year: parseInt(e.target.value) || 0})} className="input-editorial w-full" />
                  </div>
                  <textarea placeholder="Project Description" value={newPortfolio.description} onChange={e => setNewPortfolio({...newPortfolio, description: e.target.value})} className="input-editorial w-full h-[100px] resize-none" />
                </div>
                <div className="flex flex-col">
                  <div className="flex-1 border-2 border-dashed border-border p-4 text-center hover:bg-muted/50 transition-colors flex items-center justify-center">
                    <input type="file" onChange={e => handleImageUpload(e, 'portfolio')} className="hidden" id="port-img" />
                    <label htmlFor="port-img" className="cursor-pointer block w-full">
                      <div className="flex flex-col items-center gap-2">
                        {newPortfolio.image ? (
                          <img src={newPortfolio.image} className="h-40 object-contain shadow-md" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Upload Project Image</span>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
                <button onClick={handleAddPortfolio} disabled={createPortfolio.isPending} className="btn-editorial md:col-span-2 w-full justify-center">
                  {createPortfolio.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Portfolio Item'}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {activeTab === 'books' ? (
            books?.map((book, index) => (
              <div key={book.id} className="bg-card p-6 border border-border flex flex-col md:flex-row items-center gap-6 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <img src={book.coverImage} className="w-16 h-24 object-cover shadow-sm" />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-heading text-xl">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author} • {book.category} • ৳{book.price}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                    {book.featured && <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-foreground text-background">Featured</span>}
                    {!book.inStock && <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-destructive text-background">Out of Stock</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => { if(confirm('Delete book?')) { await apiRequest("DELETE", `/api/books/${book.id}`); queryClient.invalidateQueries({queryKey: ["/api/books"]}); toast.success('Book deleted'); } }} className="p-3 text-muted-foreground hover:text-destructive hover:bg-muted transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            portfolio?.map((item, index) => (
              <div key={item.id} className="bg-card p-6 border border-border flex flex-col md:flex-row items-center gap-6 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <img src={item.image} className="w-24 h-16 object-cover shadow-sm" />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-heading text-xl">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.author} • {item.category} • {item.year}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => { if(confirm('Delete item?')) { await apiRequest("DELETE", `/api/portfolio/${item.id}`); queryClient.invalidateQueries({queryKey: ["/api/portfolio"]}); toast.success('Item deleted'); } }} className="p-3 text-muted-foreground hover:text-destructive hover:bg-muted transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
          
          {((activeTab === 'books' && !books?.length) || (activeTab === 'portfolio' && !portfolio?.length)) && (
            <div className="text-center py-20 bg-card border border-dashed border-border rounded-lg">
              <p className="heading-italic text-2xl text-muted-foreground">No entries found. Add your first {activeTab === 'books' ? 'book' : 'portfolio item'}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
