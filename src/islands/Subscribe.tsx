import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "@/client/toast.ts";

type Inputs = {
  url: string;
};

export function Subscribe() {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        body: new URLSearchParams(data),
      });
      toast(() => "Subscribed");
    } catch (e) {
      const err = e as Error;
      toast(() => err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Url</label>
        <input type="url" {...register("url")} />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
}
