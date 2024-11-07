import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:5000/api';

const todoService = {
  // Fetch all todo lists
  async getLists() {
    const response = await axios.get(`${API_URL}/todos/lists`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Fetch a single todo list by ID
  async getList(listId) {
    const response = await axios.get(`${API_URL}/todos/lists/${listId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Create a new todo list
  async createList(title, description = '') {
    const response = await axios.post(
      `${API_URL}/todos/lists`,
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Delete a todo list by ID
  async deleteList(listId) {
    await axios.delete(`${API_URL}/todos/lists/${listId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  // Fetch all items in a todo list
  async getListItems(listId) {
    const response = await axios.get(`${API_URL}/todos/lists/${listId}/items`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Create a new item in a todo list
  async createItem(listId, title, description = '') {
    const response = await axios.post(
      `${API_URL}/todos/lists/${listId}/items`,
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Update an item in a todo list
  async updateItem(itemId, title, description) {
    const response = await axios.put(
      `${API_URL}/todos/items/${itemId}`,
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Delete an item from a todo list
  async deleteItem(itemId) {
    await axios.delete(`${API_URL}/todos/items/${itemId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  // Toggle the completion status of an item
  async toggleItemCompletion(itemId, completed) {
    const response = await axios.patch(
      `${API_URL}/todos/items/${itemId}`,
      { completed },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Create a new sub-item
  async createSubItem(parentItemId, title, description = '') {
      const response = await axios.post(
      `${API_URL}/todos/items/${parentItemId}/subitems`,
      { title, description },
      {
          headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
      }
      );
      return response.data;
  },
  // Move an item to a different list
  async moveItem(itemId, newListId) {
    await axios.post(
      `${API_URL}/todos/items/${itemId}/move`,
      { list_id: newListId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  },
};



export default todoService;