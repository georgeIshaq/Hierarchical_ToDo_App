import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import todoService from '../../services/todoService';

const TodoListsPage = () => {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const data = await todoService.getLists();
      setLists(data);
    } catch (error) {
      console.error('Error fetching lists:', error);
      setLists([]); // Ensure lists is set to an empty array on error
    }
  };

  const createList = async () => {
    try {
      const newList = await todoService.createList(newListTitle);
      setLists((prevLists) => [...prevLists, newList]);
      setNewListTitle('');
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const deleteList = async (listId) => {
    try {
      await todoService.deleteList(listId);
      setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const navigateToList = (listId) => {
    navigate(`/lists/${listId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo Lists</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="New List Title"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={createList} className="bg-blue-500 text-white p-2">
          Create List
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-4">
        {lists && lists.length > 0 ? (
          lists.map((list) => (
            <div key={list.id} className="bg-white shadow-md rounded-lg p-4 w-64 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold" onClick={() => navigateToList(list.id)}>{list.title}</h3>
                <button onClick={() => deleteList(list.id)} className="bg-red-500 text-white p-2 rounded">
                  Delete
                </button>
              </div>
              <p className="mb-4">{list.description}</p>
              <ul>
                {list.items && list.items.length > 0 ? (
                  list.items.map((item) => (
                    <li key={item.id} className="border p-2 mb-2 rounded">
                      {item.title}
                    </li>
                  ))
                ) : (
                  <p>No items available</p>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No lists available</p>
        )}
      </div>
    </div>
  );
};

export default TodoListsPage;