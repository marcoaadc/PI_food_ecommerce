import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { formatBRL } from '../../utils/currency';
import apiClient from '../../api/client';
import type { Product } from '../../types/product';

export function DashboardPage() {
  const { products, loading, refetch } = useProducts();
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Lanches');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/products', {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        description: description || undefined,
      });
      setName('');
      setPrice('');
      setStock('');
      setDescription('');
      setShowForm(false);
      await refetch();
    } catch {
      alert('Erro ao criar produto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja desativar este produto?')) return;
    await apiClient.delete(`/products/${id}`);
    await refetch();
  };

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition cursor-pointer"
        >
          {showForm ? 'Cancelar' : '+ Novo Produto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-5 mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nome</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500">
                <option>Lanches</option>
                <option>Pizzas</option>
                <option>Bebidas</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Preço (R$)</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Estoque</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Descrição</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <button type="submit" disabled={saving}
            className="bg-amber-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition cursor-pointer disabled:opacity-50">
            {saving ? 'Salvando...' : 'Criar Produto'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">{cat}</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Produto</th>
                      <th className="text-left px-4 py-3 font-medium">Preço</th>
                      <th className="text-left px-4 py-3 font-medium">Estoque</th>
                      <th className="text-right px-4 py-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                        <td className="px-4 py-3 text-gray-600">{formatBRL(p.price)}</td>
                        <td className="px-4 py-3 text-gray-600">{p.stock} un.</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                          >
                            Desativar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
