import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CircleArrowLeft } from "lucide-react";

interface Group {
  group_id: number;
  leader_id: number;
  group_name: string;
  artist: string;
  created_at: string;
}

function GroupsPage() {
  const navigate: NavigateFunction = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const user_id = Number(localStorage.getItem("user_id"));

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/get_groups/${user_id}`);
        console.log('Response Data: ', response.data);

        if (response.data && response.data.groups) {
          setGroups(response.data.groups);
        } else {
          setGroups([]);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setGroups([]);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="text-black sm:p-8 pt-24 p-8">
      <CircleArrowLeft onClick={() => navigate(`/home`)} className="bg-blue-400 sm:w-8 sm:h-8 w-10 h-10 sm:rounded-2xl rounded-3xl cursor-pointer sm:relative top-6 absolute"/>
      <h1 className="text-3xl font-semibold text-center text-black mb-8">
        Your current groups
      </h1>

      <div className="flex flex-col gap-6 justify-center w-full sm:flex-row sm:flex-wrap md:gap-8"> 
        {groups.length > 0 ? (
          groups.map((group) => (
            <Card key={group.group_id} className="bg-white rounded-xl shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 text-center">
              <CardHeader>
                <CardTitle>{group.group_name}</CardTitle>
                <CardDescription>Artist: {group.artist}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Created at: {new Date(group.created_at).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="gap-3">
                <Button onClick={() => navigate(`/groups/${group.leader_id}/${group.group_id}`)} className="w-full hover:bg-[#7e7cf0] bg-[#6B6ACC] text-white rounded-lg">
                  View Group
                </Button>
                <Button onClick={() => navigate(`/groups/${group.group_id}`)} className="w-full hover:bg-green-600 bg-green-700 text-white rounded-lg">
                  Edit Group
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-black">No groups available.</p>
        )}
      </div>
    </div>
  );
}

export default GroupsPage;
