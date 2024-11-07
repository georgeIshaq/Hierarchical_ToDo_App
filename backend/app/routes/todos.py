from flask import Blueprint, jsonify, request, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.todo import TodoList, TodoItem
from app.models.user import User  
from app import db

todos_bp = Blueprint('todos', __name__)


@todos_bp.before_request
def before_request():
    if request.method != 'OPTIONS':
        jwt_required()(lambda: None)()
        g.user = User.query.get(get_jwt_identity())


@todos_bp.route('/lists', methods=['GET'])
@jwt_required()
def get_lists():
    lists = TodoList.query.filter_by(owner_id=g.user.id).all()
    return jsonify([list.to_dict() for list in lists])


@todos_bp.route('/lists', methods=['POST'])
@jwt_required()
def create_list():
    data = request.get_json()
    list = TodoList(title=data['title'], description=data.get('description', ''), owner_id=g.user.id)
    db.session.add(list)
    db.session.commit()
    return jsonify(list.to_dict()), 201


@todos_bp.route('/lists/<int:list_id>', methods=['GET'])
@jwt_required()
def get_list(list_id):
    list = TodoList.query.get_or_404(list_id)
    if list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    return jsonify(list.to_dict())


@todos_bp.route('/lists/<int:list_id>', methods=['PUT'])
@jwt_required()
def update_list(list_id):
    list = TodoList.query.get_or_404(list_id)
    if list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    data = request.get_json()
    list.title = data['title']
    list.description = data.get('description')
    db.session.commit()
    return jsonify(list.to_dict())


@todos_bp.route('/lists/<int:list_id>', methods=['DELETE'])
@jwt_required()
def delete_list(list_id):
    list = TodoList.query.get_or_404(list_id)
    if list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    db.session.delete(list)
    db.session.commit()
    return jsonify({'message': 'List deleted'}), 204


@todos_bp.route('/lists/<int:list_id>/items', methods=['GET'])
@jwt_required()
def get_list_items(list_id):
    list = TodoList.query.get_or_404(list_id)
    if list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    items = list.items.all()
    return jsonify([i.to_dict() for i in items])


@todos_bp.route('/lists/<int:list_id>/items', methods=['POST'])
@jwt_required()
def create_item(list_id):
    list = TodoList.query.get_or_404(list_id)
    if list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    data = request.get_json()
    item = TodoItem(title=data['title'], description=data.get('description'), list=list)
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

# backend/app/routes/todos.py

@todos_bp.route('/items/<int:item_id>/subitems', methods=['POST'])
@jwt_required()
def create_subitem(item_id):
    parent_item = TodoItem.query.get_or_404(item_id)
    if parent_item.list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    data = request.get_json()
    subitem = TodoItem(
        title=data['title'],
        description=data.get('description', ''),
        list_id=parent_item.list_id,
        parent_id=parent_item.id
    )
    db.session.add(subitem)
    db.session.commit()
    return jsonify(subitem.to_dict()), 201
