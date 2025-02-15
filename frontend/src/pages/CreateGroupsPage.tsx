import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function CreateGroupsPage() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted!");
  };

  return (
    <div className="text-black p-8">
      <h1 className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-500 via-blue-700 to-black text-transparent bg-clip-text mb-8">
        Create Groups Form
      </h1>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#6B6ACC] p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <label htmlFor="groupName" className="block text-white mb-2">Group Name</label>
          <input
            id="groupName"
            type="text"
            placeholder="Enter group name"
            className="w-full p-3 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#7e7cf0] focus:border-[#7e7cf0]"
          />
        </div>

        <div>
          <label htmlFor="artistName" className="block text-white mb-2">Artist Name</label>
          <input
            id="artistName"
            type="text"
            placeholder="Artist name"
            className="w-full p-3 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#7e7cf0] focus:border-[#7e7cf0]"
          />
        </div>

        {/*
        <div>
          <label htmlFor="groupType" className="block text-white mb-2">Event Type</label>
          <select
            id="groupType"
            className="w-full p-3 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#7e7cf0] focus:border-[#7e7cf0]"
          >
            <option value="public">Concert</option>
            <option value="private">Hangout</option>
            <option value="secret">Other</option>
          </select>
        </div>
        */}

        <div>
          <Button
            type="submit"
            className="w-full py-3 text-white rounded-lg hover:bg-[#4F4F99] bg-[#353566] transition duration-300 ease-in-out"
          >
            Create Group
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroupsPage;
