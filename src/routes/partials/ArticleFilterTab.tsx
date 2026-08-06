import { View } from "@/routes/articles.tsx";
import { Partial } from "fresh/runtime";
import { ReactNode } from "preact/compat";

interface Props {
  view: View;
}

export default function (props: Props) {
  const { view } = props;
  return (
    <div class="tabs">
      <Tab view="default" active={view}>Unread</Tab>
      <Tab view="favorite" active={view}>Favorite</Tab>
      <Tab view="read" active={view}>Read</Tab>
    </div>
  );
}
interface TabProps {
  children: ReactNode;
  active: View;
  view: View;
}
function Tab(props: TabProps) {
  return (
    <a
      role="tab"
      href={`?view=${props.view}`}
      class={`tab ${props.active === props.view ? "tab-active" : ""}`}
    >
      {props.children}
    </a>
  );
}
