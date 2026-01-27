import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

type Product = {
  id: number | string;
  title: string;
  price: number;
  image?: string | null;
  description?: string;
};

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // avoid TypeScript errors in environments where Vite types are not available
  // fall back to empty string so relative paths work in same-origin setups
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiBase = ((typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE_URL) as string) || '';

  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase}/api/products`)
      .then((r) => r.json())
      .then((data) => setProducts(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [apiBase]);

  const buyNow = async (productId: number | string, qty = 1) => {
    setMessage(null);
    try {
      const res = await fetch(`${apiBase}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: qty }),
      });
      const json = await res.json();
      if (json.url) {
        // Redirect to Stripe session or mock URL
        window.location.href = json.url;
      } else {
        setMessage('Could not create checkout session');
      }
    } catch (err) {
      console.error(err);
      setMessage('Checkout failed');
    }
  };

  const AddProductForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const res = await fetch(`${apiBase}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, price: Number(price), image, description }),
        });
        const product = await res.json();
        setProducts((p) => [product, ...p]);
        setTitle('');
        setPrice('');
        setImage('');
        setDescription('');
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <form onSubmit={submit} className="mb-6 p-4 border rounded">
        <h3 className="font-semibold mb-2">Add product (admin)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input className="border p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="border p-2" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input className="border p-2" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
          <input className="border p-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="mt-2">
          <Button type="submit" disabled={submitting || !title || !price}>{submitting ? 'Adding...' : 'Add product'}</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Recycled Products Store</h2>

      <p className="mb-4">Buy recycled and upcycled products made by the community. Proceeds support waste collection and local artisans.</p>

      <AddProductForm />

      {message && <div className="mb-4 text-red-600">{message}</div>}

      {loading ? (
        <div>Loading products...</div>
      ) : products.length === 0 ? (
        <div>No products available yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={String(p.id)} className="border rounded p-4 flex flex-col">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.title} className="h-40 w-full object-cover mb-3 rounded" />
              ) : (
                <div className="h-40 w-full bg-gray-100 flex items-center justify-center mb-3">No image</div>
              )}
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-muted-foreground flex-1">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="font-bold">₹{p.price}</div>
                <Button onClick={() => buyNow(p.id, 1)}>Buy now</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
