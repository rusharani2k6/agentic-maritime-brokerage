# Agentic Maritime Brokerage — Milestone 1

This is a clean Milestone 1 foundation for the maritime route intelligence project.

## Folder structure

```text
Agentic-Maritime-Brokerage/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   ├── route_agent.py
│   │   │   └── pricing_agent.py
│   │   ├── __init__.py
│   │   └── models.py
│   ├── data/
│   │   └── routes.csv
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## Backend

Open a terminal inside `backend`:

```powershell
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Backend: http://127.0.0.1:8000
Swagger: http://127.0.0.1:8000/docs

## Frontend

Open a second terminal inside `frontend`:

```powershell
npm install
npm run dev
```

Frontend: http://localhost:5173

## Demo

Use the default values:

- Origin: Chennai
- Destination: Amsterdam
- Cargo Type: Electronics
- Containers: 1

Click **Analyze All Routes**. The UI displays all matching routes and marks the highest-scoring route as the optimal route.

## Important

Do not put the Python `venv` folder inside your source ZIP/Git repository. It is generated locally from `requirements.txt`.
