import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigateFunction, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate: NavigateFunction = useNavigate();

  const handleGroupNav = () => {
    navigate('/groups');
  }
  
  const handleCreateGroupNav = () => {
    navigate('/create-group');
  }

  return (
    <div className="text-black sm:p-8 pt-24 p-8">
      <h1 className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-500 via-blue-700 to-black text-transparent bg-clip-text mb-8">
        Welcome to ConcertExpensr
      </h1>
      <div className="flex flex-wrap justify-center gap-9 sm:flex-col md:flex-row items-center pt-8">
        <Card className="hover:shadow-lg transition-shadow flex flex-col h-[300px] max-w-[300px]">
          <CardHeader>
            <CardTitle>Create Group Event</CardTitle>
            <CardDescription>Invite friends to your group to start tracking expenses</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Create a group to start inviting friends and begin tracking</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button className="w-full py-3 text-white rounded-lg hover:bg-blue-700 bg-blue-900" onClick={handleCreateGroupNav}>Start new group</Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow flex flex-col h-[300px] max-w-[300px]">
          <CardHeader>
            <CardTitle>See Current Group Events</CardTitle>
            <CardDescription>Go to your current group event to add expenses, edit group, etc.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>See the groups you have already made</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button className="w-full py-3 text-white rounded-lg hover:bg-[#7e7cf0] bg-[#6B6ACC]" onClick={handleGroupNav}>View existing groups</Button>
          </CardFooter>
        </Card>

        {/*
        <Card className="hover:shadow-lg transition-shadow flex flex-col h-[300px] max-w-[300px]">
          <CardHeader>
            <CardTitle>Upload Chatlog/Images</CardTitle>
            <CardDescription>Share your conversation history</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Upload and analyze your previous chat conversations and images</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button className="w-full py-3 text-white rounded-lg hover:bg-red-800 bg-red-900" onClick={handleChatlogNav}>Upload Now</Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow flex flex-col h-[300px] max-w-[300px]">
          <CardHeader>
            <CardTitle>Generate Itinerary</CardTitle>
            <CardDescription>Create a PDF summary</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Generate a PDF document from your chat history and images</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button 
              className="w-full py-3 text-white rounded-lg hover:bg-red-800 bg-red-900" 
              onClick={() => navigate('/itinerary')}
            >
              Create Itinerary
            </Button>
          </CardFooter>
        </Card>
        */}
      </div>
    </div>
  );
}

export default HomePage;