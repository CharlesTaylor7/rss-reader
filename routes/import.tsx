import { define } from "@/server/define.ts";

export default define.page(function () {
  return (
    <div class="d-flex gap-2 flex-column align-items-start justify-content-center">
      <label class="form-label" for="file-input">
        Import an OPML file to get started
      </label>

      <input
        class="form-control form-control-sm btn btn-info"
        id="file-input"
        required
        type="file"
        name="file"
        accept="text/xml"
        form="upload"
      />

      <form
        id="upload"
        enctype="multipart/form-data"
        action="/api/import"
        method="POST"
      >
        <button type="submit" class="btn btn-primary">
          Upload
        </button>
      </form>
    </div>
  );
});
