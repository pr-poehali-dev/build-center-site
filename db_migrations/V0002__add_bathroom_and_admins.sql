-- Создаем таблицу для записи на консультацию "Ванная комната"
CREATE TABLE bathroom_consultations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    consultation_date DATE NOT NULL,
    consultation_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending'
);

-- Таблица администраторов
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Индексы
CREATE INDEX idx_bathroom_consultations_date ON bathroom_consultations(consultation_date, consultation_time);
CREATE INDEX idx_bathroom_consultations_status ON bathroom_consultations(status);
CREATE INDEX idx_admins_username ON admins(username);

-- Добавляем тестового администратора (логин: admin, пароль: admin123)
INSERT INTO admins (username, password_hash, full_name) 
VALUES ('admin', 'admin123', 'Администратор');
