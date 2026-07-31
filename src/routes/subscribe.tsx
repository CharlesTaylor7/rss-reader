import { define } from "@/server/define.ts";
import { Subscribe } from "@/islands/Subscribe.tsx";

export default define.page(function () {
  return (
    <div>
      <Subscribe />
    </div>
  );
});
