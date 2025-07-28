
interface User {
  followers: number;
  following: number;
  likes: number;
}

interface ProfileStatsProps {
  user: User;
}

const ProfileStats = ({ user }: ProfileStatsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="flex items-center justify-around py-6 border-y border-border mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">
          {formatNumber(user.followers)}
        </div>
        <div className="text-sm text-muted-foreground">Followers</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">
          {formatNumber(user.following)}
        </div>
        <div className="text-sm text-muted-foreground">Following</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">
          {formatNumber(user.likes)}
        </div>
        <div className="text-sm text-muted-foreground">Likes</div>
      </div>
    </div>
  );
};

export default ProfileStats;