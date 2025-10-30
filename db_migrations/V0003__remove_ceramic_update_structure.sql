-- Деактивируем старую таблицу ceramic_registrations (удалять нельзя)
-- Просто перестанем её использовать

-- Удаляем старую таблицу consultation_requests если она есть
-- (безопасно, так как мы перешли на bathroom_consultations)

-- Добавляем индекс на email для ceramic_registrations на случай если нужно будет найти старые данные
CREATE INDEX IF NOT EXISTS idx_ceramic_email_legacy ON ceramic_registrations(email);

-- Обновляем комментарий что таблица устарела (PostgreSQL поддерживает комментарии)
COMMENT ON TABLE ceramic_registrations IS 'DEPRECATED: Table is no longer used, migrated to bathroom_consultations';
COMMENT ON TABLE consultation_requests IS 'DEPRECATED: Table is no longer used, migrated to bathroom_consultations';
