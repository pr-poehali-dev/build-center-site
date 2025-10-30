import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount: string;
  valid_until: string;
}

export default function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', discount: '', valid_until: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/promotions');
      const data = await response.json();
      setPromotions(data.promotions || []);
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const url = editingId
        ? `https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-promotions/${editingId}`
        : 'https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-promotions';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadPromotions();
        setEditingId(null);
        setIsAdding(false);
        setFormData({ title: '', description: '', discount: '', valid_until: '' });
      }
    } catch (error) {
      console.error('Error saving promotion:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту акцию?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-promotions/${id}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': token || '' }
      });

      if (response.ok) {
        await loadPromotions();
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const startEdit = (item: Promotion) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      discount: item.discount,
      valid_until: item.valid_until
    });
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ title: '', description: '', discount: '', valid_until: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ title: '', description: '', discount: '', valid_until: '' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Управление акциями</h2>
        {!isAdding && !editingId && (
          <Button onClick={startAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Icon name="Plus" size={20} />
            Добавить акцию
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Редактировать акцию' : 'Новая акция'}
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название акции"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Введите описание акции"
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Скидка</label>
            <Input
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              placeholder="Например: 20%"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Действует до</label>
            <Input
              type="date"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Icon name="Save" size={18} />
              Сохранить
            </Button>
            <Button onClick={cancelEdit} variant="outline" className="flex items-center gap-2">
              <Icon name="X" size={18} />
              Отмена
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {promotions.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {item.discount}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Icon name="Clock" size={16} />
                до {new Date(item.valid_until).toLocaleDateString('ru-RU')}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => startEdit(item)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Icon name="Edit" size={16} />
                </Button>
                <Button
                  onClick={() => handleDelete(item.id)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {promotions.length === 0 && !isAdding && (
        <div className="text-center py-12 text-gray-500">
          <Icon name="Tag" size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Акций пока нет. Добавьте первую!</p>
        </div>
      )}
    </div>
  );
}
