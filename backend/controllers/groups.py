from psycopg2.extras import RealDictCursor
from fastapi import APIRouter, HTTPException
from database.database import get_connection
from datetime import datetime
from pydantic import BaseModel

class CreateGroupRequest(BaseModel):
  group_id: int
  leader_id: int
  user_id: int
  group_name: str
  artist: str


router = APIRouter()

def create_group_to_db(user_id, leader_id, group_name, artist):
  conn = get_connection()
  cursor = None

  try:
    query = """
    INSERT INTO groups (user_id, leader_id, group_name, artist, created_at)
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor = conn.cursor()
    cursor.execute(query, (user_id, leader_id, group_name, artist, datetime.now()))
    conn.commit()
    return {"user_id": user_id, "group_name": group_name, "artist": artist}

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
  leader_id = request.leader_id
  group_name = request.group_name
  artist = request.artist
  print('GROUP: ',group_name, artist, user_id)
  group = create_group_to_db(
    user_id=user_id,
    leader_id=leader_id,
    group_name=group_name,
    artist=artist,
  )

  if not group:
    raise HTTPException(status_code=500, detail="Error creating group.")
  
  return {"message": "Group created successfully", "group": group}

@router.post("/join_group/{leader_id}/{group_id}")
async def join_group(request: CreateGroupRequest, leader_id: int, group_id: int):
  conn = get_connection()
  cursor = conn.cursor()

  try:
    # Check if the group exists
    query = """
    SELECT * FROM groups
    WHERE leader_id = %s AND group_id = %s
    """
    cursor.execute(query, (leader_id, group_id))
    group_data = cursor.fetchone()

    if not group_data:
      raise HTTPException(status_code=404, detail="Group not found.")
    
    # Add the user to the group by calling the function to create a new entry with the user_id
    user_id = request.user_id
    group_name = group_data["group_name"]
    artist = group_data["artist"]

    print('Joining group:', group_name, artist, user_id)

    # Create the new group entry with the user_id (this simulates joining)
    new_group = create_group_to_db(
      user_id=user_id,
      leader_id=leader_id,
      group_name=group_name,
      artist=artist
    )

    if not new_group:
      raise HTTPException(status_code=500, detail="Error joining group.")
    
    return {"message": "Successfully joined the group", "group": new_group}

  except Exception as e:
    print(f"Error: {e}")
    raise HTTPException(status_code=500, detail=f"Error joining group: {e}")

  finally:
    cursor.close()
    conn.close()



@router.get("/get_groups/{user_id}")
async def get_groups(user_id: int):
  conn = get_connection()
  cursor = conn.cursor()

  try:
    print(f"Fetching group for user_id: {user_id}")

    # Query to get group data
    cursor.execute("SELECT * FROM groups WHERE user_id = %s", (user_id,))
    group_data = cursor.fetchall()
    print("Raw group_data fetched from DB:", group_data)

    if not group_data:
      raise HTTPException(status_code=404, detail="Groups not found or no available groups.")
    
    groups = [
      {
        "group_id": group["group_id"],
        "leader_id": group["leader_id"],
        "group_name": group["group_name"],
        "artist": group["artist"],
        "created_at": group["created_at"]
      }
      for group in group_data
    ]

    return {"user_id": user_id, "groups": groups}


  except Exception as e:
    print(f"Error: {e}")
    raise HTTPException(status_code=500, detail=f"Error fetching group: {e}")

  finally:
    cursor.close()
    conn.close()

@router.get("/get_group_details/{leader_id}/{group_id}")
async def get_groups(leader_id: int, group_id: int):
  conn = get_connection()
  cursor = conn.cursor()

  try:
    print(f"Fetching group {group_id} for leader_id: {leader_id}")

    # Query to get group details for a specific leader and group
    query = """
    SELECT * FROM groups
    WHERE leader_id = %s AND group_id = %s
    """
    
    cursor.execute(query, (leader_id, group_id))
    group_data = cursor.fetchone()

    if not group_data:
      raise HTTPException(status_code=404, detail="Group not found.")
    
    # Fetch all members with the same leader_id and group_id
    members_query = """
    SELECT user_id FROM groups
    WHERE leader_id = %s AND group_id = %s
    """
    cursor.execute(members_query, (leader_id, group_id))
    members_data = cursor.fetchall()

    # Placeholder: Fetch user details (name and email) from a users table
    # For now, we'll just mock member details since there's no users table provided.
    members = []
    for member in members_data:
      user_query = """
      SELECT username, email FROM users
      WHERE user_id = %s
      """
      cursor.execute(user_query, (member["user_id"],))
      user_data = cursor.fetchone()
      print('user_Data: ', user_data)

      if user_data:
        members.append({
          "id": member["user_id"],
          "name": user_data["username"],
          "email": user_data["email"]
        })
      else:
        # Handle case where user does not exist in the users table
        members.append({
          "id": member["user_id"],
          "name": "Unknown User",  # Default name if no user is found
          "email": "unknown@example.com"  # Default email
        })


    # Construct the group details
    group_info = {
      "group_id": group_data["group_id"],
      "leader_id": group_data["leader_id"],
      "group_name": group_data["group_name"],
      "artist": group_data["artist"],
      "created_at": group_data["created_at"],
      "members": members
    }

    return {"group": group_info}

  except Exception as e:
    print(f"Error: {e}")
    raise HTTPException(status_code=500, detail=f"Error fetching group: {e}")

  finally:
    cursor.close()
    conn.close()
