import { toast } from "sonner";

export default function () {
  return (
    <button type="button" class="btn btn-primary" onClick={() => toast("Test")}>
      Toast
    </button>
  );
}
