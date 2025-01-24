import { useEffect, useRef, useState } from "react";

export default function Editor() {
  const dialogRef = useRef(null);
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await fetch("https://mrdemirtas.pythonanywhere.com/posts").then((x) => x.json());
      setBlogData(response);
    }

    getData();
  }, []);

  return (
    <div className="editor-main">
      <NewBlogModal dialogRef={dialogRef} setBlogData={setBlogData} />
      <button onClick={() => dialogRef.current.showModal()}>+ Yeni Blog Ekle</button>
      <Blogs blogData={blogData} setBlogData={setBlogData} />
    </div>
  );
}

function NewBlogModal({ dialogRef, setBlogData }) {
  async function handleSubmit(e) {
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const response = await fetch("https://mrdemirtas.pythonanywhere.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formObj),
    }).then((x) => x.json());
    setBlogData((prev) => [...prev, response]);
    e.target.reset();
  }

  return (
    <dialog ref={dialogRef} className="blog-dialog">
      <form method="dialog" onSubmit={handleSubmit} autoComplete="off">
        <input required type="text" name="title" placeholder="Başlık" />
        <input required type="text" name="summary" placeholder="Alt Başlık" />
        <input required type="text" name="imageUrl" placeholder="Resim URL" />
        <textarea required name="body" placeholder="Metin" rows={10}></textarea>
        <button type="button" onClick={() => dialogRef.current.close()}>
          İptal
        </button>
        <button type="submit">Blog Ekle</button>
      </form>
    </dialog>
  );
}

function Blogs({ blogData, setBlogData }) {
  return (
    <div className="editor-blogs-contents">
      {blogData.map((item) => (
        <BlogItem key={item.id} {...item} setBlogData={setBlogData} />
      ))}
    </div>
  );
}

function BlogItem({ id, title, summary, imageUrl, setBlogData }) {
  const dialogRef = useRef(null);

  async function handleRemove() {
    if (confirm("Emin misin?")) {
      const response = await fetch(`https://mrdemirtas.pythonanywhere.com/posts/${id}`, {
        method: "DELETE",
      }).then((x) => x.json());
      setBlogData((prev) => prev.filter((x) => x.id !== id));
    }
  }

  return (
    <>
      <EditBlogModal
        dialogRef={dialogRef}
        id={id}
        title={title}
        summary={summary}
        imageUrl={imageUrl}
        setBlogData={setBlogData}
      />
      <div className="editor-blog-item">
        <figure>
          <img src={imageUrl} />
        </figure>
        <div className="editor-blog-data">
          <div className="editor-blog-titles">
            <h3>{title}</h3>
            <p>{summary}</p>
          </div>
          <div className="editor-blog-btns">
            <button onClick={() => dialogRef.current.showModal()}>🖊️ Düzenle</button>
            <button onClick={handleRemove}>❌ Sil</button>
          </div>
        </div>
      </div>
    </>
  );
}

function EditBlogModal({ dialogRef, id, title, summary, imageUrl, setBlogData }) {
  async function handleSubmit(e) {
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const response = await fetch(`https://mrdemirtas.pythonanywhere.com/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formObj),
    }).then((x) => x.json());
    setBlogData((prev) => {
      prev[prev.findIndex((x) => x.id === id)] = response;
      return [...prev];
    });
  }

  return (
    <dialog ref={dialogRef} className="blog-dialog">
      <form method="dialog" onSubmit={handleSubmit} autoComplete="off">
        <input required type="text" name="title" defaultValue={title} placeholder="Başlık" />
        <input required type="text" name="summary" defaultValue={summary} placeholder="Alt Başlık" />
        <input required type="text" name="imageUrl" defaultValue={imageUrl} placeholder="Resim URL" />
        <button type="button" onClick={() => dialogRef.current.close()}>
          İptal
        </button>
        <button type="submit">Değişiklikleri Kaydet</button>
      </form>
    </dialog>
  );
}
