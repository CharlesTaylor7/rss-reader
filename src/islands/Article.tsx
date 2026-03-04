function openInNewTab(url: string) {
  globalThis.open(url)?.focus();
}

function markRead(id: number): Promise<any> {
  return fetch("/api/read", {
    method: "POST",
    body: JSON.stringify({ post_id: id, read: true }),
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
  return (
    <div
      class="card card-side bg-base-100 shadow-sm cursor-pointer"
      onClick={async () => {
        openInNewTab(props.url);
        await markRead(props.id);
      }}
    >
      <figure>
        {props.thumbnail ? <img src={props.thumbnail} alt="thumbnail" /> : null}
      </figure>

      <div class="card-body">
        <h2 class="card-title">{props.title}</h2>
        <h2 class="card-subtitle">{props.author}</h2>
        <h2 class="card-subtitle">{props.published_at}</h2>
        {props.description}
      </div>
    </div>
  );
}
