interface Props {
  blogId: number;
}
export default function (props: Props) {
  const onClick = () => {
    console.log("click");
    fetch(`/api/sync?blogId=${props.blogId}`, { method: "POST" });
  };
  return (
    <button type="button" class="btn btn-primary" onClick={onClick}>
      Sync
    </button>
  );
}
