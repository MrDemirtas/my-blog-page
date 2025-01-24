import { useRef } from "react";

export default function Editor() {
  const dialogRef = useRef(null);

  return (
    <div className="editor-main">
      <NewBlogModal dialogRef={dialogRef} />
      <button onClick={() => dialogRef.current.showModal()}>+ Yeni Blog Ekle</button>
      <Blogs />
    </div>
  );
}

function NewBlogModal({ dialogRef }) {
  return (
    <dialog ref={dialogRef} className="blog-dialog">
      <form method="dialog">
        <input required type="text" name="title" placeholder="Başlık" />
        <input required type="text" name="summary" placeholder="Alt Başlık" />
        <input required type="text" name="image" placeholder="Resim URL" />
        <textarea required name="body" placeholder="Metin" rows={10}></textarea>
        <button type="button" onClick={() => dialogRef.current.close()}>
          İptal
        </button>
        <button type="submit">Blog Ekle</button>
      </form>
    </dialog>
  );
}

function Blogs() {
  return (
    <div className="editor-blogs-contents">
      <BlogItem />
    </div>
  );
}

function BlogItem() {
  const dialogRef = useRef(null);

  return (
    <>
      <EditBlogModal dialogRef={dialogRef} />
      <div className="editor-blog-item">
        <figure>
          <img src="./image.jpg" />
        </figure>
        <div className="editor-blog-data">
          <div className="editor-blog-titles">
            <h3>Blog Başlık</h3>
            <p>Blog alt başlık</p>
          </div>
          <div className="editor-blog-btns">
            <button onClick={() => dialogRef.current.showModal()}>🖊️ Düzenle</button>
            <button>❌ Sil</button>
          </div>
        </div>
      </div>
    </>
  );
}

function EditBlogModal({ dialogRef }) {
  return (
    <dialog ref={dialogRef} className="blog-dialog">
      <form method="dialog">
        <input required type="text" name="title" placeholder="Başlık" />
        <input required type="text" name="summary" placeholder="Alt Başlık" />
        <input required type="text" name="image" placeholder="Resim URL" />
        <textarea required name="body" placeholder="Metin" rows={10}></textarea>
        <button type="button" onClick={() => dialogRef.current.close()}>
          İptal
        </button>
        <button type="submit">Değişiklikleri Kaydet</button>
      </form>
    </dialog>
  );
}
