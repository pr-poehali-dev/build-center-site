import json
import os
import hashlib
import secrets
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def verify_admin_token(event: Dict[str, Any]) -> bool:
    token = event.get('headers', {}).get('X-Auth-Token', '')
    if not token:
        return False
    admin_password = os.environ.get('ADMIN_PASSWORD', '')
    expected_token = hashlib.sha256(admin_password.encode()).hexdigest()
    return token == expected_token

def success_response(data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data),
        'isBase64Encoded': False
    }

def error_response(message: str, status_code: int = 400) -> Dict[str, Any]:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с записями на консультации, новостями, акциями и вакансиями
    Args: event с httpMethod, body, queryStringParameters; context с request_id
    Returns: HTTP response с statusCode, headers, body
    '''
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('queryStringParameters', {}).get('path', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        if path == 'admin-login' and method == 'POST':
            return admin_login(event)
        elif path == 'bathroom-consultation' and method == 'POST':
            return create_bathroom_consultation(event)
        elif path == 'receipt-registration' and method == 'POST':
            return create_receipt_registration(event)
        elif path == 'news' and method == 'GET':
            return get_news(event)
        elif path.startswith('admin-news'):
            if not verify_admin_token(event):
                return error_response('Unauthorized', 401)
            if method == 'POST':
                return create_news(event)
            elif method == 'PUT':
                return update_news(event)
            elif method == 'DELETE':
                return delete_news(event)
        elif path == 'promotions' and method == 'GET':
            return get_promotions(event)
        elif path.startswith('admin-promotions'):
            if not verify_admin_token(event):
                return error_response('Unauthorized', 401)
            if method == 'POST':
                return create_promotion(event)
            elif method == 'PUT':
                return update_promotion(event)
            elif method == 'DELETE':
                return delete_promotion(event)
        elif path == 'vacancies' and method == 'GET':
            return get_vacancies(event)
        elif path.startswith('admin-vacancies'):
            if not verify_admin_token(event):
                return error_response('Unauthorized', 401)
            if method == 'POST':
                return create_vacancy(event)
            elif method == 'PUT':
                return update_vacancy(event)
            elif method == 'DELETE':
                return delete_vacancy(event)
        elif path == 'admin-consultations' and method == 'GET':
            if not verify_admin_token(event):
                return error_response('Unauthorized', 401)
            return get_consultations(event)
        elif path.startswith('admin-consultations/') and method == 'DELETE':
            if not verify_admin_token(event):
                return error_response('Unauthorized', 401)
            return delete_consultation(event)
        elif path == 'admin-receipts' and method == 'GET':
            if not verify_admin_token(event):
                return error_response('Unauthorized', 401)
            return get_receipts(event)
        elif path.startswith('admin-receipts/') and method == 'DELETE':
            if not verify_admin_token(event):
                return error_response('Unauthorized', 401)
            return delete_receipt(event)

        else:
            return error_response('Not found', 404)
    except Exception as e:
        return error_response(str(e), 500)

def admin_login(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    password = body_data.get('password', '')
    admin_password = os.environ.get('ADMIN_PASSWORD', '')
    
    if password == admin_password:
        token = hashlib.sha256(admin_password.encode()).hexdigest()
        return success_response({'token': token, 'message': 'Login successful'})
    else:
        return error_response('Invalid password', 401)

def create_bathroom_consultation(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    name = body_data.get('name', '')
    phone = body_data.get('phone', '')
    consultation_date = body_data.get('date', '')
    consultation_time = body_data.get('time', '')
    
    if not all([name, phone, consultation_date, consultation_time]):
        return error_response('Missing required fields', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO t_p40088213_build_center_site.bathroom_consultations (name, phone, consultation_date, consultation_time) VALUES ('{}', '{}', '{}', '{}') RETURNING id".format(
            name.replace("'", "''"),
            phone.replace("'", "''"),
            consultation_date,
            consultation_time
        )
    )
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'message': 'Consultation booked successfully'})

def create_receipt_registration(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    full_name = body_data.get('fullName', '')
    phone = body_data.get('phone', '')
    receipt_number = body_data.get('receiptNumber', '')
    purchase_date = body_data.get('purchaseDate', '')
    amount = body_data.get('amount', 0)
    
    if not all([full_name, phone, receipt_number, purchase_date, amount]):
        return error_response('Missing required fields', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO t_p40088213_build_center_site.receipt_registrations (full_name, phone, receipt_number, purchase_date, amount) VALUES ('{}', '{}', '{}', '{}', {}) RETURNING id".format(
            full_name.replace("'", "''"),
            phone.replace("'", "''"),
            receipt_number.replace("'", "''"),
            purchase_date,
            amount
        )
    )
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'message': 'Receipt registered successfully'})

def get_news(event: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, title, content, author, published_date, is_active FROM t_p40088213_build_center_site.news WHERE is_active = true ORDER BY published_date DESC")
    news = cur.fetchall()
    cur.close()
    conn.close()
    
    return success_response({'news': [dict(n) for n in news]})

def create_news(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    title = body_data.get('title', '')
    content = body_data.get('content', '')
    author = body_data.get('author', '')
    published_date = body_data.get('publishedDate', datetime.now().strftime('%Y-%m-%d'))
    
    if not all([title, content]):
        return error_response('Missing required fields', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO t_p40088213_build_center_site.news (title, content, author, published_date) VALUES ('{}', '{}', '{}', '{}') RETURNING id".format(
            title.replace("'", "''"),
            content.replace("'", "''"),
            author.replace("'", "''"),
            published_date
        )
    )
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'message': 'News created successfully'})

def update_news(event: Dict[str, Any]) -> Dict[str, Any]:
    path = event.get('queryStringParameters', {}).get('path', '')
    path_parts = path.split('/')
    news_id = path_parts[1] if len(path_parts) > 1 else None
    
    if not news_id:
        return error_response('Missing news ID', 400)
    
    body_data = json.loads(event.get('body', '{}'))
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    updates = []
    if 'title' in body_data:
        updates.append("title = '{}'".format(body_data['title'].replace("'", "''")))
    if 'content' in body_data:
        updates.append("content = '{}'".format(body_data['content'].replace("'", "''")))
    if 'author' in body_data:
        updates.append("author = '{}'".format(body_data['author'].replace("'", "''")))
    
    if updates:
        cur.execute("UPDATE t_p40088213_build_center_site.news SET {} WHERE id = {}".format(', '.join(updates), news_id))
        conn.commit()
    
    cur.close()
    conn.close()
    
    return success_response({'message': 'News updated successfully'})

def delete_news(event: Dict[str, Any]) -> Dict[str, Any]:
    path = event.get('queryStringParameters', {}).get('path', '')
    path_parts = path.split('/')
    news_id = path_parts[1] if len(path_parts) > 1 else None
    
    if not news_id:
        return error_response('Missing news ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE t_p40088213_build_center_site.news SET is_active = false WHERE id = {}".format(news_id))
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'message': 'News deleted successfully'})

def get_promotions(event: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, title, description, discount, valid_until, is_active FROM t_p40088213_build_center_site.promotions WHERE is_active = true ORDER BY created_at DESC")
    promotions = cur.fetchall()
    cur.close()
    conn.close()
    
    return success_response({'promotions': [dict(p) for p in promotions]})

def create_promotion(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    title = body_data.get('title', '')
    description = body_data.get('description', '')
    discount = body_data.get('discount')
    valid_until = body_data.get('validUntil')
    
    if not all([title, description]):
        return error_response('Missing required fields', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO t_p40088213_build_center_site.promotions (title, description, discount, valid_until) VALUES ('{}', '{}', {}, {}) RETURNING id".format(
            title.replace("'", "''"),
            description.replace("'", "''"),
            discount if discount else 'NULL',
            "'{}'".format(valid_until) if valid_until else 'NULL'
        )
    )
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'message': 'Promotion created successfully'})

def update_promotion(event: Dict[str, Any]) -> Dict[str, Any]:
    path = event.get('queryStringParameters', {}).get('path', '')
    path_parts = path.split('/')
    promo_id = path_parts[1] if len(path_parts) > 1 else None
    
    if not promo_id:
        return error_response('Missing promotion ID', 400)
    
    body_data = json.loads(event.get('body', '{}'))
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    updates = []
    if 'title' in body_data:
        updates.append("title = '{}'".format(body_data['title'].replace("'", "''")))
    if 'description' in body_data:
        updates.append("description = '{}'".format(body_data['description'].replace("'", "''")))
    if 'discount' in body_data:
        updates.append("discount = {}".format(body_data['discount']))
    if 'validUntil' in body_data:
        updates.append("valid_until = '{}'".format(body_data['validUntil']))
    
    if updates:
        cur.execute("UPDATE t_p40088213_build_center_site.promotions SET {} WHERE id = {}".format(', '.join(updates), promo_id))
        conn.commit()
    
    cur.close()
    conn.close()
    
    return success_response({'message': 'Promotion updated successfully'})

def delete_promotion(event: Dict[str, Any]) -> Dict[str, Any]:
    path = event.get('queryStringParameters', {}).get('path', '')
    path_parts = path.split('/')
    promo_id = path_parts[1] if len(path_parts) > 1 else None
    
    if not promo_id:
        return error_response('Missing promotion ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE t_p40088213_build_center_site.promotions SET is_active = false WHERE id = {}".format(promo_id))
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'message': 'Promotion deleted successfully'})

def get_vacancies(event: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, title, description, salary, requirements, is_active FROM t_p40088213_build_center_site.vacancies WHERE is_active = true ORDER BY created_at DESC")
    vacancies = cur.fetchall()
    cur.close()
    conn.close()
    
    return success_response({'vacancies': [dict(v) for v in vacancies]})

def create_vacancy(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    title = body_data.get('title', '')
    description = body_data.get('description', '')
    salary = body_data.get('salary', '')
    requirements = body_data.get('requirements', '')
    
    if not all([title, description]):
        return error_response('Missing required fields', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO t_p40088213_build_center_site.vacancies (title, description, salary, requirements) VALUES ('{}', '{}', '{}', '{}') RETURNING id".format(
            title.replace("'", "''"),
            description.replace("'", "''"),
            salary.replace("'", "''"),
            requirements.replace("'", "''")
        )
    )
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'message': 'Vacancy created successfully'})

def update_vacancy(event: Dict[str, Any]) -> Dict[str, Any]:
    path = event.get('queryStringParameters', {}).get('path', '')
    path_parts = path.split('/')
    vacancy_id = path_parts[1] if len(path_parts) > 1 else None
    
    if not vacancy_id:
        return error_response('Missing vacancy ID', 400)
    
    body_data = json.loads(event.get('body', '{}'))
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    updates = []
    if 'title' in body_data:
        updates.append("title = '{}'".format(body_data['title'].replace("'", "''")))
    if 'description' in body_data:
        updates.append("description = '{}'".format(body_data['description'].replace("'", "''")))
    if 'salary' in body_data:
        updates.append("salary = '{}'".format(body_data['salary'].replace("'", "''")))
    if 'requirements' in body_data:
        updates.append("requirements = '{}'".format(body_data['requirements'].replace("'", "''")))
    
    if updates:
        cur.execute("UPDATE t_p40088213_build_center_site.vacancies SET {} WHERE id = {}".format(', '.join(updates), vacancy_id))
        conn.commit()
    
    cur.close()
    conn.close()
    
    return success_response({'message': 'Vacancy updated successfully'})

def delete_vacancy(event: Dict[str, Any]) -> Dict[str, Any]:
    path = event.get('queryStringParameters', {}).get('path', '')
    path_parts = path.split('/')
    vacancy_id = path_parts[1] if len(path_parts) > 1 else None
    
    if not vacancy_id:
        return error_response('Missing vacancy ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE t_p40088213_build_center_site.vacancies SET is_active = false WHERE id = {}".format(vacancy_id))
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'message': 'Vacancy deleted successfully'})

def get_consultations(event: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM t_p40088213_build_center_site.bathroom_consultations ORDER BY created_at DESC")
    consultations = cur.fetchall()
    cur.close()
    conn.close()
    
    return success_response({'consultations': [dict(c) for c in consultations]})

def delete_consultation(event: Dict[str, Any]) -> Dict[str, Any]:
    path = event.get('queryStringParameters', {}).get('path', '')
    path_parts = path.split('/')
    consultation_id = path_parts[1] if len(path_parts) > 1 else None
    
    if not consultation_id:
        return error_response('Missing consultation ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM t_p40088213_build_center_site.bathroom_consultations WHERE id = {}".format(consultation_id))
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'message': 'Consultation deleted successfully'})

def get_receipts(event: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM t_p40088213_build_center_site.receipt_registrations ORDER BY created_at DESC")
    receipts = cur.fetchall()
    cur.close()
    conn.close()
    
    return success_response({'receipts': [dict(r) for r in receipts]})

def delete_receipt(event: Dict[str, Any]) -> Dict[str, Any]:
    path = event.get('queryStringParameters', {}).get('path', '')
    path_parts = path.split('/')
    receipt_id = path_parts[1] if len(path_parts) > 1 else None
    
    if not receipt_id:
        return error_response('Missing receipt ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM t_p40088213_build_center_site.receipt_registrations WHERE id = {}".format(receipt_id))
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'message': 'Receipt deleted successfully'})