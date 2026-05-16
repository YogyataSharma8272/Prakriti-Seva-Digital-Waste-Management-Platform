import React, { useEffect, useState } from 'react';
import apiService from '@/services/api';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Leaf, Recycle, ShoppingCart, Star } from 'lucide-react';

type Product = {
  id: number | string;
  title: string;
  price: number;
  image?: string | null;
  description?: string;
  category?: string;
  quantity?: number;
};

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadProducts = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await apiService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    const intervalId = window.setInterval(() => {
      loadProducts(true);
    }, 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  const buyNow = async (productId: number | string, qty = 1) => {
    setMessage(null);
    try {
      const json = await apiService.createCheckoutSession({ productId, quantity: qty });
      if (json.url && !String(json.url).startsWith('/mock-checkout-success')) {
        window.location.href = json.url;
      } else if (json.order) {
        setMessage(`✅ Order placed successfully. Order ID: ${json.order.id}`);
      } else {
        setMessage('Could not create checkout session');
      }
    } catch (err) {
      console.error(err);
      setMessage('Checkout failed');
    }
  };

  const categories = ['all', 'eco-friendly', 'upcycled', 'organic', 'zero-waste'];
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) || (product.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-emerald-900 via-green-800 to-amber-600 text-white shadow-2xl">
          <div className="p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="rounded-2xl p-5" style={{ background: '#006600', border: '2px solid #00A000', boxShadow: '0 4px 24px rgba(0,100,0,0.4)' }}>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold mb-4" style={{ background: '#00A000', color: '#ffffff' }}>
                <Recycle className="h-3.5 w-3.5" /> Recycled marketplace
              </div>
              <h2 className="text-4xl font-bold" style={{ color: '#ffffff' }}>Recycled Products Store</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm shrink-0">
              <div className="rounded-2xl p-4 shadow-lg" style={{ background: '#ecfdf5', border: '1px solid #6ee7b7' }}>
                <p className="font-semibold text-xs uppercase tracking-wide" style={{ color: '#065f46' }}>Live Products</p>
                <p className="text-3xl font-bold mt-1" style={{ color: '#064e3b' }}>{products.length}</p>
              </div>
              <div className="rounded-2xl p-4 shadow-lg" style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}>
                <p className="font-semibold text-xs uppercase tracking-wide" style={{ color: '#92400e' }}>Eco Picks</p>
                <p className="text-3xl font-bold mt-1" style={{ color: '#78350f' }}>100%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto] items-center rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recycled products..." className="h-12 rounded-2xl bg-white border-emerald-300 text-gray-800 placeholder:text-gray-500 shadow-sm" />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => loadProducts()} className="rounded-full border-emerald-400 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 hover:text-emerald-950">Refresh</Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full capitalize border-emerald-400 ${
                  selectedCategory === category
                    ? 'bg-emerald-800 text-white hover:bg-emerald-900 hover:text-white border-emerald-800'
                    : 'bg-white text-emerald-900 hover:bg-emerald-100 hover:text-emerald-950'
                }`}
              >
                {category.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {message && <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700 font-medium">{message}</div>}

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">No recycled products available yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-stretch">
            {filteredProducts.map((p) => (
              <Card key={String(p.id)} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow hover:shadow-md transition-shadow flex flex-col">
                <CardContent className="p-0 flex flex-col flex-1">
                  {/* Square 1:1 image — standard e-commerce style */}
                  <div className="relative w-full overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1', maxHeight: '170px' }}>
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback shown when no image or image fails to load */}
                    <div
                      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-2 text-green-600 bg-gradient-to-br from-green-50 to-orange-50"
                      style={{ display: p.image ? 'none' : 'flex' }}
                    >
                      <Leaf className="h-8 w-8" />
                      <span className="text-xs font-medium">Eco Product</span>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <Badge className="self-start mb-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 capitalize border border-emerald-200 text-[10px] px-1.5 py-0">{p.category || 'eco-friendly'}</Badge>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 leading-snug">{p.title}</h3>
                    <p className="text-xs text-gray-500 flex-1 line-clamp-2 leading-relaxed">{p.description}</p>
                    <div className="mt-2 flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-3 w-3 fill-current" />)}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="text-lg font-bold text-gray-900">₹{p.price}</div>
                      <Button onClick={() => buyNow(p.id, 1)} size="sm" className="rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs px-3 py-1.5 h-auto">
                        <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Buy
                      </Button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Stock: {p.quantity ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
