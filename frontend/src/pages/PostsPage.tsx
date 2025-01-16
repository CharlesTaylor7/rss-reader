import { useQuery } from "@tanstack/react-query";
export default function PostsPage() {
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch("./api/posts").then((r) => r.json()),
  });
  return (
    <>
      <p>Hello World!</p>
      {postsQuery.data.map((post) => (
        <a>{post}</a>
      ))}
    </>
  );
}
