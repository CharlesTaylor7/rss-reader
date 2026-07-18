import { useSignal } from "@preact/signals";

function openInNewTab(url: string) {
  globalThis.open(url)?.focus();
}

function apiRead(id: number, read: boolean): Promise<Response> {
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
  read: boolean;
}

export default function (props: ArticleProps) {
  const readSignal = useSignal(props.read);
  function onTap() {
    openInNewTab(props.url);
    readSignal.value = true;
    apiRead(props.id, readSignal.value);
  }

  return (
    <div
      onClick={onTap}
      class={`w-screen p-3 cursor-pointer ${
        readSignal.value ? "text-base-content/30" : "text-base-content/80"
      }`}
    >
      <div class="flex flex-row gap-2 items-center ">
        <div class="">
          <h2 class="text-sm truncate">{props.title}</h2>
          {props.description}

          <h3 class="text-xs text-base-content/50 truncate">
            {props.author} / {props.published_at}
          </h3>
        </div>
      </div>
    </div>
  );
}
