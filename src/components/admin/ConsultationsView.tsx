import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Consultation {
  id: number;
  name: string;
  phone: string;
  consultation_date: string;
  consultation_time: string;
  created_at: string;
}

export default function ConsultationsView() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-consultations', {
        headers: { 'X-Auth-Token': token || '' }
      });
      const data = await response.json();
      setConsultations(data.consultations || []);
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту заявку?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6/admin-consultations/${id}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': token || '' }
      });

      if (response.ok) {
        await loadConsultations();
      }
    } catch (error) {
      console.error('Error deleting consultation:', error);
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Заявки на консультацию</h2>
        <Button onClick={loadConsultations} variant="outline" className="flex items-center gap-2">
          <Icon name="RefreshCw" size={18} />
          Обновить
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Информация о заявках</p>
          <p>Здесь отображаются все заявки клиентов на консультацию со специалистом. Свяжитесь с клиентом по указанному номеру телефона.</p>
        </div>
      </div>

      <div className="space-y-4">
        {consultations.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Клиент</p>
                  <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Icon name="User" size={18} />
                    {item.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Телефон</p>
                  <a
                    href={`tel:${item.phone}`}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2"
                  >
                    <Icon name="Phone" size={18} />
                    {item.phone}
                  </a>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Дата консультации</p>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Icon name="Calendar" size={18} />
                    {new Date(item.consultation_date).toLocaleDateString('ru-RU')}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Время</p>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Icon name="Clock" size={18} />
                    {item.consultation_time}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 mb-1">Заявка создана</p>
                  <p className="text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>

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
        ))}
      </div>

      {consultations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Заявок на консультацию пока нет</p>
        </div>
      )}
    </div>
  );
}
