// frontend/src/components/todos/TodoListPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import todoService from '../../services/todoService';

const TodoListPage = () => {
  const [list, setList] = useState({ items: [] });
  const [newItemTitle, setNewItemTitle] = useState('');
  const { listId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId]);

  const fetchList = async () => {
    try {
      const data = await todoService.getList(listId);
      setList(data);
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  };

  const createItem = async () => {
    if (!newItemTitle.trim()) return;
    try {
      const newItem = await todoService.createItem(listId, newItemTitle);
      setList((prevList) => ({
        ...prevList,
        items: [...(prevList.items || []), newItem],
      }));
      setNewItemTitle('');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const createSubItem = async (parentId) => {
    const title = prompt('Enter sub-item title:');
    if (title && title.trim()) {
      try {
        await todoService.createSubItem(parentId, title.trim());
        fetchList();
      } catch (error) {
        console.error('Error creating sub-item:', error);
      }
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await todoService.deleteItem(itemId);
      fetchList();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleItemCompletion = async (itemId, completed) => {
    try {
      await todoService.toggleItemCompletion(itemId, completed);
      fetchList();
    } catch (error) {
      console.error('Error toggling item completion:', error);
    }
  };

  const navigateToList = () => {
    navigate('/lists');
  };

  if (!list) {
    return <div>Loading...</div>;
  }

  // Recursive component to render items and their sub-items
  const RenderItems = ({ items }) => {
    return (
      <ul>
        {items.map((item) => (
          <li key={item.id} className="border p-2 mb-2">
            <div className="flex justify-between items-center">
              <div>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItemCompletion(item.id, !item.completed)}
                  className="mr-2"
                />
                <span>{item.title}</span>
              </div>
              <div>
                <button
                  onClick={() => createSubItem(item.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-1 ml-2 rounded"
                >
                  Add Sub-Item
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-1 ml-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            {/* Render sub-items recursively */}
            {item.children && item.children.length > 0 && (
              <div className="ml-6 mt-2">
                <RenderItems items={item.children} />
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={navigateToList}
        className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded mb-4"
      >
        Back to Lists
      </button>
      <h1 className="text-2xl font-bold mb-4">{list.title}</h1>
      <p className="mb-4">{list.description}</p>
      <div className="mb-4">
        <input
          type="text"
          placeholder="New Item Title"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={createItem}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          Create Item
        </button>
      </div>
      {list.items && list.items.length > 0 ? (
        <RenderItems items={list.items} />
      ) : (
        <p>No items available</p>
      )}
    </div>
  );
};

export default TodoListPage;