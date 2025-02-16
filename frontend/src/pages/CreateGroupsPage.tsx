import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { CircleArrowLeft } from "lucide-react";

function CreateGroupsPage() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [artist, setArtist] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      console.log(groupName);
      console.log(artist);
      const response = await axios.post("http://127.0.0.1:8000/api/create_group", {
        user_id: 1,  // Example static user ID
        group_name: groupName,
        artist: artist,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      

      console.log("Group created successfully:", response.data);
      navigate("/groups");
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="text-black sm:p-8 pt-24 p-8">
      <CircleArrowLeft onClick={() => navigate(`/home`)} className="bg-blue-400 sm:w-8 sm:h-8 w-10 h-10 sm:rounded-2xl rounded-3xl cursor-pointer sm:relative top-6 absolute"/>
      <h1 className="text-3xl font-semibold text-center text-black mb-8">
        Create Groups Form
      </h1>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#6B6ACC] p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <label htmlFor="groupName" className="block text-white mb-2">Group Name</label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="w-full p-3 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#7e7cf0] focus:border-[#7e7cf0]"
          />
        </div>

        <div>
          <label htmlFor="artist" className="block text-white mb-2">Artist Name</label>
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist name"
            className="w-full p-3 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#7e7cf0] focus:border-[#7e7cf0]"
          />
        </div>

        <div>
          <Button
            type="submit"
            className="w-full py-3 text-white rounded-lg hover:bg-[#4F4F99] bg-[#353566] transition duration-300 ease-in-out sm:h-9 h-14 sm:text-sm text-lg"
          >
            Create Group
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroupsPage;