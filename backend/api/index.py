import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

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
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        if path == 'bathroom-consultation' and method == 'POST':
            return create_bathroom_consultation(event)
        elif path == 'ceramic-registration' and method == 'POST':
            return create_ceramic_registration(event)
        elif path == 'receipt-registration' and method == 'POST':
            return create_receipt_registration(event)
        elif path == 'news' and method == 'GET':
            return get_news(event)
        elif path == 'news' and method == 'POST':
            return create_news(event)
        elif path == 'news' and method == 'PUT':
            return update_news(event)
        elif path == 'news' and method == 'DELETE':
            return delete_news(event)
        elif path == 'promotions' and method == 'GET':
            return get_promotions(event)
        elif path == 'promotions' and method == 'POST':
            return create_promotion(event)
        elif path == 'promotions' and method == 'PUT':
            return update_promotion(event)
        elif path == 'promotions' and method == 'DELETE':
            return delete_promotion(event)
        elif path == 'vacancies' and method == 'GET':
            return get_vacancies(event)
        elif path == 'vacancies' and method == 'POST':
            return create_vacancy(event)
        elif path == 'vacancies' and method == 'PUT':
            return update_vacancy(event)
        elif path == 'vacancies' and method == 'DELETE':
            return delete_vacancy(event)
        elif path == 'admin-login' and method == 'POST':
            return admin_login(event)
        else:
            return error_response('Not found', 404)
    except Exception as e:
        return error_response(str(e), 500)

def check_admin(event: Dict[str, Any]) -> bool:
    headers = event.get('headers', {})
    admin_token = headers.get('X-Admin-Token') or headers.get('x-admin-token')
    
    if not admin_token:
        return False
    
    try:
        parts = admin_token.split(':')
        if len(parts) != 2:
            return False
        username, password = parts
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT id FROM admins WHERE username = '{}' AND password_hash = '{}' AND is_active = true".format(
                username.replace("'", "''"), 
                password.replace("'", "''")
            )
        )
        result = cur.fetchone()
        cur.close()
        conn.close()
        return result is not None
    except:
        return False

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
        "INSERT INTO bathroom_consultations (name, phone, consultation_date, consultation_time) VALUES ('{}', '{}', '{}', '{}') RETURNING id".format(
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

def create_ceramic_registration(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    full_name = body_data.get('fullName', '')
    phone = body_data.get('phone', '')
    email = body_data.get('email', '')
    address = body_data.get('address', '')
    
    if not all([full_name, phone, email]):
        return error_response('Missing required fields', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO ceramic_registrations (full_name, phone, email, address) VALUES ('{}', '{}', '{}', '{}') RETURNING id".format(
            full_name.replace("'", "''"),
            phone.replace("'", "''"),
            email.replace("'", "''"),
            address.replace("'", "''")
        )
    )
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'message': 'Ceramic registration successful'})

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
        "INSERT INTO receipt_registrations (full_name, phone, receipt_number, purchase_date, amount) VALUES ('{}', '{}', '{}', '{}', {}) RETURNING id".format(
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
    cur.execute("SELECT id, title, content, published_date, is_active FROM news WHERE is_active = true ORDER BY published_date DESC")
    news = cur.fetchall()
    cur.close()
    conn.close()
    
    return success_response([dict(n) for n in news])

def create_news(event: Dict[str, Any]) -> Dict[str, Any]:
    if not check_admin(event):
        return error_response('Unauthorized', 401)
    
    body_data = json.loads(event.get('body', '{}'))
    title = body_data.get('title', '')
    content = body_data.get('content', '')
    published_date = body_data.get('publishedDate', datetime.now().strftime('%Y-%m-%d'))
    
    if not all([title, content]):
        return error_response('Missing required fields', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO news (title, content, published_date) VALUES ('{}', '{}', '{}') RETURNING id".format(
            title.replace("'", "''"),
            content.replace("'", "''"),
            published_date
        )
    )
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'message': 'News created successfully'})

def update_news(event: Dict[str, Any]) -> Dict[str, Any]:
    if not check_admin(event):
        return error_response('Unauthorized', 401)
    
    body_data = json.loads(event.get('body', '{}'))
    news_id = body_data.get('id')
    title = body_data.get('title')
    content = body_data.get('content')
    
    if not news_id:
        return error_response('Missing news ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    updates = []
    if title:
        updates.append("title = '{}'".format(title.replace("'", "''")))
    if content:
        updates.append("content = '{}'".format(content.replace("'", "''")))
    
    if updates:
        cur.execute("UPDATE news SET {} WHERE id = {}".format(', '.join(updates), news_id))
        conn.commit()
    
    cur.close()
    conn.close()
    
    return success_response({'message': 'News updated successfully'})

def delete_news(event: Dict[str, Any]) -> Dict[str, Any]:
    if not check_admin(event):
        return error_response('Unauthorized', 401)
    
    params = event.get('queryStringParameters', {})
    news_id = params.get('id')
    
    if not news_id:
        return error_response('Missing news ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE news SET is_active = false WHERE id = {}".format(news_id))
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'message': 'News deleted successfully'})

