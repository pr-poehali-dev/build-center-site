const API_URL = 'https://functions.poehali.dev/b573015d-c38a-44e1-bb5b-16f4cbb1d1d6';

export const api = {
  async bathroomConsultation(data: { name: string; phone: string; date: string; time: string }) {
    const response = await fetch(`${API_URL}?path=bathroom-consultation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async receiptRegistration(data: { fullName: string; phone: string; receiptNumber: string; purchaseDate: string; amount: number }) {
    const response = await fetch(`${API_URL}?path=receipt-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getNews() {
    const response = await fetch(`${API_URL}?path=news`);
    return response.json();
  },

  async getPromotions() {
    const response = await fetch(`${API_URL}?path=promotions`);
    return response.json();
  },

  async getVacancies() {
    const response = await fetch(`${API_URL}?path=vacancies`);
    return response.json();
  },

  async adminLogin(username: string, password: string) {
    const response = await fetch(`${API_URL}?path=admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  async createNews(token: string, data: { title: string; content: string; publishedDate: string }) {
    const response = await fetch(`${API_URL}?path=news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateNews(token: string, data: { id: number; title?: string; content?: string }) {
    const response = await fetch(`${API_URL}?path=news`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteNews(token: string, id: number) {
    const response = await fetch(`${API_URL}?path=news&id=${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': token },
    });
    return response.json();
  },

  async createPromotion(token: string, data: any) {
    const response = await fetch(`${API_URL}?path=promotions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updatePromotion(token: string, data: any) {
    const response = await fetch(`${API_URL}?path=promotions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deletePromotion(token: string, id: number) {
    const response = await fetch(`${API_URL}?path=promotions&id=${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': token },
    });
    return response.json();
  },

  async createVacancy(token: string, data: any) {
    const response = await fetch(`${API_URL}?path=vacancies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateVacancy(token: string, data: any) {
    const response = await fetch(`${API_URL}?path=vacancies`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteVacancy(token: string, id: number) {
    const response = await fetch(`${API_URL}?path=vacancies&id=${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': token },
    });
    return response.json();
  },
};