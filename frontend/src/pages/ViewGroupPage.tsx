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
  const user_id = Number(localStorage.getItem("user_id"));

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/get_group_details/${user_id}/${groupId}`);
        console.log(response);
        setGroup(response.data.group);
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (!group) {
    return <p className="flex justify-center text-3xl">Loading group details...</p>;
  }

  return (
    <div className="text-black sm:p-8 pt-24 p-8">
      <CircleArrowLeft onClick={() => navigate(`/groups`)} className="bg-blue-400 sm:w-8 sm:h-8 w-10 h-10 sm:rounded-2xl rounded-3xl cursor-pointer sm:relative top-6 absolute"/>
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
              <Button onClick={() => {navigator.clipboard.writeText('')}} className="hover:bg-blue-600 bg-blue-500 text-white rounded-lg sm:h-9 h-14 sm:text-sm text-lg">
                Copy invite link
              </Button>
              <Button onClick={() => navigate(`/groups/${group.group_id}/add-expense`)} className="hover:bg-green-600 bg-green-500 text-white rounded-lg sm:h-9 h-14 sm:text-sm text-lg">
                Add Expense
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ViewGroupPage;
