
# CodeWizard Microservice Project

This project is a microservice-based architecture that includes a frontend application and an API gateway for handling communication between services. The microservice we're focusing on is the CodeBase Analyzer, which processes and analyzes codebases.
try right tab url for the  preview
## Open Ports

| Port  | Service                | Access                          |
|-------|------------------------|---------------------------------|
| 5000  | API Gateway             | ✅ All communications go through this gateway |
| 5173  | Default Frontend             | ⚓ Frontend PORT |
| 3001  | CodeBase Analyzer       | 🚫 No direct access, use API Gateway |

## Project Structure

```bash
CodeWizard/
├── frontend/            # React frontend application 
├── services/            # Microservices (e.g., codebase-analyzer, service-2)
├── api-gateway/         # API Gateway configuration
└── docker-compose.yml   # Docker Compose configuration file
```

## Setup Instructions

### 1. Clone the Repository

Clone the repository using the following command:

```bash
git clone https://github.com/nxdun/CodeWizard.git
```

### 2. Build and Run the Services

To build and start the services, use Docker Compose:

```bash
docker-compose up --build
```

### 3. Access the Frontend

The frontend is served on `http://localhost:5173` via Vite. Open your browser and navigate to the following address:

```bash
http://localhost:5173
```

### 4. API Gateway

The API Gateway (port `5000`) is responsible for routing requests between the frontend and the backend services. All communications are managed through this gateway.

### Docker Compose

Ensure you have Docker and Docker Compose installed before proceeding. Docker Compose will orchestrate all services, including the frontend, backend, and API Gateway.

## Notes

- **Frontend Port:** The frontend runs on port `3000` locally.
- **API Gateway:** All backend services, including the CodeBase Analyzer, are accessed via the API Gateway on port `5000`.
- **CodeBase Analyzer:** This service is isolated and cannot be accessed directly; all requests must go through the API Gateway.

## Getting Help

For issues or contributions, please open an issue or submit a pull request on the [GitHub repository](https://github.com/nxdun/CodeWizard).
