import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import todoService from '../../services/todoService';

const TodoListPage = () => {
  const [list, setList] = useState(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const { listId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
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
    try {
      const newItem = await todoService.createItem(listId, newItemTitle);
      setList((prevList) => ({
        ...prevList,
        items: [...prevList.items, newItem],
      }));
      setNewItemTitle('');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await todoService.deleteItem(itemId);
      setList((prevList) => ({
        ...prevList,
        items: prevList.items.filter((i) => i.id !== itemId),
      }));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleItemCompletion = async (itemId, completed) => {
    try {
      await todoService.toggleItemCompletion(itemId, completed);
      setList((prevList) => ({
        ...prevList,
        items: prevList.items.map((i) =>
          i.id === itemId ? { ...i, completed } : i
        ),
      }));
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

  return (
    <div className="container mx-auto p-4">
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
        <button onClick={createItem} className="bg-blue-500 text-white p-2">
          Create Item
        </button>
      </div>
      <ul>
        {list.items.map((item) => (
          <li key={item.id} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItemCompletion(item.id, !item.completed)}
                className="mr-2"
              />
              <span>{item.title}</span>
            </div>
            <button onClick={() => deleteItem(item.id)} className="bg-red-500 text-white p-2">
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button onClick={navigateToList} className="bg-gray-500 text-white p-2 mt-4">
        Back to Lists
      </button>
    </div>
  );
};

export default TodoListPage;