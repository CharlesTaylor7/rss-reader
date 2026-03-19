import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  url: string;
};

export function Subscribe() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) =>
    fetch("/api/subscribe", {
      method: "POST",
      body: new URLSearchParams(data),
    });

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
