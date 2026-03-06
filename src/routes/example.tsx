import DndList from "../islands/DndList.tsx";
import ToastButton from "../islands/ToastButton.tsx";
import { define } from "../server/define.ts";

export default define.page(function () {
  return (
    <div>
      <ToastButton />
      <DndList />
    </div>
  );
});
