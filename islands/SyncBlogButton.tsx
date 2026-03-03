interface Props {
  blogId: number;
}
export default function (props: Props) {
  return (
    <button
      type="button"
      class="btn btn-primary"
      onClick={() =>
        fetch(`/api/sync?blogId=${props.blogId}`, { method: "POST" })
      }
    >
      Sync
    </button>
  );
}
