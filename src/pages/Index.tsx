import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import SelectTime from "@/components/ui/select-time";
import { api } from "@/lib/api";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [consultationTime, setConsultationTime] = useState("");

  const handleConsultationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await api.bathroomConsultation({
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        date: formData.get('date') as string,
        time: consultationTime,
      });
      toast.success("Заявка отправлена! Наш специалист свяжется с вами в ближайшее время.");
      e.currentTarget.reset();
      setConsultationTime("");
    } catch (error) {
      toast.error("Ошибка при отправке заявки. Попробуйте позже.");
    }
  };

  const handleCeramicSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await api.ceramicRegistration({
        fullName: formData.get('fullName') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        address: formData.get('address') as string || '',
      });
      toast.success("Регистрация в Ceramic 3D успешно завершена!");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Ошибка регистрации. Попробуйте позже.");
    }
  };

  const handleReceiptSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await api.receiptRegistration({
        fullName: formData.get('fullName') as string,
        phone: formData.get('phone') as string,
        receiptNumber: formData.get('receiptNumber') as string,
        purchaseDate: formData.get('purchaseDate') as string,
        amount: parseFloat(formData.get('amount') as string),
      });
      toast.success("Чек зарегистрирован! Вы участвуете в розыгрыше призов.");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Ошибка регистрации чека. Попробуйте позже.");
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Hammer" size={32} className="text-accent" />
              <h1 className="text-2xl md:text-3xl font-bold">СТРОЙЦЕНТР</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <button onClick={() => scrollToSection("home")} className="hover:text-accent transition-colors">
                Главная
              </button>
              <button onClick={() => scrollToSection("news")} className="hover:text-accent transition-colors">
                Новости
              </button>
              <button onClick={() => scrollToSection("vacancies")} className="hover:text-accent transition-colors">
                Вакансии
              </button>
              <button onClick={() => scrollToSection("promo")} className="hover:text-accent transition-colors">
                Акции
              </button>
              <button onClick={() => scrollToSection("forms")} className="hover:text-accent transition-colors">
                Сервисы
              </button>
            </nav>
          </div>
        </div>
      </header>

      <section id="home" className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Всё для строительства и ремонта</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Качественные материалы, профессиональные консультации, выгодные предложения
            </p>
            <Button 
              size="lg" 
              onClick={() => scrollToSection("forms")}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              Получить консультацию
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section id="promo" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Текущие акции и спецпредложения</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-scale">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Percent" size={32} className="text-accent" />
                  <Badge variant="destructive">-30%</Badge>
                </div>
                <CardTitle>Скидка на цемент</CardTitle>
                <CardDescription>До конца месяца</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Специальная цена на цемент М500. Идеально для фундаментных работ.
                </p>
                <p className="text-2xl font-bold text-accent">от 280₽/мешок</p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Gift" size={32} className="text-accent" />
                  <Badge className="bg-accent text-white">Подарок</Badge>
                </div>
                <CardTitle>Ceramic 3D - бонусы</CardTitle>
                <CardDescription>При регистрации</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Зарегистрируйтесь в программе Ceramic 3D и получите скидку 15% на первую покупку.
                </p>
                <Button variant="outline" onClick={() => scrollToSection("forms")}>
                  Зарегистрироваться
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Trophy" size={32} className="text-accent" />
                  <Badge variant="secondary">Розыгрыш</Badge>
                </div>
                <CardTitle>Регистрация чеков</CardTitle>
                <CardDescription>Участвуйте в розыгрыше</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Регистрируйте чеки и выигрывайте ценные призы каждый месяц.
                </p>
                <p className="text-lg font-semibold">Главный приз: Перфоратор Makita</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="news" className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Новости</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                  <Icon name="Calendar" size={16} />
                  <span>25 октября 2025</span>
                </div>
                <CardTitle>Новое поступление инструментов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  В продажу поступила новая линейка профессиональных электроинструментов от ведущих производителей.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                  <Icon name="Calendar" size={16} />
                  <span>20 октября 2025</span>
                </div>
                <CardTitle>Расширение ассортимента</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Теперь в наличии керамическая плитка Ceramic 3D - инновационное покрытие с 3D эффектом.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                  <Icon name="Calendar" size={16} />
                  <span>15 октября 2025</span>
                </div>
                <CardTitle>График работы в выходные</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Уважаемые клиенты! В эти выходные магазин работает с 9:00 до 20:00 без перерыва.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                  <Icon name="Calendar" size={16} />
                  <span>10 октября 2025</span>
                </div>
                <CardTitle>Консультации специалистов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Запущена новая услуга - бесплатные консультации по выбору материалов для вашего проекта.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="vacancies" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Вакансии</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card className="hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Продавец-консультант</CardTitle>
                    <CardDescription className="mt-2">Полная занятость</CardDescription>
                  </div>
                  <Badge className="bg-accent text-white">Активна</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Icon name="Banknote" size={18} className="text-accent mt-1" />
                    <div>
                      <p className="font-semibold">Зарплата: от 50 000₽</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="MapPin" size={18} className="text-accent mt-1" />
                    <p>Москва, ул. Строителей, 45</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={18} className="text-accent mt-1" />
                    <p className="text-sm text-muted-foreground">
                      Требования: опыт работы в продажах, знание строительных материалов, коммуникабельность
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Грузчик-комплектовщик</CardTitle>
                    <CardDescription className="mt-2">Полная занятость</CardDescription>
                  </div>
                  <Badge className="bg-accent text-white">Активна</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Icon name="Banknote" size={18} className="text-accent mt-1" />
                    <div>
                      <p className="font-semibold">Зарплата: от 45 000₽</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="MapPin" size={18} className="text-accent mt-1" />
                    <p>Москва, ул. Строителей, 45</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={18} className="text-accent mt-1" />
                    <p className="text-sm text-muted-foreground">
                      Требования: ответственность, физическая выносливость, опыт работы приветствуется
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Кассир</CardTitle>
                    <CardDescription className="mt-2">Гибкий график</CardDescription>
                  </div>
                  <Badge className="bg-accent text-white">Активна</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Icon name="Banknote" size={18} className="text-accent mt-1" />
                    <div>
                      <p className="font-semibold">Зарплата: от 40 000₽</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="MapPin" size={18} className="text-accent mt-1" />
                    <p>Москва, ул. Строителей, 45</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={18} className="text-accent mt-1" />
                    <p className="text-sm text-muted-foreground">
                      Требования: внимательность, умение работать с кассовым оборудованием, стрессоустойчивость
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="forms" className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Сервисы для клиентов</h2>
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="consultation" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8">
                <TabsTrigger value="consultation">Консультация специалиста</TabsTrigger>
                <TabsTrigger value="ceramic">Ceramic 3D</TabsTrigger>
                <TabsTrigger value="receipt">Регистрация чеков</TabsTrigger>
              </TabsList>

              <TabsContent value="consultation">
                <Card>
                  <CardHeader>
                    <CardTitle>Запись на консультацию проект "Ванная комната"</CardTitle>
                    <CardDescription>
                      Наш эксперт проведет консультацию по проектированию вашей ванной комнаты
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleConsultationSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cons-name">Ваше имя *</Label>
                          <Input id="cons-name" name="name" placeholder="Иван Иванов" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cons-phone">Телефон *</Label>
                          <Input id="cons-phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cons-date">Дата консультации *</Label>
                          <Input id="cons-date" name="date" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cons-time">Время консультации *</Label>
                          <SelectTime id="cons-time" value={consultationTime} onChange={setConsultationTime} />
                        </div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Icon name="Info" size={20} className="text-accent mt-0.5" />
                          <p className="text-sm">
                            Консультации проводятся с 9:00 до 20:00. Продолжительность консультации - 1 час.
                          </p>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={!consultationTime}>
                        Записаться на консультацию
                        <Icon name="Calendar" size={18} className="ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ceramic">
                <Card>
                  <CardHeader>
                    <CardTitle>Регистрация в программе Ceramic 3D</CardTitle>
                    <CardDescription>
                      Получите доступ к эксклюзивным предложениям и бонусам при покупке керамики
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCeramicSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cer-name">ФИО *</Label>
                          <Input id="cer-name" name="fullName" placeholder="Иванов Иван Иванович" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cer-phone">Телефон *</Label>
                          <Input id="cer-phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cer-email">Email *</Label>
                        <Input id="cer-email" name="email" type="email" placeholder="example@mail.ru" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cer-address">Адрес доставки</Label>
                        <Input id="cer-address" name="address" placeholder="Город, улица, дом, квартира" />
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Icon name="Info" size={20} className="text-accent mt-0.5" />
                          <p className="text-sm">
                            После регистрации вы получите персональную карту участника программы и бонус 15% на первую покупку
                          </p>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white">
                        Зарегистрироваться
                        <Icon name="CheckCircle" size={18} className="ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="receipt">
                <Card>
                  <CardHeader>
                    <CardTitle>Регистрация чека на розыгрыш</CardTitle>
                    <CardDescription>
                      Регистрируйте чеки на сумму от 3000₽ и участвуйте в ежемесячном розыгрыше призов
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleReceiptSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rec-name">ФИО *</Label>
                          <Input id="rec-name" name="fullName" placeholder="Иванов Иван Иванович" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rec-phone">Телефон *</Label>
                          <Input id="rec-phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rec-number">Номер чека *</Label>
                          <Input id="rec-number" name="receiptNumber" placeholder="0000 1234 5678 9012" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rec-date">Дата покупки *</Label>
                          <Input id="rec-date" name="purchaseDate" type="date" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rec-amount">Сумма чека (₽) *</Label>
                        <Input id="rec-amount" name="amount" type="number" min="3000" placeholder="3000" required />
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                        <div className="flex items-start gap-2">
                          <Icon name="Trophy" size={24} className="text-accent mt-0.5" />
                          <div>
                            <p className="font-semibold mb-1">Призы этого месяца:</p>
                            <ul className="text-sm space-y-1">
                              <li>🥇 Главный приз: Перфоратор Makita HR2470</li>
                              <li>🥈 2-е место: Шуруповерт Bosch GSR 12V-15</li>
                              <li>🥉 3-е место: Набор инструментов 100 предметов</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white">
                        Зарегистрировать чек
                        <Icon name="Ticket" size={18} className="ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Hammer" size={28} className="text-accent" />
                <h3 className="text-xl font-bold">СТРОЙЦЕНТР</h3>
              </div>
              <p className="text-sm opacity-80">
                Ваш надежный партнер в строительстве и ремонте с 2005 года
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  <span>+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>info@stroicentr.ru</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  <span>Москва, ул. Строителей, 45</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Режим работы</h4>
              <div className="space-y-1 text-sm opacity-80">
                <p>Пн-Пт: 8:00 - 21:00</p>
                <p>Сб-Вс: 9:00 - 20:00</p>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-60">
            © 2025 СТРОЙЦЕНТР. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;