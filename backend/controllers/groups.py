from typing import List
from psycopg2.extras import RealDictCursor
from fastapi import APIRouter, HTTPException
from database.database import get_connection
from datetime import datetime
from pydantic import BaseModel, Field

class CreateGroupRequest(BaseModel):
  group_id: int
  leader_id: int
  user_id: int
  group_name: str
  artist: str


router = APIRouter()


def create_unique_group_to_db(group_id, user_id, leader_id, group_name, artist):
  conn = get_connection()
  cursor = None

  try:
    query = """
    INSERT INTO groups (group_id, user_id, leader_id, group_name, artist, created_at)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor = conn.cursor()
    cursor.execute(query, (group_id, user_id, leader_id, group_name, artist, datetime.now()))
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
  group_id = request.group_id
  user_id = request.user_id
  leader_id = request.leader_id
  group_name = request.group_name
  artist = request.artist
  print('GROUP: ',group_name, artist, user_id)
  group = create_unique_group_to_db(
    group_id=group_id,
    user_id=user_id,
    leader_id=leader_id,
    group_name=group_name,
    artist=artist,
  )

  if not group:
    raise HTTPException(status_code=500, detail="Error creating group.")
  
  return {"message": "Group created successfully", "group": group}

@router.post("/join_group/{leader_id}/{group_id}/{user_id}")
async def join_group(leader_id: int, group_id: int, user_id: int):
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
    #user_id = request.user_id
    print('this guy is joining: ', user_id)
    group_name = group_data["group_name"]
    artist = group_data["artist"]

    print('Joining group:', group_name, artist, user_id, group_id)

    # Create the new group entry with the user_id (this simulates joining)
    new_group = create_unique_group_to_db(
      group_id=group_id,
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

@router.get("/get_group_details/{group_id}/{user_id}")
async def get_group_details(group_id: int, user_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        print(f"Fetching group {group_id} for user {user_id}")

        # Query to get group details where the user is a member
        query = """
        SELECT * FROM groups
        WHERE group_id = %s AND user_id = %s
        """

        cursor.execute(query, (group_id, user_id))
        group_data = cursor.fetchone()

        if not group_data:
            raise HTTPException(status_code=404, detail="Group not found or user not in the group.")

        # Fetch all members in the group
        members_query = """
        SELECT user_id FROM groups
        WHERE group_id = %s
        """
        cursor.execute(members_query, (group_id,))

        members_data = cursor.fetchall()

        members = []
        for member in members_data:
            user_query = """
            SELECT username, email FROM users
            WHERE user_id = %s
            """
            cursor.execute(user_query, (member["user_id"],))
            user_data = cursor.fetchone()

            if user_data:
                members.append({
                    "id": member["user_id"],
                    "name": user_data["username"],
                    "email": user_data["email"]
                })
            else:
                members.append({
                    "id": member["user_id"],
                    "name": "Unknown User",
                    "email": "unknown@example.com"
                })

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

class Expense(BaseModel):
    group_id: int
    leader_id: int
    user_id: int
    expense_name: str
    total: float
    created_at: str = None  


@router.post("/add_expense")
async def add_expense(expense: Expense):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = """
        INSERT INTO expenses (group_id, leader_id, user_id, expense_name, total, created_at)
        VALUES (%s, %s, %s, %s, %s, %s) RETURNING expense_id
        """
        cursor.execute(query, (expense.group_id, expense.leader_id, expense.user_id, expense.expense_name, expense.total, datetime.now()))
        expense_id = cursor.fetchone()['expense_id']
        conn.commit()

        calculate_shares(
          expense_id, expense.group_id, expense.user_id, expense.total
        )

        return {"message": "Expense added successfully!"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding expense: {e}")
    finally:
        cursor.close()
        conn.close()

@router.get("/get_group_expenses/{group_id}/{leader_id}", response_model=List[Expense])
async def get_expenses(group_id: int, leader_id: int):
    print(group_id, leader_id)
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = """
        SELECT *
        FROM expenses
        WHERE group_id = %s AND leader_id = %s
        """
        cursor.execute(query, (group_id, leader_id))
        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="No expenses found")

        expenses = []
        for row in rows:
            expense = {
                "group_id": row['group_id'],           # Add missing fields
                "leader_id": row['leader_id'],         # Add missing fields
                "user_id": row['user_id'],               
                "expense_name": row['expense_name'],  # Access by column name
                "total": row['total'],                # Access by column name
                "created_at": row['created_at'].isoformat() if row['created_at'] else None,  # Format datetime
            }
            expenses.append(expense)
        
        return expenses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching expenses: {e}")
    finally:
        cursor.close()
        conn.close()



def calculate_shares(expense_id, group_id, payer_id, total):
    conn = get_connection()
    cursor = conn.cursor()

    # print(expense_id, group_id, payer_id, total)
    # Fetch group members
    cursor.execute("SELECT user_id FROM groups WHERE group_id = %s", (group_id,))
    members = cursor.fetchall()
    print(members)
    
    share_amount = total / len(members)
    
    for member in members:
        print(member)
        if member['user_id'] != payer_id:
            cursor.execute("""
                INSERT INTO expense_shares (expense_id, group_id, user_id, amount_owed, owes_to)
                VALUES (%s, %s, %s, %s, %s)
            """, (expense_id, group_id, member['user_id'], share_amount, payer_id))

    conn.commit()
    cursor.close()


@router.get("/group_balances/{group_id}/{leader_id}")
async def get_group_balances(group_id: int, leader_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = """
        SELECT user_id, owes_to, SUM(amount_owed) AS balance
        FROM expense_shares
        WHERE group_id = 1
        GROUP BY user_id, owes_to
        """
        cursor.execute(query, (group_id,))
        balances = cursor.fetchall()
        print(balances)

        result = [
            {"user_id": row['user_id'], "owes_to": row['owes_to'], "balance": float(row['balance'])} for row in balances
        ]
        print(result)


        return result
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error fetching balances: {e}")
    finally:
        cursor.close()
        conn.close()
