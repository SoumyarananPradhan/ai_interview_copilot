# 🚀 AI Interview Copilot

An intelligent, full-stack web application designed to simulate technical interviews. Powered by Google's Gemini AI, this platform dynamically generates role-specific interview questions, evaluates candidate answers, and provides rigorous, syntax-highlighted feedback in real-time.

Built with a sleek, dark-mode terminal aesthetic to provide an immersive developer experience.

## ✨ Features

* **Dynamic Question Generation:** Enter a target role and difficulty level, and the AI generates highly relevant technical, behavioral, or system design questions.
* **Real-time AI Evaluation:** Submit your answers and receive instant scoring (1-10) on Technical Accuracy and Communication.
* **Constructive Feedback:** Get detailed, markdown-formatted feedback including optimal code solutions and syntax highlighting.
* **Immersive UI:** Terminal-inspired interface with typewriter animation effects, glassmorphism components, and a custom Dracula syntax theme.
* **Secure Authentication:** Full JWT (JSON Web Token) based login and registration system.
* **Session Logging:** An isolated dashboard where users can review their past interview sequences and track their progress.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS (Styling & Animations)
* React Router DOM (Navigation)
* Axios (API Communication)
* React Markdown & React Syntax Highlighter

**Backend:**
* Python / Django
* Django REST Framework (DRF)
* SimpleJWT (Authentication)
* SQLite (Development Database)

**AI Integration:**
* Google Gemini 2.5 Flash API 

## ⚙️ Local Setup Instructions

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/SoumyarananPradhan/ai_interview_copilot.git](https://github.com/SoumyarananPradhan/ai_interview_copilot.git)
cd ai-interview-copilot
2. Backend Setup (Django)
Open a terminal in the root directory and navigate to the backend folder (if applicable), or stay in the root depending on your structure.

Bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install Python dependencies
pip install django djangorestframework djangorestframework-simplejwt google-genai python-dotenv django-cors-headers

# Apply database migrations
python manage.py migrate

# Run the backend server
python manage.py runserver
3. Environment Variables
Create a .env file in the same directory as your Django settings.py (or where your AI utils script is) and add your Gemini API Key:

Code snippet
GEMINI_API_KEY=your_google_gemini_api_key_here
4. Frontend Setup (React)
Open a new terminal window and navigate to the frontend folder.

Bash
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
5. Access the Application
Open your browser and navigate to http://localhost:5173. Create a new account or log in to begin an interview sequence.

👨‍💻 Author
Soumyaranjan Pradhan

Full-Stack Developer
