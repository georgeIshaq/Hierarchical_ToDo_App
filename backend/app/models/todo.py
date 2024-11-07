from datetime import datetime, timezone
from app import db
from .user import User


class TodoList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime,
                           default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime,
                           default=datetime.now(timezone.utc),
                           onupdate=datetime.now(timezone.utc))
    owner_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)

    items = db.relationship('TodoItem', backref='list', lazy='dynamic',
                            cascade='all, delete-orphan')

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
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime,
                           default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime,
                           default=datetime.now(timezone.utc),
                           onupdate=datetime.now(timezone.utc))
    list_id = db.Column(db.Integer, db.ForeignKey(TodoList.id), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('todo_item.id'),
                          nullable=True)

    children = db.relationship('TodoItem', backref=db.backref('parent', remote_side=[id]),
                               lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'parent_id': self.parent_id,
            'children': [child.to_dict() for child in self.children],
        }

    def update_completion(self, completed):
        self.completed = completed
        for child in self.children:
            child.update_completion(completed)
