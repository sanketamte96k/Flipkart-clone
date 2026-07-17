# Flipkart Clone

A fully responsive Flipkart Clone built using HTML, CSS, JavaScript (Frontend), and Flask (Backend).

## How to Run the Project

### Method 1: Easy Start (Windows)
Simply double-click the `run.bat` file in the project's root folder. This script will automatically:
1. Verify and install python dependencies in the virtual environment.
2. Open your default web browser to `http://127.0.0.1:5000/`.
3. Start the Flask backend server.

### Method 2: Manual Start (Command Line)
If you prefer running it manually from the terminal:

1. Open a terminal in the project directory:
   ```powershell
   cd c:/PROJECT/Flipkart-clone
   ```
2. Activate the virtual environment:
   - **On Windows:**
     ```powershell
     .\venv\Scripts\activate
     ```
   - **On macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask application:
   ```bash
   python backend/app.py
   ```
5. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000/
   ```

## Key Project Structure
- `backend/app.py`: Flask application that serves the frontend files and provides the `/products` API endpoint.
- `frontend/`: Contains all HTML, CSS, JavaScript, and image assets for the shopping interface.
