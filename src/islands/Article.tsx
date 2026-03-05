import { useSignal } from "@preact/signals";
import { useSwipeable } from "react-swipeable";

function openInNewTab(url: string) {
  globalThis.open(url)?.focus();
}

function apiRead(id: number, read: boolean): Promise<any> {
  return fetch("/api/read", {
    method: "POST",
    body: JSON.stringify({ post_id: id, read }),
  });
}

function apiIgnore(id: number, ignore: boolean): Promise<any> {
  return fetch("/api/ignore", {
    method: "POST",
    body: JSON.stringify({ post_id: id, ignore }),
  });
}

function apiFavorite(id: number, favorite: boolean): Promise<any> {
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
  thumbnail?: string;
  read: boolean;
  ignored: boolean;
  favorite: boolean;
}

export default function (props: ArticleProps) {
  const readSignal = useSignal(props.read);
  const ignoredSignal = useSignal(props.ignored);
  const favoriteSignal = useSignal(props.favorite);
  const swipeTransformX = useSignal(0);
  const swipeHandlers = useSwipeable({
    trackMouse: true,
    onSwiped(_event) {
      swipeTransformX.value = 0;
    },
    onSwipedLeft(event) {
      if (event.absX > 100) {
        ignoredSignal.value = true;
        apiIgnore(props.id, true);
      }
    },
    onSwipedRight(event) {
      if (event.absX > 100) {
        favoriteSignal.value = true;
        apiFavorite(props.id, true);
      }
    },
    onSwipedUp(_event) {},
    onSwipedDown(_event) {},
    onSwipeStart(_event) {},
    onSwiping(event) {
      swipeTransformX.value = event.deltaX;
    },
    onTap(_event) {
      openInNewTab(props.url);
      readSignal.value = true;
      apiRead(props.id, readSignal.value);
    },
  });

  if (ignoredSignal.value) return null;
  return (
    <div
      {...swipeHandlers}
      style={{
        transform: `translate(${swipeTransformX}px, 0)`,
      }}
      class={`w-screen p-3 cursor-pointer ${
        readSignal.value ? "text-base-content/30" : "text-base-content/80"
      }`}
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
