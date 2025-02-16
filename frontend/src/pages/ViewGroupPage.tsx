import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CircleArrowLeft } from "lucide-react";
import GroupInviteButton from "@/components/GroupInviteLink";

interface Member {
  id: number;
  name: string;
  email: string;
}

interface Expense {
  expense_name: string;
  total: string;
  created_at: string;
}

interface Group {
  group_id: number;
  leader_id: number;
  group_name: string;
  artist: string;
  created_at: string;
  members: Member[];
}

function ViewGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);  // Make sure expenses is always an array
  const user_id = Number(localStorage.getItem("user_id"));

  // State for managing modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [total, setTotal] = useState("");
  const [balances, setBalances] = useState([]);
  const [balanceGroup, setBalanceGroup] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        // Fetch group details
        const response = await axios.get(`http://127.0.0.1:8000/api/get_group_details/${groupId}/${user_id}`);
        setGroup(response.data.group);
        console.log('SETTIDAT', group);
        console.log('SETTIDAT2', response.data);
        setBalanceGroup(response.data)
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    fetchGroupDetails();
  }, [groupId, user_id]);

  useEffect(() => {
    if (group && group.leader_id) {
      const fetchExpenses = async () => {
        try {
          const expenseResponse = await axios.get(
            `http://127.0.0.1:8000/api/get_group_expenses/${group.group_id}/${group.leader_id}`
          );
          setExpenses(expenseResponse.data);  // Assume the response data is an array of expenses
          const response = await axios.get(`http://127.0.0.1:8000/api/group_balances/${groupId}/${group?.leader_id}`);
          setBalances(response.data);
          console.log(balances);
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      };

      fetchExpenses();
    }
  }, [group]);  // Re-run this effect whenever group changes and group has leader_id

  const handleAddExpense = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/add_expense`, {
        group_id: group?.group_id,
        leader_id: group?.leader_id,
        user_id: user_id,
        expense_name: expenseName,
        total,
      });
      // Fetch updated expenses after adding a new expense
      const updatedExpenseResponse = await axios.get(
        `http://127.0.0.1:8000/api/get_group_expenses/${group?.group_id}/${group?.leader_id}`
      );
      setExpenses(updatedExpenseResponse.data);  // Update the expenses state

      const response = await axios.get(`http://127.0.0.1:8000/api/group_balances/${groupId}/${group?.leader_id}`);
      setBalances(response.data);

      // Close the modal after submitting
      setIsModalOpen(false);
      setExpenseName("");
      setTotal("");
      alert("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        console.log('groupId:', groupId, 'leader_id:', group?.leader_id);
        console.log(balanceGroup.group.leader_id);
        const response = await axios.get(`http://127.0.0.1:8000/api/group_balances/${groupId}/${group?.leader_id}`);
        console.log('balance: ', response.data);
        setBalances(response.data);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
  }, [groupId]);

  if (!group) {
    return <p className="flex justify-center text-3xl">Loading group details...</p>;
  }

  return (
    <div className="text-black sm:p-8 pt-24 p-8">
      <CircleArrowLeft onClick={() => navigate(`/groups`)} className="bg-blue-400 sm:w-8 sm:h-8 w-10 h-10 sm:rounded-2xl rounded-3xl cursor-pointer sm:relative top-6 absolute" />
      <div className="lg:justify-items-center">
        <h1 className="text-3xl font-semibold text-center text-black mb-8">{group.group_name}</h1>
        <Card className="bg-white rounded-xl shadow-lg p-6 mb-6 lg:w-2/3 justify-center">
          <CardHeader>
            <CardTitle className="text-xl">Artist: {group.artist}</CardTitle>
            <CardDescription className="text-lg">Created on: {new Date(group.created_at).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="gap-8">
            <div className="pb-8">
              <h2 className="text-xl font-semibold mb-4">Members</h2>
              <ul className="list-disc list-inside mb-4">
                {group.members.map((member) => (
                  <li className="text-lg" key={member.id}>{member.name} ({member.email})</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-8">
              <GroupInviteButton leaderId={group.leader_id} group_id={group.group_id} />
              <Button onClick={() => setIsModalOpen(true)} className="hover:bg-green-600 bg-green-500 text-white rounded-lg sm:h-9 h-14 sm:text-sm text-lg">
                Add Expense
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Display Expenses below the Add Expense button */}
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>
          {expenses.length === 0 ? (
            <p>No expenses added yet.</p>
          ) : (
            <ul className="list-disc list-inside">
              {expenses.map((expense, index) => (
                <li key={index} className="text-lg mb-2">
                  {expense.expense_name} - ${expense.total}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          {/* Other UI elements here */}
          <h2 className="text-xl font-semibold mb-4">Balances</h2>
          {balances.length === 0 ? (
            <p>No balances yet.</p>
          ) : (
            <ul>
              {balances.map((balance, index) => (
                <li key={index}>user_id: {balance.user_id} owes {balance.owes_to}: ${balance.balance}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Modal for adding expense */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-2xl font-semibold mb-4">Add New Expense</h2>
              <div className="mb-4">
                <label htmlFor="expenseName" className="block text-lg font-medium mb-2">Expense Name</label>
                <input
                  type="text"
                  id="expenseName"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="total" className="block text-lg font-medium mb-2">Total</label>
                <input
                  type="number"
                  id="total"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button onClick={() => setIsModalOpen(false)} className="hover:bg-gray-300 bg-gray-200 text-black rounded-lg sm:h-9 h-12 sm:text-sm text-lg">
                  Cancel
                </Button>
                <Button onClick={handleAddExpense} className="hover:bg-blue-600 bg-blue-500 text-white rounded-lg sm:h-9 h-12 sm:text-sm text-lg">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewGroupPage;
