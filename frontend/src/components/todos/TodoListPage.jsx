// frontend/src/components/todos/TodoListPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import todoService from '../../services/todoService';

const TodoListPage = () => {
  const [lists, setLists] = useState([]);
  const [list, setList] = useState({ items: [] });
  const [newItemTitle, setNewItemTitle] = useState('');
  const [expandedItems, setExpandedItems] = useState({}); // State to track expanded items
  const { listId } = useParams();
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
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId]);

  const fetchList = async () => {
    try {
      const data = await todoService.getList(listId);
      setList(data);

      // Initialize expandedItems state
      const initialExpanded = {};
      data.items.forEach((item) => {
        initialExpanded[item.id] = true; // Set to false to collapse by default
      });
      setExpandedItems(initialExpanded);
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  };

  const toggleExpand = (itemId) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
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

  const moveItem = async (itemId, newListId) => {
    try {
      await todoService.moveItem(itemId, newListId);
      fetchList(); // Refresh the current list
    } catch (error) {
      console.error('Error moving item:', error);
    }
  };

  const navigateToList = () => {
    navigate('/lists');
  };

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Recursive component to render items and their sub-items
  const RenderItems = ({ items }) => {
    return (
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="bg-white p-4 rounded-lg shadow flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                {item.children && item.children.length > 0 && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="mr-2 text-indigo-600 focus:outline-none"
                    title="Toggle Sub-Items"
                  >
                    {expandedItems[item.id] ? '▼' : '▶'}
                  </button>
                )}
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItemCompletion(item.id, !item.completed)}
                  className="mr-3 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className={`text-gray-800 ${item.completed ? 'line-through' : ''}`}>
                  {item.title}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => createSubItem(item.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-sm shadow"
                  title="Add Sub-Item"
                >
                  Add Sub
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm shadow"
                  title="Delete Item"
                >
                  Delete
                </button>
                {item.parent_id === null && (
                  <select
                    onChange={(e) => moveItem(item.id, e.target.value)}
                    defaultValue=""
                    className="ml-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="" disabled>
                      Move to...
                    </option>
                    {lists
                      .filter((lst) => lst.id !== parseInt(listId))
                      .map((lst) => (
                        <option key={lst.id} value={lst.id}>
                          {lst.title}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            </div>

            {/* Render sub-items recursively if expanded */}
            {expandedItems[item.id] && item.children && item.children.length > 0 && (
              <div className="ml-6 mt-2 border-l-2 border-gray-200 pl-4">
                <RenderItems items={item.children} />
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <button
          onClick={navigateToList}
          className="mb-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          &larr; Back to Lists
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{list.title}</h1>
        <p className="text-gray-600 mb-6">{list.description}</p>
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="New Task Title"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={createItem}
            className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
          >
            Add Task
          </button>
        </div>
        {list.items && list.items.length > 0 ? (
          <RenderItems items={list.items.filter((item) => !item.parent_id)} />
        ) : (
          <p className="text-gray-500">No tasks available. Add a new task to get started!</p>
        )}
      </div>
    </div>
  );
};

export default TodoListPage;