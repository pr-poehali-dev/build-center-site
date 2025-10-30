-- Таблица для заявок на консультацию
CREATE TABLE consultation_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new'
);

-- Таблица для регистраций в программе Ceramic 3D
CREATE TABLE ceramic_registrations (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bonus_used BOOLEAN DEFAULT false
);

-- Таблица для регистрации чеков на розыгрыш
CREATE TABLE receipt_registrations (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    receipt_number VARCHAR(100) NOT NULL,
    purchase_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    winner_status VARCHAR(50) DEFAULT 'pending'
);

-- Таблица для новостей
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    published_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Таблица для вакансий
CREATE TABLE vacancies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    employment_type VARCHAR(100) NOT NULL,
    salary_from INTEGER,
    location VARCHAR(255),
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для акций
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    discount_percentage INTEGER,
    price_from DECIMAL(10, 2),
    valid_until DATE,
    badge_text VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для ускорения поиска
CREATE INDEX idx_consultation_status ON consultation_requests(status);
CREATE INDEX idx_ceramic_email ON ceramic_registrations(email);
CREATE INDEX idx_receipt_date ON receipt_registrations(purchase_date);
CREATE INDEX idx_news_active ON news(is_active, published_date DESC);
CREATE INDEX idx_vacancies_active ON vacancies(is_active);
CREATE INDEX idx_promotions_active ON promotions(is_active);
