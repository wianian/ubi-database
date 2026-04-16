from flask import Flask, jsonify
import pymysql
from flask_cors import CORS
from flask import Flask, jsonify, request

app = Flask(__name__)
CORS(app)  # 允许跨域请求

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='',
        port=715,  # 注意：MySQL默认端口是3306，0715会报错
        database='ubi_database',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/api/test-db', methods=['GET'])
def test_db_connection():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
        return jsonify({'status': 'success', 'result': result})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500
    finally:
        connection.close()
        
@app.route('/api/brain', methods=['GET'])
def get_brain_data():
    connection = None  # 初始化为None
    try:
        # 获取分页参数
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        offset = (page - 1) * per_page
        
        connection = get_db_connection()  # 尝试建立连接
        with connection.cursor() as cursor:
            sql = """
            SELECT 
                `EG.PrecursorId`,
                `Brain_NC1`, `Brain_NC2`, `Brain_NC3`,
                `Brain_9d1`, `Brain_9d2`, `Brain_9d3`,
                `Brain_28d1`, `Brain_28d2`, `Brain_28d3`
            FROM brain 
            LIMIT %s OFFSET %s
            """
            cursor.execute(sql, (per_page, offset))
            result = cursor.fetchall()
            
            # 获取总记录数
            count_sql = "SELECT COUNT(*) as total FROM brain"
            cursor.execute(count_sql)
            total = cursor.fetchone()['total']
            
        return jsonify({
            'data': result,
            'total': total,
            'page': page,
            'per_page': per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection:  # 只有在连接成功建立后才关闭
            connection.close()
if __name__ == '__main__':
    app.run(debug=True, port=5000)