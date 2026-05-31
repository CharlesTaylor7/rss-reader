export interface BlogProps {
  id: number;
  title: string;
  xml_url: string;
  html_url: string;
}

function unsubscribe(props: BlogProps) {
  const body = new FormData();
  body.append("blogId", props.id.toString());
  fetch(`/api/unsubscribe`, {
    method: "POST",
    body,
  });
}

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
