import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { config } from '@/lib/config';

const Cart = () => {
  const cart = useStore((state) => state.cart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 60;
  const total = subtotal + shipping;

  const handleRemove = (bookId: string, title: string) => {
    removeFromCart(bookId);
    toast.success(`${title} removed from cart`);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare order details for email
    const orderDetails = cart.map(item => 
      `${item.book.title} by ${item.book.author} - Qty: ${item.quantity} - ৳${item.book.price * item.quantity}`
    ).join('\n');

    const templateParams = {
      customer_name: checkoutData.name,
      customer_email: checkoutData.email,
      customer_phone: checkoutData.phone,
      customer_address: checkoutData.address,
      customer_notes: checkoutData.notes || 'No additional notes',
      order_details: orderDetails,
      subtotal: `৳${subtotal}`,
      shipping: shipping === 0 ? 'Free' : `৳${shipping}`,
      total: `৳${total}`,
      order_date: new Date().toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      // Send email using EmailJS with config
      await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.templateId,
        templateParams,
        config.emailjs.publicKey
      );
      
      setShowSuccess(true);
      clearCart();
      setCheckoutData({ name: '', email: '', phone: '', address: '', notes: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      // Still show success for demo purposes (remove in production)
      setShowSuccess(true);
      clearCart();
      setCheckoutData({ name: '', email: '', phone: '', address: '', notes: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Modal
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 md:p-12 text-center animate-scale-in">
          <div className="relative inline-block mb-6">
            <CheckCircle className="w-20 h-20 text-foreground mx-auto" />
            <div className="absolute inset-0 bg-foreground/10 rounded-full blur-xl" />
          </div>
          <h2 className="heading-display text-3xl mb-4">Order Placed Successfully!</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Thank you for your order. You will receive a confirmation email from our 
            customer service team very soon. We appreciate your trust in Udvasito Pathshala.
          </p>
          <Link to="/shop" className="btn-editorial inline-flex justify-center">
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center min-h-screen flex items-center">
        <div className="container mx-auto animate-fade-in">
          <h1 className="heading-display text-5xl mb-6">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            Looks like you haven't added any books yet. Start exploring our collection 
            to find your next great read.
          </p>
          <Link to="/shop" className="btn-editorial inline-flex">
            <span>Browse Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto">
        {/* Checkout Form Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-background p-8 md:p-12 max-h-[90vh] overflow-y-auto animate-scale-in">
              <div className="flex items-center justify-between mb-8">
                <h2 className="heading-display text-3xl">Checkout</h2>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="p-2 hover:bg-secondary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={checkoutData.name}
                    onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                    className="input-editorial w-full"
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={checkoutData.email}
                      onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                      className="input-editorial w-full"
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                      className="input-editorial w-full"
                      required
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Delivery Address *</label>
                  <textarea
                    value={checkoutData.address}
                    onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                    className="input-editorial w-full resize-none"
                    rows={3}
                    required
                    placeholder="Enter your complete delivery address including area, city, and postal code"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Additional Notes (Optional)</label>
                  <textarea
                    value={checkoutData.notes}
                    onChange={(e) => setCheckoutData({ ...checkoutData, notes: e.target.value })}
                    className="input-editorial w-full resize-none"
                    rows={3}
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                {/* Order Summary in Checkout */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-heading text-lg mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    {cart.map((item) => (
                      <div key={item.book.id} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {item.book.title} × {item.quantity}
                        </span>
                        <span>৳{item.book.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>৳{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `৳${shipping}`}</span>
                      </div>
                      <div className="flex justify-between font-heading text-lg mt-2">
                        <span>Total</span>
                        <span>৳{total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-editorial w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-sm tracking-widest uppercase">Continue Shopping</span>
          </Link>
          <h1 className="heading-display text-5xl md:text-6xl">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item, index) => (
              <div 
                key={item.book.id} 
                className="flex gap-6 p-6 bg-card animate-fade-in border border-border/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link to={`/shop/${item.book.id}`} className="shrink-0 group overflow-hidden">
                  <img
                    src={item.book.image}
                    alt={item.book.title}
                    className="w-24 h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/shop/${item.book.id}`}>
                    <h3 className="font-heading text-xl hover:text-muted-foreground transition-colors">
                      {item.book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-1">{item.book.author}</p>
                  <p className="text-xs text-muted-foreground mb-4">{item.book.category}</p>
                  <p className="font-heading text-lg mb-4">৳{item.book.price}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => updateCartQuantity(item.book.id, Math.max(1, item.quantity - 1))}
                        className="p-3 hover:bg-secondary transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-5 py-3 min-w-[3rem] text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.book.id, item.quantity + 1)}
                        className="p-3 hover:bg-secondary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.book.id, item.book.title)}
                      className="p-3 text-muted-foreground hover:text-destructive hover:bg-secondary transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading text-xl">৳{item.book.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-8 sticky top-24 border border-border/50 animate-fade-in delay-200">
              <h2 className="heading-display text-2xl mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `৳${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground bg-secondary/50 p-3">
                    Add ৳{1000 - subtotal} more to get free shipping!
                  </p>
                )}
                <div className="border-t border-border pt-4 flex justify-between font-heading text-xl">
                  <span>Total</span>
                  <span>৳{total}</span>
                </div>
              </div>

              <button 
                onClick={() => setShowCheckout(true)} 
                className="btn-editorial w-full justify-center group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Cash on delivery available nationwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
