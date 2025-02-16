from fastapi import APIRouter, HTTPException
from database.database import get_connection
from datetime import datetime
from pydantic import BaseModel

class CreateGroupRequest(BaseModel):
  user_id: int
  group_name: str
  artist: str


router = APIRouter()

def create_group_to_db(user_id, group_name, artist):
  conn = get_connection()
  cursor = None

  try:
    query = f"""
      INSERT INTO groups (user_id, group_name, artist, created_at)
      VALUES (%s, %s, %s, %s)
    """
    query = """
      INSERT INTO groups (user_id, group_name, artist, created_at)
      VALUES (%s, %s, %s, %s) RETURNING group_id
    """

    cursor = conn.cursor()
    cursor.execute(query, (user_id, group_name, artist, datetime.now()))
    group_id = cursor.fetchone()[0]
    conn.commit()

    return {"group_id": group_id, "user_id": user_id, "group_name": group_name, "artist": artist}


  except Exception as e:
    print("Error saving group to DB:", e)
    return None
  
  finally:
    if cursor:
      cursor.close()
    if conn:
      conn.close()


@router.post("/create_group")
async def create_group(request: CreateGroupRequest):
  user_id = request.user_id
  group_name = request.group_name
  artist = request.artist
  print('GROUP: ',group_name, artist, user_id)
  group = create_group_to_db(
    user_id=user_id,
    group_name=group_name,
    artist=artist,
  )

  if not group:
    raise HTTPException(status_code=500, detail="Error creating group.")
  
  return {"message": "Group created successfully", "group": group}


@router.get("/get_groups/{user_id}")
async def get_groups(user_id: int):
  conn = get_connection()
  cursor = conn.cursor()

  try:
    print(f"Fetching group for user_id: {user_id}")

    # Query to get group data
    cursor.execute("SELECT * FROM groups WHERE user_id = %s", (user_id,))
    group_data = cursor.fetchone()
    print("Raw group_data fetched from DB:", group_data)

    if not group_data:
      raise HTTPException(status_code=404, detail="Groups not found or no available groups.")
    
    groups = [{"group_id": group[0], "group_name": group[1], "artist": group[2], "created_at": group[3]} for group in group_data]
    return {"user_id": user_id, "groups": groups}


  except Exception as e:
    print(f"Error: {e}")
    raise HTTPException(status_code=500, detail=f"Error fetching group: {e}")

  finally:
    cursor.close()
    conn.close()
