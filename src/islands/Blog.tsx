export interface BlogProps {
  id: number;
  title: string;
  xml_url: string;
  html_url: string;
}

const unsubscribe = (props: BlogProps) => {
  fetch(`/api/unsubscribe?blogId=${props.id}`, { method: "POST" });
};

export default function (props: BlogProps) {
  return (
    <div class="flex flex-row justify-between w-screen">
      <a href={props.html_url}>{props.title}</a>
      <button type="button" onClick={() => unsubscribe(props)}>
        Unsubscribe
      </button>
    </div>
  );
}
