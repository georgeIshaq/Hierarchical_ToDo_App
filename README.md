# Hierarchical Todo List App

A hierarchical todo list application built with Flask for the backend and React for the frontend. This project allows users to create, manage, and organize their tasks in a structured manner, supporting nested sub-items and drag-and-drop functionality for intuitive task management.

## Features

- **Hierarchical Task Management**: Create tasks with nested sub-tasks to organize your workflow effectively.
- **CRUD Operations**: Add, edit, delete, and update both todo lists and individual todo items.
- **Drag and Drop**: Easily move tasks between different lists using drag-and-drop functionality powered by `react-beautiful-dnd`.
- **Responsive Design**: Clean and responsive UI built with React and Tailwind CSS.
- **User Authentication**: Secure user authentication and authorization using JWT tokens.
- **Real-time Updates**: Instantaneous updates and state management with React hooks and context.
- **Infinite Task Nesting**: Tasks can be nested as much as desired. Warning beyond 5 layers of nesting neatly displaying the tasks becomes very difficult.

## Technologies Used

- **Frontend**:
  - [React](https://reactjs.org/) - JavaScript library for building user interfaces.
  - [Vite](https://vitejs.dev/) - Fast frontend build tool.
  - [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) - Drag-and-drop library for React.
  - [Axios](https://axios-http.com/) - Promise-based HTTP client for API requests.
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.

- **Backend**:
  - [Flask](https://flask.palletsprojects.com/) - Lightweight WSGI web application framework.
  - [SQLAlchemy](https://www.sqlalchemy.org/) - ORM for database interactions.
  - [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/) - JWT authentication for Flask.
  - [Flask-CORS](https://flask-cors.readthedocs.io/) - Handling Cross-Origin Resource Sharing (CORS).

**important note**: In the project backend you may find currently unused routes. This is because when I first set up the backend I thought I had enough time to implement some of the extra features with those routes but I ran out of time by the assignment submission deadline.

## [Video](https://www.loom.com/share/b28455a97ed54b15bceeb085d548f88c?sid=6824e7f8-2d0c-4c70-a955-9858c5b7ab50)

## Project Structure

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [Python](https://www.python.org/) installed on your machine.
- [Git](https://git-scm.com/) installed.

### Backend Setup

1. **Clone the Repository (Not Necessary if you have files locally)**

   ```bash
   git clone https://github.com/georgeIshaq/Hierarchical_ToDo_App.git
   cd backend

2. **Create a Virtual Environment**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate

3. **Install Dependencies**
    ```bash
    pip install -r requirements.txt

4. **Set Environment Variables in .env**
    ```bash
    FLASK_APP=app.py
    FLASK_ENV=development
    DATABASE_URL=sqlite:///db.sqlite3

5. **Start the Backend Server**
    ```bash
    python run.py

6. **Navigate to Frontend Directory**
    ```bash
    new terminal
    cd frontend
    
7. **Install Dependencies**
    ```bash
    npm install

8. **Start the Frontend Development Server**
    ```bash
    npm run dev OR npm start

## Some Ideas For Future Steps

1. Addition of task descriptions
2. Switching to a cleaner modal style
3. Arbitrary subtask transfer through dnd
4. User Collaboration
5. Advanced Task Management (priorities, labels, etc.)
6. Performance Optimization
