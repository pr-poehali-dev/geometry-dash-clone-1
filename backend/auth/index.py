'''
Business: User authentication - register, login, get profile
Args: event with httpMethod, body containing username/email/password
Returns: HTTP response with user data or auth token
'''

import json
import os
import hashlib
import secrets
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                username = body.get('username')
                email = body.get('email')
                password = body.get('password')
                
                if not all([username, email, password]):
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Missing required fields'})
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id, username, email, total_stars, created_at",
                    (username, email, password_hash)
                )
                user = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'user': dict(user),
                        'message': 'Registration successful'
                    }, default=str)
                }
            
            elif action == 'login':
                username = body.get('username')
                password = body.get('password')
                
                if not all([username, password]):
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Missing username or password'})
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    "SELECT id, username, email, total_stars, created_at FROM users WHERE username = %s AND password_hash = %s",
                    (username, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Invalid credentials'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'user': dict(user),
                        'message': 'Login successful'
                    }, default=str)
                }
        
        elif method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('userId')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Missing userId'})
                }
            
            cur.execute(
                "SELECT id, username, email, total_stars, created_at FROM users WHERE id = %s",
                (int(user_id),)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'User not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'user': dict(user)}, default=str)
            }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
