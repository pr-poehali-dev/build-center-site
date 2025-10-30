import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface News {
  id: number;
  title: string;
  content: string;
  published_date: string;
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount_percentage?: number;
  price_from?: number;
  badge_text?: string;
}

interface Vacancy {
  id: number;
  title: string;
  employment_type: string;
  salary_from?: number;
  location?: string;
  requirements?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [news, setNews] = useState<News[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [isAddingVacancy, setIsAddingVacancy] = useState(false);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      const [newsData, promosData, vacanciesData] = await Promise.all([
        api.getNews(),
        api.getPromotions(),
        api.getVacancies(),
      ]);
      setNews(newsData);
      setPromotions(promosData);
      setVacancies(vacanciesData);
    } catch (error) {
      toast.error("Ошибка загрузки данных");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await api.adminLogin(username, password);
      if (result.token) {
        localStorage.setItem('adminToken', result.token);
        setToken(result.token);
        toast.success(`Добро пожаловать, ${result.fullName || result.username}!`);
      }
    } catch (error) {
      toast.error("Неверные данные для входа");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    navigate('/');
  };

  const handleAddNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await api.createNews(token!, {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        publishedDate: formData.get('publishedDate') as string,
      });
      toast.success("Новость добавлена");
      setIsAddingNews(false);
      loadData();
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Ошибка при добавлении новости");
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await api.deleteNews(token!, id);
      toast.success("Новость удалена");
      loadData();
    } catch (error) {
      toast.error("Ошибка при удалении новости");
    }
  };

  const handleAddPromotion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await api.createPromotion(token!, {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        discountPercentage: formData.get('discountPercentage') ? parseInt(formData.get('discountPercentage') as string) : undefined,
        priceFrom: formData.get('priceFrom') ? parseFloat(formData.get('priceFrom') as string) : undefined,
        badgeText: formData.get('badgeText') as string,
      });
      toast.success("Акция добавлена");
      setIsAddingPromo(false);
      loadData();
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Ошибка при добавлении акции");
    }
  };

  const handleDeletePromotion = async (id: number) => {
    try {
      await api.deletePromotion(token!, id);
      toast.success("Акция удалена");
      loadData();
    } catch (error) {
      toast.error("Ошибка при удалении акции");
    }
  };

  const handleAddVacancy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await api.createVacancy(token!, {
        title: formData.get('title') as string,
        employmentType: formData.get('employmentType') as string,
        salaryFrom: formData.get('salaryFrom') ? parseInt(formData.get('salaryFrom') as string) : undefined,
        location: formData.get('location') as string,
        requirements: formData.get('requirements') as string,
      });
      toast.success("Вакансия добавлена");
      setIsAddingVacancy(false);
      loadData();
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Ошибка при добавлении вакансии");
    }
  };

  const handleDeleteVacancy = async (id: number) => {
    try {
      await api.deleteVacancy(token!, id);
      toast.success("Вакансия удалена");
      loadData();
    } catch (error) {
      toast.error("Ошибка при удалении вакансии");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Вход в админ-панель</CardTitle>
            <CardDescription>Введите данные для входа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Войти</Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/')}>
                На главную
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Админ-панель СТРОЙЦЕНТР</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" size={18} className="mr-2" />
              На сайт
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="promotions">Акции</TabsTrigger>
            <TabsTrigger value="vacancies">Вакансии</TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Управление новостями</h2>
              <Dialog open={isAddingNews} onOpenChange={setIsAddingNews}>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить новость
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая новость</DialogTitle>
                    <DialogDescription>Заполните данные для новой новости</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddNews} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="news-title">Заголовок *</Label>
                      <Input id="news-title" name="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-content">Содержание *</Label>
                      <Textarea id="news-content" name="content" rows={4} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-date">Дата публикации *</Label>
                      <Input id="news-date" name="publishedDate" type="date" required />
                    </div>
                    <Button type="submit" className="w-full">Добавить</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {news.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{new Date(item.published_date).toLocaleDateString('ru-RU')}</CardDescription>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteNews(item.id)}>
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="promotions">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Управление акциями</h2>
              <Dialog open={isAddingPromo} onOpenChange={setIsAddingPromo}>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить акцию
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая акция</DialogTitle>
                    <DialogDescription>Заполните данные для новой акции</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPromotion} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-title">Название *</Label>
                      <Input id="promo-title" name="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promo-description">Описание *</Label>
                      <Textarea id="promo-description" name="description" rows={3} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="promo-discount">Скидка %</Label>
                        <Input id="promo-discount" name="discountPercentage" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-price">Цена от</Label>
                        <Input id="promo-price" name="priceFrom" type="number" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promo-badge">Текст бейджа</Label>
                      <Input id="promo-badge" name="badgeText" placeholder="-30%" />
                    </div>
                    <Button type="submit" className="w-full">Добавить</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {promotions.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.badge_text}</CardDescription>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePromotion(item.id)}>
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{item.description}</p>
                    {item.discount_percentage && <p className="font-semibold">Скидка: {item.discount_percentage}%</p>}
                    {item.price_from && <p className="font-semibold">Цена: от {item.price_from}₽</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vacancies">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Управление вакансиями</h2>
              <Dialog open={isAddingVacancy} onOpenChange={setIsAddingVacancy}>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить вакансию
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая вакансия</DialogTitle>
                    <DialogDescription>Заполните данные для новой вакансии</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddVacancy} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vac-title">Должность *</Label>
                      <Input id="vac-title" name="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vac-type">Тип занятости *</Label>
                      <Input id="vac-type" name="employmentType" placeholder="Полная занятость" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vac-salary">Зарплата от</Label>
                        <Input id="vac-salary" name="salaryFrom" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vac-location">Локация</Label>
                        <Input id="vac-location" name="location" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vac-requirements">Требования</Label>
                      <Textarea id="vac-requirements" name="requirements" rows={3} />
                    </div>
                    <Button type="submit" className="w-full">Добавить</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {vacancies.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.employment_type}</CardDescription>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteVacancy(item.id)}>
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {item.salary_from && <p className="font-semibold mb-2">Зарплата: от {item.salary_from.toLocaleString()}₽</p>}
                    {item.location && <p className="text-sm mb-2">📍 {item.location}</p>}
                    {item.requirements && <p className="text-sm text-muted-foreground">{item.requirements}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
