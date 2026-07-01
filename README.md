# Attendly - Event Management System

This repository contains a full-stack web application designed for event management, featuring distinct backend and frontend components. The system allows for the creation, management, and registration of events, supporting different user roles such as students and organizers.

## Features

*   **User Authentication & Authorization**: Secure user login and registration with distinct roles (Student, Organizer).
*   **Event Management**: Organizers can create, update, and manage events, including details like title, description, time, location, capacity, and status.
*   **Event Registration**: Students can register for events, with support for confirmed, waitlisted, and cancelled statuses.
*   **API-driven Backend**: A robust RESTful API serves data to the frontend.
*   **Responsive Frontend**: A modern, interactive user interface built with React.

## Technologies Used

### Backend

The backend is built using **Django** and **Django REST Framework**, providing a powerful and scalable API. It connects to a hosted **MySQL** database.

*   **Framework**: Django (6.0.6+)
*   **API**: Django REST Framework
*   **Database**: MySQL (hosted, pre-configured in `settings.py`)
*   **API Documentation**: `drf-spectacular`
*   **CORS Handling**: `django-cors-headers`
*   **Static Files**: `whitenoise`
*   **Web Server**: `gunicorn`
*   **Admin Interface**: `django-admin-interface`

### Frontend

The frontend is a single-page application developed with **React** and bundled with **Vite**.

*   **Framework**: React (18.0.0+)
*   **Build Tool**: Vite (3.0.0+)
*   **Routing**: React Router DOM (6.30.4+)
*   **Code Quality**: ESLint

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   Python 3.8+
*   Node.js (LTS version recommended)
*   npm or Yarn

### Backend Setup

The backend is pre-configured to connect to a hosted database, so no additional database setup or environment variables are required for basic local execution.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ivanparvanov1208/prometheus-aibest.git
    cd prometheus-aibest/backend
    ```

2.  **Create and activate a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Python dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Start the Django development server**:
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://127.0.0.1:8000/`.

### Frontend Setup

The frontend requires a `.env` file to specify the backend API endpoint.

1.  **Navigate to the frontend directory**:
    ```bash
    cd ../frontend
    ```

2.  **Install Node.js dependencies**:
    ```bash
    npm install # or yarn install
    ```

3.  **Configure environment variables**:
    Create a `.env` file in the `frontend` directory with the following content:
    ```env
    VITE_API_URL=http://127.0.0.1:8000/api
    ```

4.  **Start the Vite development server**:
    ```bash
    npm run dev # or yarn dev
    ```
    The frontend application will typically open in your browser at `http://localhost:5173/`.

## Usage

Once both the backend and frontend servers are running:

*   Access the frontend application in your web browser.
*   Register as a new user or log in with an existing account.
*   Explore event listings, create new events (as an organizer), and register for events (as a student).
*   The Django Admin panel (accessible via `/admin` on the backend URL) can be used for direct database management.
