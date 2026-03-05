export interface BlogProps {
  id: number;
  title: string;
  xml_url: string;
  html_url: string;
}

const _sync = (props: BlogProps) => {
  fetch(`/api/sync?blogId=${props.id}`, { method: "POST" });
};
const openModal = () => {};

export default function (props: BlogProps) {
  return (
    <div class="flex flex-row justify-between w-screen">
      <a href={props.html_url}>{props.title}</a>
    </div>
  );
}

// TODO: more actions ellipsis something
// <button type="button" class="btn btn-accent btn-sm" onClick={openModal}>
//   Actions
// </button>
