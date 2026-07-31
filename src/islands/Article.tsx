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
  function onTap() {
    openInNewTab(props.url);
    apiRead(props.id, true);
    document.querySelector(`[data-id='${props.id}']`)?.classList.replace(
      "text-base-content/80",
      "text-base-content/30",
    );
  }

  return (
    <div
      data-id={props.id}
      onClick={onTap}
      class="w-screen p-3 cursor-pointer text-base-content/80"
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
