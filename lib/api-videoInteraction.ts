export async function toggleLike(videoId: string) {
  const res = await fetch(`/api/videos/${videoId}/like`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to like the video");
  return res.json(); // FIX: return when successful
}

export async function toggleBookmark(videoId: string) {
  const res = await fetch(`/api/videos/${videoId}/bookmark`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to bookmark the video");
  return res.json();
}

export async function shareVideo(videoId: string) {
  const res = await fetch(`/api/videos/${videoId}/share`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to share the video");
  return res.json();
}

export async function addComment(videoId: string, text: string) {
  const res = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: { "Content-Type": "application/json" }, // good practice
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function deleteComment(videoId: string, commentId: string) {
  const res = await fetch(`/api/videos/${videoId}/comment/${commentId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
}
