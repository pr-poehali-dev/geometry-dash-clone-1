'''
Business: Manage level records and leaderboards
Args: event with httpMethod, body containing user_id, level_id, progress data
Returns: HTTP response with records or leaderboard data
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

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
            user_id = body.get('user_id')
            level_id = body.get('level_id')
            progress = body.get('progress', 0)
            completed = body.get('completed', False)
            stars_earned = body.get('stars_earned', 0)
            
            if not all([user_id, level_id is not None]):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            cur.execute(
                """
                INSERT INTO level_records (user_id, level_id, attempts, best_progress, completed, stars_earned, completed_at)
                VALUES (%s, %s, 1, %s, %s, %s, CASE WHEN %s THEN CURRENT_TIMESTAMP ELSE NULL END)
                ON CONFLICT (user_id, level_id) 
                DO UPDATE SET 
                    attempts = level_records.attempts + 1,
                    best_progress = GREATEST(level_records.best_progress, %s),
                    completed = CASE WHEN %s THEN TRUE ELSE level_records.completed END,
                    stars_earned = CASE WHEN %s THEN %s ELSE level_records.stars_earned END,
                    completed_at = CASE WHEN %s AND level_records.completed_at IS NULL THEN CURRENT_TIMESTAMP ELSE level_records.completed_at END
                RETURNING *
                """,
                (user_id, level_id, progress, completed, stars_earned, completed, progress, completed, completed, stars_earned, completed)
            )
            record = cur.fetchone()
            
            if completed:
                cur.execute(
                    "UPDATE users SET total_stars = (SELECT COALESCE(SUM(stars_earned), 0) FROM level_records WHERE user_id = %s AND completed = TRUE) WHERE id = %s",
                    (user_id, user_id)
                )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'record': dict(record)}, default=str)
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {})
            action = params.get('action', 'user_records')
            
            if action == 'user_records':
                user_id = params.get('userId')
                if not user_id:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Missing userId'})
                    }
                
                cur.execute(
                    "SELECT * FROM level_records WHERE user_id = %s ORDER BY level_id",
                    (int(user_id),)
                )
                records = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'records': [dict(r) for r in records]}, default=str)
                }
            
            elif action == 'leaderboard':
                level_id = params.get('levelId')
                
                if level_id:
                    cur.execute(
                        """
                        SELECT u.username, lr.attempts, lr.best_progress, lr.completed, lr.stars_earned, lr.completed_at
                        FROM level_records lr
                        JOIN users u ON lr.user_id = u.id
                        WHERE lr.level_id = %s AND lr.completed = TRUE
                        ORDER BY lr.completed_at ASC
                        LIMIT 100
                        """,
                        (int(level_id),)
                    )
                else:
                    cur.execute(
                        """
                        SELECT u.username, u.total_stars, COUNT(lr.id) as levels_completed
                        FROM users u
                        LEFT JOIN level_records lr ON u.id = lr.user_id AND lr.completed = TRUE
                        GROUP BY u.id, u.username, u.total_stars
                        ORDER BY u.total_stars DESC, levels_completed DESC
                        LIMIT 100
                        """,
                        ()
                    )
                
                leaderboard = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'leaderboard': [dict(l) for l in leaderboard]}, default=str)
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
