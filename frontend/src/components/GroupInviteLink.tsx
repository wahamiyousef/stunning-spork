import { useState } from 'react';
import { Button } from './ui/button';

const GroupInviteButton = ({ leaderId, group_id }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const user_id = Number(localStorage.getItem("user_id"));

  const handleCopyLink = () => {
    const link = `${window.location.origin}/join_group/${leaderId}/${group_id}/${user_id}`;
    navigator.clipboard.writeText(link).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div>
      <Button 
        onClick={handleCopyLink}
        className="hover:bg-blue-600 bg-blue-500 text-white rounded-lg sm:h-9 h-14 sm:text-sm text-lg"
      >
        {linkCopied ? 'Link Copied!' : 'Copy invite link'}
      </Button>
    </div>
  );
};

export default GroupInviteButton;
