import { useSignal } from "@preact/signals";

function openInNewTab(url: string) {
  globalThis.open(url)?.focus();
}

function markRead(id: number, read: boolean): Promise<any> {
  return fetch("/api/read", {
    method: "POST",
    body: JSON.stringify({ post_id: id, read }),
  });
}

export interface ArticleProps {
  id: number;
  title: string;
  author: string;
  url: string;
  published_at: string;
  description?: string;
  thumbnail?: string;
}

export default function (props: ArticleProps) {
  const readSignal = useSignal(false);
  return (
    <div
      class={`card card-side bg-base-200 shadow-sm cursor-pointer ${readSignal.value ? "text-base-content/50" : "text-base-content"}`}
      onClick={() => {
        openInNewTab(props.url);
        readSignal.value = true;
        markRead(props.id, readSignal.value);
      }}
    >
      <figure>
        {props.thumbnail ? <img src={props.thumbnail} alt="thumbnail" /> : null}
      </figure>

      <div class="card-body ">
        <h2 class="card-title">{props.title}</h2>
        <h2 class="card-subtitle">{props.author}</h2>
        <h2 class="card-subtitle">{props.published_at}</h2>
        {props.description}
      </div>
    </div>
  );
}
