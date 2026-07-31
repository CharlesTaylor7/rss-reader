import { toast } from "@/client/toast.ts";

export interface BlogProps {
  id: number;
  title: string;
  xml_url: string;
  html_url: string;
}

async function unsubscribe(props: BlogProps) {
  const body = new FormData();
  body.append("blogId", props.id.toString());

  try {
    await fetch(`/api/unsubscribe`, {
      method: "POST",
      body,
    });
    toast(() =>
      `unsubscribed from ${props.title || props.html_url || props.xml_url}`
    );
    const el = document.querySelector(`[data-id='${props.id}']`);
    el?.remove();
  } catch (e) {
    const err = e as Error;
    toast(() => <>{err.message}</>);
  }
}

export default function (props: BlogProps) {
  return (
    <div class="flex flex-row justify-between w-screen" data-id={props.id}>
      <a href={props.html_url || props.xml_url}>
        {props.title || props.html_url || props.xml_url}
      </a>
      <button
        className="btn btn-error btn-sm"
        type="button"
        onClick={() => unsubscribe(props)}
      >
        Unsubscribe
      </button>
    </div>
  );
}
