# MoodLogger

## 📋 Table of Contents
- [Problem Statement](#problem-statement)
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Frontend](#frontend)
- [Backend](#backend)
- [How to Run](#how-to-run)
- [Deployment & CI/CD](#deployment--cicd)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)

---

## 🎯 Problem Statement

In today's fast-paced world, people often struggle to keep track of their emotional well-being and mental health patterns. There's no simple, accessible way to quickly log and monitor daily moods without complex interfaces or time-consuming data entry processes. 

**MoodLogger** solves this problem by providing a lightweight, real-time mood tracking application that allows users to:
- Quickly log their current emotional state with minimal friction
- View a timestamped history of their mood entries
- Access their mood logs instantly from any device
- Maintain a simple record for personal reflection and emotional awareness

---

## 📱 Project Overview

**MoodLogger** is a full-stack web application designed to help users track and monitor their daily moods and emotional states. It's built as a client-server architecture with a modern, responsive frontend and a robust backend API.

### Key Features
- **Real-time Mood Logging**: Users can log their moods instantly with timestamps
- **Live History**: View all logged moods in chronological order
- **Simple Interface**: Clean, minimal design for frictionless user experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Cross-origin Support**: Frontend and backend can be served from different origins

---

## 🏗️ Architecture

MoodLogger follows a classic **three-tier architecture**:

1. **Frontend Tier**: Static web application served by Nginx
2. **Backend Tier**: Express.js REST API server
3. **Data Tier**: In-memory data storage (can be extended to persistent databases)

The frontend communicates with the backend through HTTP requests, enabling separation of concerns and scalability. The application is containerized using Docker, allowing for consistent deployment across environments.

### Communication Flow
- Frontend sends mood entries to the backend via POST requests
- Frontend retrieves all moods from the backend via GET requests
- Timestamps are generated server-side for consistency
- CORS (Cross-Origin Resource Sharing) is enabled to allow cross-origin requests

---

## 🎨 Frontend

### Purpose
The frontend is a single-page application that provides the user interface for the MoodLogger application. It handles all user interactions and communicates with the backend API.

### Key Characteristics
- **Static HTML Application**: Built as a single HTML file with embedded CSS and JavaScript
- **Responsive Design**: Uses modern CSS with flexbox and media-friendly styling
- **Real-time Updates**: Automatically refreshes mood list after each entry
- **Clean UI**: Minimalist design with intuitive interaction patterns

### User Interface Components
- **Mood Input Field**: Text input where users describe their current mood or emotional state
- **Submit Button**: Triggers the mood logging process
- **Mood Display List**: Shows all logged moods with their corresponding timestamps

### API Integration
- Connects to the backend running on `http://localhost:5000`
- Fetches all moods on page load
- Submits new moods with real-time validation
- Automatically refreshes the mood list after successful submission

### Deployment
- Served by Nginx web server for production-grade performance
- Runs on port 80 (HTTP)
- Containerized in Docker for consistent deployment

---

## ⚙️ Backend

### Purpose
The backend is a RESTful API server that manages mood data and handles all business logic. It provides endpoints for saving and retrieving mood entries.

### Key Characteristics
- **Express.js Framework**: Lightweight and flexible Node.js web framework
- **REST API**: Provides standard HTTP endpoints for CRUD operations
- **CORS Enabled**: Allows requests from different origins (frontend and other clients)
- **JSON Communication**: Uses JSON format for request/response bodies
- **In-Memory Storage**: Stores moods in memory (suitable for development; use database for production)

### API Endpoints

**GET `/moods`**
- Purpose: Retrieve all logged moods
- Returns: Array of mood objects with mood text and ISO-formatted timestamp
- Status Code: 200 OK

**POST `/mood`**
- Purpose: Save a new mood entry
- Request Body: JSON object containing mood text
- Response: Confirmation message with success status
- Status Code: 200 OK (success) or 400 Bad Request (validation error)
- Validation: Mood text is required; request will be rejected if empty

### Server Details
- Runs on port 5000
- Listens on all network interfaces
- Logs startup confirmation to console
- Automatically timestamps all mood entries on the server

### Data Structure
- Each mood entry contains:
  - The mood text provided by the user
  - ISO-formatted timestamp of when the mood was logged
  - Stored in an array for sequential access

---

## 🚀 How to Run

### Prerequisites
Before running the application, ensure you have:
- **Node.js** (v14 or higher) installed on your system
- **npm** (Node Package Manager) installed
- **Docker** and **Docker Compose** installed (for containerized deployment)

### Option 1: Local Development (Without Docker)

**Backend Setup**
1. Navigate to the backend directory
2. Install Node.js dependencies using npm
3. Start the server using the npm start script
4. Server will be accessible at `http://localhost:5000`

**Frontend Setup**
1. Navigate to the frontend directory
2. Open the HTML file in a web browser directly, or serve it using any HTTP server
3. Access the application in your browser

### Option 2: Docker Compose (Recommended for Local Testing)

1. Ensure Docker and Docker Compose are installed
2. From the root project directory, start both services using Docker Compose
3. Docker will automatically build and run both frontend and backend containers
4. Access the frontend at `http://localhost:3000`
5. Backend API is accessible at `http://localhost:5000`

**Stopping the Application**
- Use Docker Compose stop command to gracefully shut down all containers
- Use Docker Compose down command to remove all containers

### Option 3: Manual Docker Build & Run

**Backend Container**
1. Navigate to the backend directory
2. Build a Docker image from the Dockerfile
3. Run the container, mapping port 5000 to the host
4. Backend will be accessible at `http://localhost:5000`

**Frontend Container**
1. Navigate to the frontend directory
2. Build a Docker image from the Dockerfile
3. Run the container, mapping port 80 (or 3000) to the host
4. Frontend will be accessible at the mapped port

---

## 🔄 Deployment & CI/CD

### Jenkins Pipeline Overview

The project includes a **Jenkins pipeline** (`Jenkinsfile`) that automates the entire software delivery process from code commit to production deployment.

### Pipeline Stages

**1. Git Version Check**
- Verifies that Git is properly configured in the Jenkins environment
- Ensures version control compatibility

**2. Dependency Installation**
- Installs all Node.js dependencies for the backend
- Ensures all required npm packages are available

**3. Code Quality Analysis (SonarQube)**
- Runs static code analysis using SonarQube
- Checks for code smells, vulnerabilities, and maintainability issues
- Fails the build if quality gates are not met
- Focuses on the backend source code

**4. OWASP Dependency Check**
- Scans all project dependencies for known security vulnerabilities
- Generates HTML and XML reports
- Uses OWASP Dependency-Check tool for comprehensive security scanning
- Identifies outdated or vulnerable packages

**5. Docker Image Build**
- Creates separate Docker images for backend and frontend
- Tags images with version "latest" for easy deployment
- Backend image includes Node.js runtime and application code
- Frontend image includes Nginx and static HTML files

**6. Docker Hub Push**
- Authenticates with Docker Hub using stored credentials
- Pushes backend image to Docker Hub repository
- Pushes frontend image to Docker Hub repository
- Makes images available for deployment across environments

**7. Deployment**
- Stops and removes any previously running containers
- Removes old container instances to avoid conflicts
- Runs new containers from freshly pushed images
- Maps ports: backend on 5000, frontend on 3000 (or 80)
- Starts containers in detached mode for background execution

### Pipeline Configuration

**Tools Required**
- Node.js: For dependency installation and build processes
- Docker: For image creation and container management
- SonarQube: For code quality analysis
- OWASP Dependency-Check: For security scanning

**Environment Variables**
- `DOCKER_IMAGE`: Docker Hub repository path (must be configured)
- `SONAR_PROJECT`: Project identifier for SonarQube analysis

**Credentials Required**
- Docker Hub credentials for image push operations
- SonarQube authentication for code quality scanning

---

## 📂 Project Structure

```
moodlogger/
├── backend/                    # Backend API server
│   ├── Dockerfile             # Docker configuration for backend
│   ├── package.json           # Node.js dependencies and metadata
│   ├── package-lock.json      # Locked dependency versions
│   ├── server.js              # Express.js application entry point
│   └── node_modules/          # Installed npm packages
│
├── frontend/                  # Frontend web application
│   ├── Dockerfile             # Docker configuration for frontend
│   └── index.html             # Single-page HTML application
│
├── docker-compose.yml         # Multi-container orchestration config
├── Jenkinsfile               # CI/CD pipeline definition
└── README.md                 # Project documentation
```

### Directory Details

**Backend Directory**
- Contains all server-side code and configuration
- Includes Express.js application and dependencies
- Separate Dockerfile for containerized deployment
- npm package configuration for dependency management

**Frontend Directory**
- Contains client-side web application
- Single HTML file with embedded styles and scripts
- Nginx-based Dockerfile for lightweight serving
- Minimal footprint for fast loading

**Root Level**
- Docker Compose orchestrates multi-container environment
- Jenkins pipeline defines automated deployment workflow
- Version control configuration for Git

---

## 🛠️ Technology Stack

### Backend Technology
- **Runtime**: Node.js (JavaScript runtime environment)
- **Framework**: Express.js (lightweight web framework)
- **Middleware**: CORS (for cross-origin requests)
- **Server Port**: 5000
- **Data Format**: JSON (REST API standard)
- **Container**: Docker with Alpine Linux base for minimal size

### Frontend Technology
- **Language**: Vanilla JavaScript (no framework dependencies)
- **Markup**: HTML5 (semantic structure)
- **Styling**: CSS3 (responsive design, modern syntax)
- **API Communication**: Fetch API (modern async HTTP requests)
- **Server**: Nginx (production-grade web server)
- **Port**: 80 (HTTP standard)
- **Container**: Docker with Nginx Alpine image

### DevOps & Infrastructure
- **Containerization**: Docker (application isolation and deployment)
- **Orchestration**: Docker Compose (multi-container management)
- **CI/CD**: Jenkins (automated build and deployment pipeline)
- **Code Quality**: SonarQube (static analysis and quality metrics)
- **Security Scanning**: OWASP Dependency-Check (vulnerability detection)
- **Registry**: Docker Hub (image storage and distribution)

### Development & Deployment
- **Version Control**: Git (source code management)
- **Package Management**: npm (Node.js package manager)
- **Build Process**: Docker multi-stage builds for optimization

---

## 📝 Notes

### Current State
- Backend stores moods in memory, suitable for development and testing
- All data is lost when the server restarts
- Perfect for a proof-of-concept or prototype

### Future Enhancements (Recommended)
- Integrate a persistent database (MongoDB, PostgreSQL, or others)
- Add user authentication and authorization
- Implement mood analytics and visualizations
- Add timestamps and date filtering capabilities
- Create mobile-responsive components
- Add mood emoji support and categorization
- Implement data export functionality

### Development Tips
- Use Docker Compose for local development to match production environment
- Always run the pipeline locally before pushing to Jenkins
- Monitor SonarQube and OWASP reports for security concerns
- Keep dependencies updated regularly for security patches

---

## 📞 Support & Contributions

For questions, issues, or contributions, please refer to the project repository documentation or contact the development team.

**Version**: 1.0.0  
**Last Updated**: 2026  
**Status**: Active Development
