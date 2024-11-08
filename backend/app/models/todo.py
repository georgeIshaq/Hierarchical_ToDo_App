from datetime import datetime, timezone
from app import db
from .user import User


class TodoList(db.Model):
    # Primary key for the TodoList
    id = db.Column(db.Integer, primary_key=True)

    # Title of the TodoList, cannot be null
    title = db.Column(db.String(100), nullable=False)

    # Description of the TodoList, can be null
    description = db.Column(db.Text, nullable=True)

    # Timestamp when the list was created, defaults to current time in UTC
    created_at = db.Column(db.DateTime,
                           default=datetime.now(timezone.utc))

    # Timestamp when the list was last updated, defaults to current time in UTC and updates on change
    updated_at = db.Column(db.DateTime,
                           default=datetime.now(timezone.utc),
                           onupdate=datetime.now(timezone.utc))

    # Foreign key to associate the list with a User
    owner_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)

    # Relationship to define the items in the TodoList
    items = db.relationship('TodoItem', backref='list', lazy='dynamic',
                            cascade='all, delete-orphan')

    # Method to convert the TodoList object to a dictionary
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'items': [item.to_dict() for item in self.items],
        }


class TodoItem(db.Model):
    # Primary key for the TodoItem
    id = db.Column(db.Integer, primary_key=True)

    # Title of the TodoItem, cannot be null
    title = db.Column(db.String(100), nullable=False)

    # Description of the TodoItem, can be null
    description = db.Column(db.Text, nullable=True)

    # Boolean flag to indicate if the item is completed, defaults to False
    completed = db.Column(db.Boolean, default=False)

    # Timestamp when the item was created, defaults to current time in UTC
    created_at = db.Column(db.DateTime,
                           default=datetime.now(timezone.utc))

    # Timestamp when the item was last updated, defaults to current time in UTC and updates on change
    updated_at = db.Column(db.DateTime,
                           default=datetime.now(timezone.utc),
                           onupdate=datetime.now(timezone.utc))

    # Foreign key to associate the item with a TodoList
    list_id = db.Column(db.Integer, db.ForeignKey(TodoList.id), nullable=False)

    # Foreign key to associate the item with a parent TodoItem, can be null
    parent_id = db.Column(db.Integer, db.ForeignKey('todo_item.id'),
                          nullable=True)

    # Relationship to define the children of a TodoItem
    children = db.relationship('TodoItem', backref=db.backref('parent', remote_side=[id]))

    # Method to convert the TodoItem object to a dictionary
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'completed': self.completed,
            'list_id': self.list_id,
            'parent_id': self.parent_id,
            'children': [child.to_dict() for child in self.children],
        }
