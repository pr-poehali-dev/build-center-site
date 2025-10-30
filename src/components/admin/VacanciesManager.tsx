import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Vacancy {
  id: number;
  title: string;
  description: string;
  salary: string;
  requirements: string;
}

export default function VacanciesManager() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', salary: '', requirements: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/vacancies');
      const data = await response.json();
      setVacancies(data.vacancies || []);
    } catch (error) {
      console.error('Error loading vacancies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const url = editingId
        ? `https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-vacancies/${editingId}`
        : 'https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-vacancies';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadVacancies();
        setEditingId(null);
        setIsAdding(false);
        setFormData({ title: '', description: '', salary: '', requirements: '' });
      }
    } catch (error) {
      console.error('Error saving vacancy:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту вакансию?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-vacancies/${id}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': token || '' }
      });

      if (response.ok) {
        await loadVacancies();
      }
    } catch (error) {
      console.error('Error deleting vacancy:', error);
    }
  };

  const startEdit = (item: Vacancy) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      salary: item.salary,
      requirements: item.requirements
    });
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ title: '', description: '', salary: '', requirements: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ title: '', description: '', salary: '', requirements: '' });
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
        <h2 className="text-2xl font-bold text-gray-900">Управление вакансиями</h2>
        {!isAdding && !editingId && (
          <Button onClick={startAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Icon name="Plus" size={20} />
            Добавить вакансию
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Редактировать вакансию' : 'Новая вакансия'}
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Должность</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название должности"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Введите описание вакансии"
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Зарплата</label>
            <Input
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="Например: от 50 000 руб."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Требования</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Введите требования к кандидату"
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {vacancies.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {item.salary}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Требования:</p>
                  <p className="text-sm text-gray-600">{item.requirements}</p>
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

      {vacancies.length === 0 && !isAdding && (
        <div className="text-center py-12 text-gray-500">
          <Icon name="Briefcase" size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Вакансий пока нет. Добавьте первую!</p>
        </div>
      )}
    </div>
  );
}
