# foxar

## 引用原官方README.md，原项目地址[Github](https://github.com/shunianssy/foxar)，使用AGPLv3，本文传播受到许可，以[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.txt?spm=a2ty_o01.29997173.0.0.1cf75171UsJI0E&file=legalcode.txt)传播

A 100% Flask-compatible library built on top of FastAPI, providing the best of both worlds: Flask's simplicity and FastAPI's performance.

## Features

一个兼容Flask语法的FastAPI高性能库，结合了Flask的简洁语法和FastAPI的高性能特性。

## 特性

- **Flask兼容语法**：支持Flask的路由装饰器、蓝图系统和应用结构
- **FastAPI高性能**：底层使用FastAPI，支持异步处理和类型提示
- **自动API文档**：集成Swagger UI和ReDoc，自动生成API文档
- **类型安全**：支持Pydantic模型和类型提示
- **易于迁移**：允许现有Flask应用轻松迁移到高性能的FastAPI

## 安装

```bash
pip install foxar
```

## 基本使用

```python
from foxar import Foxar, jsonify

app = Foxar(__name__)

@app.route('/')
def index():
    return 'Hello, foxar!'

@app.route('/user/<int:user_id>')
def get_user(user_id):
    return {'user_id': user_id, 'message': f'Hello user {user_id}'}

@app.route('/login', methods=['GET', 'POST'])
def login():
    return jsonify({'status': 'success', 'message': 'Login successful'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## 蓝图使用

```python
from foxar import Foxar, Blueprint

app = Foxar(__name__)

# 创建蓝图
api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/items')
def get_items():
    return {'items': ['item1', 'item2', 'item3']}

@api_bp.route('/items/<item_id>')
def get_item(item_id):
    return {'item_id': item_id, 'name': f'Item {item_id}'}

# 注册蓝图
app.register_blueprint(api_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## 运行应用

### 使用内置run方法

```python
app.run(debug=True, port=5000)
```

### 使用uvicorn

```bash
uvicorn your_app:app --reload --port 5000
```

## 访问API文档

运行应用后，可以通过以下地址访问：

- Swagger UI: `http://localhost:5000/docs`
- ReDoc: `http://localhost:5000/redoc`

## 主要组件

1. **Foxar**：主应用类，继承自FastAPI，兼容Flask的初始化和路由语法
2. **Blueprint**：蓝图类，封装了FastAPI的APIRouter
3. **request**：请求对象，兼容Flask的request接口
4. **Response**：响应类，兼容Flask的Response接口
5. **jsonify**：JSON响应工具函数
6. **redirect**：重定向工具函数
7. **Config**：配置类，兼容Flask的Config接口
8. **url_for**：URL生成工具函数

## 项目文件

- 文档：请参考项目文档
- 贡献指南：欢迎提交PR
- 许可证：AGPLv3 License

## 注意事项

- 虽然兼容Flask的基本语法，但某些Flask特有功能可能需要额外实现
- 支持异步和同步路由处理函数
- 保持了FastAPI的所有高性能特性和类型提示
- 自动生成OpenAPI文档，提供交互式API测试界面

## 性能优势

- **异步支持**：底层使用FastAPI和Starlette，支持异步处理
- **类型提示**：利用Python类型提示提高代码质量
- **自动验证**：基于Pydantic的请求数据验证
- **高性能**：比传统WSGI框架（如Flask）具有更高的并发处理能力

foxar为开发者提供了一种既熟悉又高效的Web框架选择，让你可以使用Flask的简洁语法，同时享受FastAPI的高性能特性。