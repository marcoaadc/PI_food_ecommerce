import { useMemo, useState } from 'react';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { productsApi } from '../../api/products.api';
import { formatBRL } from '../../utils/currency';
import { groupByCategory } from '../../utils/groupByCategory';

const OTHER_OPTION = '__other__';

export function DashboardPage() {
  const { products, loading, refetch } = useProducts();
  const { categories: apiCategories } = useCategories();
  const [showForm, setShowForm] = useState(false);

  const availableCategories = useMemo(() => {
    const fromProducts = products.map((p) => p.category);
    const merged = new Set([...apiCategories, ...fromProducts]);
    return Array.from(merged).sort();
  }, [apiCategories, products]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const category = selectedCategory === OTHER_OPTION ? customCategory : selectedCategory;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await productsApi.create({
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        description: description || undefined,
      });
      setName('');
      setPrice('');
      setStock('');
      setSelectedCategory('');
      setCustomCategory('');
      setDescription('');
      setShowForm(false);
      await refetch();
    } catch {
      setError('Erro ao criar produto. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja desativar este produto?')) return;
    setError(null);
    try {
      await productsApi.remove(id);
      await refetch();
    } catch {
      setError('Erro ao desativar produto. Tente novamente.');
    }
  };

  const grouped = groupByCategory(products);

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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-5 mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-name" className="block text-sm text-gray-600 mb-1">Nome</label>
              <input id="product-name" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label htmlFor="product-category" className="block text-sm text-gray-600 mb-1">Categoria</label>
              <select
                id="product-category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value !== OTHER_OPTION) setCustomCategory('');
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="" disabled>Selecione...</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value={OTHER_OPTION}>Outra...</option>
              </select>
              {selectedCategory === OTHER_OPTION && (
                <input
                  id="product-custom-category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Nome da nova categoria"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 mt-2"
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-price" className="block text-sm text-gray-600 mb-1">Preco (R$)</label>
              <input id="product-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label htmlFor="product-stock" className="block text-sm text-gray-600 mb-1">Estoque</label>
              <input id="product-stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
            </div>
          </div>
          <div>
            <label htmlFor="product-description" className="block text-sm text-gray-600 mb-1">Descricao</label>
            <textarea id="product-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
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
