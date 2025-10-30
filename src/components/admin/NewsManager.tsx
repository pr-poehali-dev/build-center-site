import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface News {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
}

export default function NewsManager() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/news');
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const url = editingId
        ? `https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-news/${editingId}`
        : 'https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-news';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadNews();
        setEditingId(null);
        setIsAdding(false);
        setFormData({ title: '', content: '', author: '' });
      }
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту новость?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-news/${id}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': token || '' }
      });

      if (response.ok) {
        await loadNews();
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const startEdit = (item: News) => {
    setEditingId(item.id);
    setFormData({ title: item.title, content: item.content, author: item.author });
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ title: '', content: '', author: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ title: '', content: '', author: '' });
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
        <h2 className="text-2xl font-bold text-gray-900">Управление новостями</h2>
        {!isAdding && !editingId && (
          <Button onClick={startAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Icon name="Plus" size={20} />
            Добавить новость
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Редактировать новость' : 'Новая новость'}
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите заголовок"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Содержание</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Введите текст новости"
              className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Автор</label>
            <Input
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Имя автора"
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

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3">{item.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={16} />
                    {new Date(item.date).toLocaleDateString('ru-RU')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="User" size={16} />
                    {item.author}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => startEdit(item)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Icon name="Edit" size={16} />
                  Изменить
                </Button>
                <Button
                  onClick={() => handleDelete(item.id)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={16} />
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {news.length === 0 && !isAdding && (
        <div className="text-center py-12 text-gray-500">
          <Icon name="Newspaper" size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Новостей пока нет. Добавьте первую!</p>
        </div>
      )}
    </div>
  );
}
