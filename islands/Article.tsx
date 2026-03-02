import type { Signal } from "@preact/signals";
import { Button } from "@/components/Button.tsx";

function openInNewTab(url) {
  console.log(url)
  window.open(url).focus();
}

interface ArticleProps {
  title: string;
  description: string;
  url: string;
}

export default function (props: ArticleProps) {
  return (
    <div
      class="card card-side bg-base-100 shadow-sm"
      onClick={() => openInNewTab(props.url)}
    >
      <img
        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        alt="Movie"
      />

      <div class="card-body">
        <h2 class="card-title">{props.title}</h2>
        {props.description}
      </div>
    </div>
  );
}
