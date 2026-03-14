import { useSignal } from "@preact/signals";
import { useSwipeable } from "react-swipeable";
import { toast } from "@/client/toast.ts";

function openInNewTab(url: string) {
  globalThis.open(url)?.focus();
}

function apiRead(id: number, read: boolean): Promise<Response> {
  return fetch("/api/read", {
    method: "POST",
    body: JSON.stringify({ post_id: id, read }),
  });
}

function apiIgnore(id: number, ignore: boolean): Promise<Response> {
  return fetch("/api/ignore", {
    method: "POST",
    body: JSON.stringify({ post_id: id, ignore }),
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
  thumbnail?: string;
  read: boolean;
  ignored: boolean;
  favorite: boolean;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_ACTION = 100;
export default function (props: ArticleProps) {
  const readSignal = useSignal(props.read);
  const ignoredSignal = useSignal(props.ignored);
  const favoriteSignal = useSignal(props.favorite);
  const swipeTransformX = useSignal(0);
  const swipeHandlers = useSwipeable({
    delta: SWIPE_THRESHOLD,
    trackMouse: true,

    onSwiped(_event) {
      swipeTransformX.value = 0;
    },
    onSwipedLeft(event) {
      if (event.absX > SWIPE_ACTION) {
        ignoredSignal.value = true;

        apiIgnore(props.id, true).then(() =>
          toast((dismiss) => (
            <div class="px-3 w-full flex flex-row justify-between items-center bg-base-300 rounded text-sm">
              <h2>Ignored</h2>
              <button
                type="button"
                class="btn btn-sm btn-ghost"
                onClick={() => apiIgnore(props.id, false).then(dismiss)}
              >
                Undo
              </button>
            </div>
          )),
        );
      }
    },
    onSwipedRight(event) {
      if (event.absX > SWIPE_ACTION) {
        favoriteSignal.value = true;

        apiFavorite(props.id, true).then(() =>
          toast((dismiss) => (
            <div class="px-3 w-full flex flex-row justify-between items-center bg-base-300 rounded text-sm">
              <h2>Favorited</h2>
              <button
                type="button"
                class="btn btn-sm btn-ghost"
                onClick={() => apiFavorite(props.id, false).then(dismiss)}
              >
                Undo
              </button>
            </div>
          )),
        );
      }
    },
    onSwipedUp(_event) {},
    onSwipedDown(event) {
      if (event.absY > SWIPE_ACTION) {
        globalThis.location.reload();
      }
    },
    onSwipeStart(_event) {},
    onSwiping(event) {
      // Allow translation if already in motion
      // But to begin, you must be past the threshold
      if (swipeTransformX.value !== 0 || event.absX > SWIPE_THRESHOLD) {
        swipeTransformX.value = event.deltaX;
      }
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
        <figure class="w-12 h-12">
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
