// frontend/src/components/todos/TodoListsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import todoService from '../../services/todoService';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TodoListsPage = () => {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({}); // Track expanded items

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
    if (!newListTitle.trim()) return;
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

  const toggleExpandItem = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside any list
    if (!destination) return;

    // Dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceListId = parseInt(source.droppableId);
    const destListId = parseInt(destination.droppableId);
    const itemId = parseInt(draggableId);

    try {
      await todoService.moveItem(itemId, destListId);
      fetchLists(); // Refresh lists to reflect changes
    } catch (error) {
      console.error('Error moving item:', error);
    }
  };

  // Recursive component to render items and their sub-items
  const RenderTasks = ({ items, listId, depth = 0 }) => {
    return (
      <ul className={`ml-${depth * 4} mt-2`}>
        {items.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems[item.id];

          return (
            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
              {(provided) => (
                <li
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="bg-gray-50 p-3 mb-3 rounded-lg shadow-sm flex items-center justify-between cursor-move"
                >
                  <div className="flex items-center">
                    {hasChildren && (
                      <button
                        onClick={() => toggleExpandItem(item.id)}
                        className="mr-2 text-gray-600 focus:outline-none"
                        title="Toggle Sub-Items"
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    )}
                    <span className={`text-gray-800 ${item.completed ? 'line-through' : ''}`}>
                      {item.title}
                    </span>
                  </div>
                  {/* Additional actions can be added here */}
                  {/* Render sub-items if expanded */}
                  {hasChildren && isExpanded && (
                    <div className="mt-1 ml-6">
                      <RenderTasks
                        items={items.filter((subItem) => subItem.parent_id === item.id)}
                        listId={listId}
                        depth={depth + 1}
                      />
                    </div>
                  )}
                </li>
              )}
            </Draggable>
          );
        })}
        {/* Removed provided.placeholder from here */}
      </ul>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Todo Lists</h1>
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="New List Title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={createList}
            className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
          >
            Create List
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {lists && lists.length > 0 ? (
              lists.map((list) => (
                <Droppable key={list.id} droppableId={list.id.toString()}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-white w-72 h-96 rounded-xl shadow-lg p-6 flex-shrink-0 flex flex-col"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3
                          className="text-xl font-semibold text-gray-700  flex-grow"
                        >
                          {list.title}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigateToList(list.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow"
                            title="Edit List"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteList(list.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow"
                            title="Delete List"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-500 mb-4 flex-grow">{list.description}</p>
                      <div className="flex-grow overflow-y-auto">
                        {list.items && list.items.length > 0 ? (
                          list.items
                            .filter((item) => item.parent_id === null) // Display only top-level items
                            .map((item, index) => {
                              const hasChildren = list.items.some((subItem) => subItem.parent_id === item.id);
                              const isExpanded = expandedItems[item.id];

                              return (
                                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="bg-gray-50 p-3 mb-3 rounded-lg shadow-sm flex items-center justify-between cursor-move"
                                    >
                                      <div className="flex items-center">
                                        {hasChildren && (
                                          <button
                                            onClick={() => toggleExpandItem(item.id)}
                                            className="mr-2 text-gray-600 focus:outline-none"
                                            title="Toggle Sub-Items"
                                          >
                                            {isExpanded ? '▼' : '▶'}
                                          </button>
                                        )}
                                        <span className={`text-gray-800 ${item.completed ? 'line-through' : ''}`}>
                                          {item.title}
                                        </span>
                                      </div>
                                      {/* Additional actions can be added here */}
                                      {/* Render sub-items if expanded */}
                                      {hasChildren && isExpanded && (
                                        <div className="mt-1 ml-6">
                                          <RenderTasks
                                            items={list.items.filter((subItem) => subItem.parent_id === item.id)}
                                            listId={list.id}
                                            depth={1}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })
                        ) : (
                          <p className="text-gray-400">No tasks available</p>
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-gray-500">No lists available. Create one!</p>
              </div>
            )}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

// Recursive component to render sub-items
const RenderTasks = ({ items, listId, depth }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpandItem = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <ul className={`ml-${depth * 4} mt-2`}>
      {items.map((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems[item.id];

        return (
          <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
            {(provided) => (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="bg-gray-100 p-2 mb-2 rounded-lg shadow-sm flex items-center justify-between cursor-move"
              >
                <div className="flex items-center">
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpandItem(item.id)}
                      className="mr-2 text-gray-600 focus:outline-none"
                      title="Toggle Sub-Items"
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  )}
                  <span className={`text-gray-700 ${item.completed ? 'line-through' : ''}`}>
                    {item.title}
                  </span>
                </div>
                {/* Render sub-items if expanded */}
                {hasChildren && isExpanded && (
                  <div className="mt-1 ml-6">
                    <RenderTasks
                      items={items.filter((subItem) => subItem.parent_id === item.id)}
                      listId={listId}
                      depth={depth + 1}
                    />
                  </div>
                )}
              </li>
            )}
          </Draggable>
        );
      })}
     
    </ul>
  );
};

export default TodoListsPage;