def get_promotions(event: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, title, description, discount_percentage, price_from, valid_until, badge_text, is_active FROM promotions WHERE is_active = true ORDER BY created_at DESC")
    promotions = cur.fetchall()
    cur.close()
    conn.close()
    
    return success_response([dict(p) for p in promotions])

def create_promotion(event: Dict[str, Any]) -> Dict[str, Any]:
    if not check_admin(event):
        return error_response('Unauthorized', 401)
    
    body_data = json.loads(event.get('body', '{}'))
    title = body_data.get('title', '')
    description = body_data.get('description', '')
    discount_percentage = body_data.get('discountPercentage')
    price_from = body_data.get('priceFrom')
    valid_until = body_data.get('validUntil')
    badge_text = body_data.get('badgeText', '')
    
    if not all([title, description]):
        return error_response('Missing required fields', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO promotions (title, description, discount_percentage, price_from, valid_until, badge_text) VALUES ('{}', '{}', {}, {}, {}, '{}') RETURNING id".format(
            title.replace("'", "''"),
            description.replace("'", "''"),
            discount_percentage if discount_percentage else 'NULL',
            price_from if price_from else 'NULL',
            "'{}'".format(valid_until) if valid_until else 'NULL',
            badge_text.replace("'", "''")
        )
    )
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'message': 'Promotion created successfully'})

def update_promotion(event: Dict[str, Any]) -> Dict[str, Any]:
    if not check_admin(event):
        return error_response('Unauthorized', 401)
    
    body_data = json.loads(event.get('body', '{}'))
    promo_id = body_data.get('id')
    
    if not promo_id:
        return error_response('Missing promotion ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    updates = []
    if 'title' in body_data:
        updates.append("title = '{}'".format(body_data['title'].replace("'", "''")))
    if 'description' in body_data:
        updates.append("description = '{}'".format(body_data['description'].replace("'", "''")))
    if 'discountPercentage' in body_data:
        updates.append("discount_percentage = {}".format(body_data['discountPercentage']))
    
    if updates:
        cur.execute("UPDATE promotions SET {} WHERE id = {}".format(', '.join(updates), promo_id))
        conn.commit()
    
    cur.close()
    conn.close()
    
    return success_response({'message': 'Promotion updated successfully'})

def delete_promotion(event: Dict[str, Any]) -> Dict[str, Any]:
    if not check_admin(event):
        return error_response('Unauthorized', 401)
    
    params = event.get('queryStringParameters', {})
    promo_id = params.get('id')
    
    if not promo_id:
        return error_response('Missing promotion ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE promotions SET is_active = false WHERE id = {}".format(promo_id))
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'message': 'Promotion deleted successfully'})

def get_vacancies(event: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, title, employment_type, salary_from, location, requirements, is_active FROM vacancies WHERE is_active = true ORDER BY created_at DESC")
    vacancies = cur.fetchall()
    cur.close()
    conn.close()
    
    return success_response([dict(v) for v in vacancies])

def create_vacancy(event: Dict[str, Any]) -> Dict[str, Any]:
    if not check_admin(event):
        return error_response('Unauthorized', 401)
    
    body_data = json.loads(event.get('body', '{}'))
    title = body_data.get('title', '')
    employment_type = body_data.get('employmentType', '')
    salary_from = body_data.get('salaryFrom')
    location = body_data.get('location', '')
    requirements = body_data.get('requirements', '')
    
    if not all([title, employment_type]):
        return error_response('Missing required fields', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO vacancies (title, employment_type, salary_from, location, requirements) VALUES ('{}', '{}', {}, '{}', '{}') RETURNING id".format(
            title.replace("'", "''"),
            employment_type.replace("'", "''"),
            salary_from if salary_from else 'NULL',
            location.replace("'", "''"),
            requirements.replace("'", "''")
        )
    )
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'message': 'Vacancy created successfully'})

def update_vacancy(event: Dict[str, Any]) -> Dict[str, Any]:
    if not check_admin(event):
        return error_response('Unauthorized', 401)
    
    body_data = json.loads(event.get('body', '{}'))
    vacancy_id = body_data.get('id')
    
    if not vacancy_id:
        return error_response('Missing vacancy ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    updates = []
    if 'title' in body_data:
        updates.append("title = '{}'".format(body_data['title'].replace("'", "''")))
    if 'employmentType' in body_data:
        updates.append("employment_type = '{}'".format(body_data['employmentType'].replace("'", "''")))
    if 'salaryFrom' in body_data:
        updates.append("salary_from = {}".format(body_data['salaryFrom']))
    
    if updates:
        cur.execute("UPDATE vacancies SET {} WHERE id = {}".format(', '.join(updates), vacancy_id))
        conn.commit()
    
    cur.close()
    conn.close()
    
    return success_response({'message': 'Vacancy updated successfully'})

def delete_vacancy(event: Dict[str, Any]) -> Dict[str, Any]:
    if not check_admin(event):
        return error_response('Unauthorized', 401)
    
    params = event.get('queryStringParameters', {})
    vacancy_id = params.get('id')
    
    if not vacancy_id:
        return error_response('Missing vacancy ID', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE vacancies SET is_active = false WHERE id = {}".format(vacancy_id))
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'message': 'Vacancy deleted successfully'})

def admin_login(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    username = body_data.get('username', '')
    password = body_data.get('password', '')
    
    if not all([username, password]):
        return error_response('Missing credentials', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, username, full_name FROM admins WHERE username = '{}' AND password_hash = '{}' AND is_active = true".format(
            username.replace("'", "''"),
            password.replace("'", "''")
        )
    )
    admin = cur.fetchone()
    cur.close()
    conn.close()
    
    if not admin:
        return error_response('Invalid credentials', 401)
    
    token = "{}:{}".format(username, password)
    return success_response({
        'token': token,
        'username': admin['username'],
        'fullName': admin['full_name']
    })

def success_response(data: Any) -> Dict[str, Any]:
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
