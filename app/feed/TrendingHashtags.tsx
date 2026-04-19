import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import Link from "next/link";
import { Hash, TrendingUp } from "lucide-react";

interface TrendingTag {
  tag: string;
  count: number;
}

export default async function TrendingHashtags() {
  await connectToDatabase();

  const trending: TrendingTag[] = await Video.aggregate([
    { $match: { isPublic: true, hashtags: { $exists: true, $ne: [] } } },
    { $unwind: "$hashtags" },
    { $group: { _id: "$hashtags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 7 },
    { $project: { _id: 0, tag: "$_id", count: 1 } },
  ]);

  if (trending.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          Trending Hashtags
        </h3>
      </div>

      {/* Hashtag List */}
      <div className="divide-y divide-border">
        {trending.map((item, index) => (
          <Link
            key={item.tag}
            href={`/explore/hashtag/${encodeURIComponent(item.tag)}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group"
          >
            <span className="text-xs font-semibold text-muted-foreground w-4">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors truncate">
                <Hash className="w-3.5 h-3.5 inline-block mr-0.5 -mt-0.5" />
                {item.tag}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.count} {item.count === 1 ? "post" : "posts"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
