interface User {
  followers: string[] | number;
  following: string[] | number;
}

interface ProfileStatsProps {
  user: User;
  postsCount: number;
}

const ProfileStats = ({ user, postsCount }: ProfileStatsProps) => {
 const getCount = (val: any) => {
   if (Array.isArray(val)) return val.length;
   return typeof val === "number" ? val : 0;
 };

 const formatNumber = (num?: number) => {
  if (typeof num !== "number" || isNaN(num)) return "0";

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toString();
};


  return (
    <div className="flex items-center justify-around py-6 border-y border-border mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">
          {formatNumber(postsCount)}
        </div>
        <div className="text-sm text-muted-foreground">Posts</div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">
          {formatNumber(getCount(user.followers))}
        </div>
        <div className="text-sm text-muted-foreground">Followers</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">
          {formatNumber(getCount(user.following))}
        </div>
        <div className="text-sm text-muted-foreground">Following</div>
      </div>
    </div>
  );
};

export default ProfileStats;