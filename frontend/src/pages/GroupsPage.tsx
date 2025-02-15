import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigateFunction, useNavigate } from "react-router-dom";

function GroupsPage() {
  const navigate: NavigateFunction = useNavigate();

  const handleGroupNav = () => {
    navigate('/groups');
  }
  
  const handleCreateGroupNav = () => {
    navigate('/create-group');
  }

  return (
    <div className="text-black p-8">
      <h1 className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-500 via-blue-700 to-black text-transparent bg-clip-text mb-8">
        Your current groups
      </h1>
    </div>
  );
}

export default GroupsPage;