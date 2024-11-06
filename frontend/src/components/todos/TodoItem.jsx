import React, { useState } from 'react';
import todoService from '../../services/todoService';

const TodoItemComponent = ({ item, onDelete, onToggleCompletion }) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);
  const [newDescription, setNewDescription] = useState(item.description);

  const updateItem = async () => {
    try {
      await todoService.updateItem(item.id, newTitle, newDescription);
      setEditingTitle(false);
      setEditingDescription(false);
      onToggleCompletion(item.id, item.completed);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await todoService.deleteItem(item.id);
      onDelete(item.id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleCompletion = async () => {
    try {
      await todoService.toggleItemCompletion(item.id, !item.completed);
      onToggleCompletion(item.id, !item.completed);
    } catch (error) {
      console.error('Error toggling item completion:', error);
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={toggleCompletion}
      />
      {editingTitle ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={updateItem}
        />
      ) : (
        <span onDoubleClick={() => setEditingTitle(true)}>{item.title}</span>
      )}
      {editingDescription ? (
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          onBlur={updateItem}
        />
      ) : (
        <p onDoubleClick={() => setEditingDescription(true)}>
          {item.description}
        </p>
      )}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default TodoItemComponent;