import { useState } from "preact/compat";

function openInNewTab(url: string) {
  globalThis.open(url)?.focus();
}

function apiRead(id: number, read: boolean): Promise<Response> {
  return fetch("/api/read", {
    method: "POST",
    body: JSON.stringify({ post_id: id, read }),
  });
}

function apiFavorite(id: number, favorite: boolean): Promise<Response> {
  return fetch("/api/favorite", {
    method: "POST",
    body: JSON.stringify({ post_id: id, favorite }),
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
  favorite: boolean;
}

export default function (props: ArticleProps) {
  const [read, setRead] = useState(props.read);
  const [bookmarked, setBookmark] = useState(props.favorite);
  function onTap() {
    openInNewTab(props.url);
    apiRead(props.id, true);
    setRead(true);
  }

  return (
    <div
      data-id={props.id}
      onClick={onTap}
      class={`w-screen p-3 cursor-pointer ${
        read ? "text-base-content/30" : "text-base-content/80"
      }`}
    >
      <div class="flex flex-row gap-2 items-center justify-between">
        <div class="">
          <h2 class="text-sm truncate">{props.title}</h2>
          {props.description}

          <h3 class="text-xs text-base-content/50 truncate">
            {props.author} / {props.published_at}
          </h3>
        </div>

        <button
          type="button"
          class="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setBookmark(!bookmarked);
            apiFavorite(props.id, !bookmarked);
          }}
        >
          {bookmarked
            ? <img src="/bookmarked.svg" />
            : <img src="/bookmark.svg" />}
        </button>
      </div>
    </div>
  );
}
