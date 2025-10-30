import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import NewsManager from '@/components/admin/NewsManager';
import PromotionsManager from '@/components/admin/PromotionsManager';
import VacanciesManager from '@/components/admin/VacanciesManager';
import ConsultationsView from '@/components/admin/ConsultationsView';
import ReceiptsView from '@/components/admin/ReceiptsView';

type Tab = 'news' | 'promotions' | 'vacancies' | 'consultations' | 'receipts';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('news');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const tabs = [
    { id: 'news' as Tab, label: 'Новости', icon: 'Newspaper' },
    { id: 'promotions' as Tab, label: 'Акции', icon: 'Tag' },
    { id: 'vacancies' as Tab, label: 'Вакансии', icon: 'Briefcase' },
    { id: 'consultations' as Tab, label: 'Консультации', icon: 'Calendar' },
    { id: 'receipts' as Tab, label: 'Чеки', icon: 'Receipt' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
                <p className="text-sm text-gray-600">Управление контентом</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Icon name="Home" size={18} />
                На сайт
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Icon name="LogOut" size={18} />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex gap-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon name={tab.icon as any} size={20} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'news' && <NewsManager />}
            {activeTab === 'promotions' && <PromotionsManager />}
            {activeTab === 'vacancies' && <VacanciesManager />}
            {activeTab === 'consultations' && <ConsultationsView />}
            {activeTab === 'receipts' && <ReceiptsView />}
          </div>
        </div>
      </div>
    </div>
  );
}
