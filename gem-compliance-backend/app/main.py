from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import bidders, status, audit
Base.metadata.create_all(bind=engine)

app = FastAPI(title="GeM AI Compliance Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bidders.router)
app.include_router(status.router)
app.include_router(audit.router)
@app.get("/")
async def root():
    return {"status": "Backend LIVE", "message": "GeM Compliance Platform Ready"}

