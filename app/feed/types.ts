export interface PostType {
  _id: string;
  uploadedBy: {
    id: string;
    name: string;
    username: string;
    profilePicture: string;
    verified: boolean;
  };
  type: "video" | "image";
  video: {
    videoUrl: string;
    thumbnail: string;
    aspectRatio: "9:16" | "16:9";
  };
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  commentsList?: Array<{
    _id: string;
    name: string;
    username: string;
    profilePicture: string;
    verified: boolean;
    text: string;
    createdAt: string;
  }>;
}
