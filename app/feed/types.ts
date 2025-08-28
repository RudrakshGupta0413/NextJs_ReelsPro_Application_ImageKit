export type PostType = {
  _id: string;
  user: {
    name: string;
    username: string;
    profilePicture: string;
    verified: boolean;
  };
  video: {
    videoUrl: string;
    thumbnail: string;
    // duration: string;
  };
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
};
