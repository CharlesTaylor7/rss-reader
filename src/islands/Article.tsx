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
      class={`w-screen p-3 cursor-pointer ${readSignal.value ? "text-base-content/30" : "text-base-content/80"}`}
      onClick={() => {
        openInNewTab(props.url);
        readSignal.value = true;
        markRead(props.id, readSignal.value);
      }}
    >
      <div class="flex flex-row gap-2 ">
        <figure>
          {props.thumbnail ? (
            <img src={props.thumbnail} alt="thumbnail" />
          ) : null}
        </figure>

        <div class="">
          <h2 class="text-sm text-ellipsis">{props.title}</h2>
          {props.description}

          <h3 class={`text-xs text-base-content/50`}>
            {props.author} / {props.published_at}
          </h3>
        </div>
      </div>
    </div>
  );
}
