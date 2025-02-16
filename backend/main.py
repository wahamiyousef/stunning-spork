from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#from controllers.examgenerator import router as examgenerator_route
from controllers.groups import router as group_router
from controllers.authentication import router as authentication_router
from database.database import get_connection

app = FastAPI()
'''
Access the API documentation at:

Swagger UI: http://127.0.0.1:8000/docs
Redoc UI: http://127.0.0.1:8000/redoc
'''

# Add CORS middleware
origins = [
  "http://localhost:5173", # Vite
  "https://yourfrontenddomain.com",  # Production frontend
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# tag parameter helps group the routes for better documentation in the Swagger UI]
#app.include_router(examgenerator_route, prefix="/api", tags=["nebius"])
app.include_router(group_router, prefix="/api", tags=["groups"])
app.include_router(authentication_router, prefix="/api", tags=["authentication"])


conn = get_connection()
cursor = conn.cursor()


@app.get("/")
def read_root():
  return {"message": "Hello, World!"}
