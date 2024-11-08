from flask import Blueprint, jsonify, request, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.todo import TodoList, TodoItem
from app.models.user import User
from app import db
from flask_cors import cross_origin

# Create a Blueprint for the todos routes
todos_bp = Blueprint('todos', __name__)


# Before each request, ensure the user is authenticated
@todos_bp.before_request
def before_request():
    if request.method != 'OPTIONS':
        jwt_required()(lambda: None)()
        g.user = User.query.get(get_jwt_identity())


# Route to get all todo lists for the authenticated user
@todos_bp.route('/lists', methods=['GET'])
@jwt_required()
def get_lists():
    lists = TodoList.query.filter_by(owner_id=g.user.id).all()
    return jsonify([list.to_dict() for list in lists])


# Route to create a new todo list for the authenticated user
@todos_bp.route('/lists', methods=['POST'])
@jwt_required()
def create_list():
    data = request.get_json()
    list = TodoList(title=data['title'], description=data.get('description', ''), owner_id=g.user.id)
    db.session.add(list)
    db.session.commit()
    return jsonify(list.to_dict()), 201


# Route to get a specific todo list by ID
@todos_bp.route('/lists/<int:list_id>', methods=['GET'])
@jwt_required()
def get_list(list_id):
    list = TodoList.query.get_or_404(list_id)
    if list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    return jsonify(list.to_dict())


# Route to update a specific todo list by ID
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


# Route to delete a specific todo list by ID
@todos_bp.route('/lists/<int:list_id>', methods=['DELETE'])
@jwt_required()
def delete_list(list_id):
    list = TodoList.query.get_or_404(list_id)
    if list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    db.session.delete(list)
    db.session.commit()
    return jsonify({'message': 'List deleted'}), 204


# Route to update a specific todo item by ID
@todos_bp.route('/items/<int:item_id>', methods=['PATCH'])
@jwt_required()
def update_item(item_id):
    item = TodoItem.query.get_or_404(item_id)
    if item.list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    data = request.get_json()

    # Update the completed status and cascade to children
    if 'completed' in data:
        item.update_completion(data['completed'])
    # You can also update other fields if needed
    if 'title' in data:
        item.title = data['title']
    if 'description' in data:
        item.description = data['description']

    db.session.commit()
    return jsonify(item.to_dict()), 200


# Route to delete a specific todo item by ID
@todos_bp.route('/items/<int:item_id>', methods=['DELETE', 'OPTIONS'])
@jwt_required()
@cross_origin()
def delete_item(item_id):
    item = TodoItem.query.get_or_404(item_id)
    if item.list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted'}), 204


# Route to get all items in a specific todo list by list ID
@todos_bp.route('/lists/<int:list_id>/items', methods=['GET'])
@jwt_required()
def get_list_items(list_id):
    list = TodoList.query.get_or_404(list_id)
    if list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403
    items = list.items.all()
    return jsonify([i.to_dict() for i in items])


# Route to create a new item in a specific todo list by list ID
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


# Route to create a subitem under a specific item by item ID
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


# Route to move a specific item to a different list by item ID
@todos_bp.route('/items/<int:item_id>/move', methods=['POST'])
@jwt_required()
def move_item(item_id):
    item = TodoItem.query.get_or_404(item_id)
    if item.list.owner_id != g.user.id:
        return jsonify({'error': 'Unauthorized access'}), 403

    data = request.get_json()
    new_list_id = data.get('list_id')
    if not new_list_id:
        return jsonify({'error': 'New list ID is required'}), 400

    new_list = TodoList.query.get(new_list_id)
    if not new_list or new_list.owner_id != g.user.id:
        return jsonify({'error': 'Invalid list ID or unauthorized access'}), 403

    # Ensure the item is a top-level task
    if item.parent_id is not None:
        return jsonify({'error': 'Only top-level tasks can be moved'}), 400

    # Update the item's list_id
    item.list_id = new_list_id

    db.session.commit()
    return jsonify({'message': 'Item moved successfully'}), 200
