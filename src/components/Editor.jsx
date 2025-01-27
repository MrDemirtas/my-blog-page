import { createContext, useContext, useEffect, useRef, useState } from "react";

const Authorization = createContext(null);

export default function Editor() {
  const dialogRef = useRef(null);
  const authLoginDialogRef = useRef(null);
  const alertDialogRef = useRef(null);
  const [blogData, setBlogData] = useState([]);
  const [username, setUsername] = useState(localStorage.username ?? "");
  const [password, setPassword] = useState(localStorage.password ?? "");

  useEffect(() => {
    async function getData() {
      const response = await fetch("https://mrdemirtas.pythonanywhere.com/posts").then((x) => x.json());
      setBlogData(response);
    }

    getData();
    
    if (username.trim() === "" || password.trim() === "") {
      authLoginDialogRef.current.showModal();
    }
  }, []);

  function updateAuthData(newUsername, newPass) {
    localStorage.username = newUsername;
    localStorage.password = newPass;
    setUsername(newUsername);
    setPassword(newPass);
  }

  return (
    <div className="editor-main">
      <AlertModal alertDialogRef={alertDialogRef} />
      <Authorization.Provider value={{username, password, updateAuthData, alertDialogRef}}>
        <AuthLoginDialog authLoginDialogRef={authLoginDialogRef} />
        <NewBlogModal dialogRef={dialogRef} setBlogData={setBlogData} />
        <div className="editor-header">
          <h1>Admin Panel</h1>
          <div className="auth-data">
            {username && <span>{username}</span>}
            <button className="btn green" onClick={() => authLoginDialogRef.current.showModal()}>🔑 Kimlik Doğrulama Giriş</button>
          </div>
        </div>
        <button className="btn green" onClick={() => dialogRef.current.showModal()}>+ Yeni Blog Ekle</button>
        <Blogs blogData={blogData} setBlogData={setBlogData} />
      </Authorization.Provider>
    </div>
  );
}

function AuthLoginDialog({authLoginDialogRef}) {
  const { updateAuthData } = useContext(Authorization);

  function handleSubmit(e) {
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    updateAuthData(formObj.username, formObj.password);
    e.target.reset();
  }
  
  return (
    <dialog ref={authLoginDialogRef} className="blog-dialog auth">
      <h2>Kimlik Doğrulama</h2>
      <form method="dialog" autoComplete="off" onSubmit={handleSubmit}>
        <label>
          <span>Kullanıcı Adı</span>
          <input type="text" name="username" />
        </label>
        <label>
          <span>Şifre</span>
          <input type="password" name="password" />
        </label>
        <div className="btn-group">
          <button type="button" className="btn red" onClick={() => authLoginDialogRef.current.close()}>İptal</button>
          <button type="submit" className="btn green">Kaydet</button>
        </div>
      </form>
    </dialog>
  )
}

function NewBlogModal({ dialogRef, setBlogData }) {
  const { username, password, alertDialogRef } = useContext(Authorization);
  
  async function handleSubmit(e) {
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    await fetch("https://mrdemirtas.pythonanywhere.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${username}:${password}`)}`
      },
      body: JSON.stringify(formObj),
    }).then(async (x) => {
      if (x.ok) {
        const response = await x.json()
        setBlogData((prev) => [response, ...prev]);
      } else {
        if (x.status === 401) {
          alertDialogRef.current.showModal();
        } else {
          alert("İstek Başarısız!");
        }
      }
    });

    e.target.reset();
  }

  return (
    <dialog ref={dialogRef} className="blog-dialog">
      <h2>Yeni Blog Oluştur</h2>
      <form method="dialog" onSubmit={handleSubmit} autoComplete="off">
        <label>
          <span>Başlık</span>
          <input required type="text" name="title" placeholder="Başlık" />
        </label>
        <label>
          <span>Alt Başlık</span>
          <input required type="text" name="summary" placeholder="Alt Başlık" />
        </label>
        <label>
          <span>Resim URL</span>
          <input required type="text" name="imageUrl" placeholder="Resim URL" />
        </label>
        <label>
          <span>Metin</span>
          <textarea required name="body" placeholder="Metin" rows={10}></textarea>
        </label>
        <div className="btn-group">
          <button type="button" className="btn red" onClick={() => dialogRef.current.close()}>
            İptal
          </button>
          <button type="submit" className="btn green">Blog Ekle</button>
        </div>
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
  const removeDialogRef = useRef(null);

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
      <DeleteModal removeDialogRef={removeDialogRef} id={id} setBlogData={setBlogData} />
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
            <button className="btn orange" onClick={() => dialogRef.current.showModal()}>🖊️ Düzenle</button>
            <button className="btn red" onClick={() => removeDialogRef.current.showModal()}>🗑️ Sil</button>
          </div>
        </div>
      </div>
    </>
  );
}

function EditBlogModal({ dialogRef, id, title, summary, imageUrl, setBlogData }) {
  const { username, password, alertDialogRef } = useContext(Authorization);

  async function handleSubmit(e) {
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    await fetch(`https://mrdemirtas.pythonanywhere.com/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${username}:${password}`)}`
      },
      body: JSON.stringify(formObj),
    }).then(async (x) => {
      if (x.ok) {
        const response = await x.json()
        setBlogData((prev) => {
          prev[prev.findIndex((x) => x.id === id)] = response;
          return [...prev];
        });
      } else {
        if (x.status === 401) {
          alertDialogRef.current.showModal();
        } else {
          alert("İstek Başarısız!");
        }
      }
    });
  }

  return (
    <dialog ref={dialogRef} className="blog-dialog">
      <h2>Blog Düzenleme</h2>
      <form method="dialog" onSubmit={handleSubmit} autoComplete="off">
        <label>
          <span>Başlık</span>
          <input required type="text" name="title" defaultValue={title} placeholder="Başlık" />
        </label>
        <label>
          <span>Alt Başlık</span>
          <input required type="text" name="summary" defaultValue={summary} placeholder="Alt Başlık" />
        </label>
        <label>
          <span>Resim URL</span>
          <input required type="text" name="imageUrl" defaultValue={imageUrl} placeholder="Resim URL" />
        </label>
        <div className="btn-group">
          <button type="button" className="btn red" onClick={() => dialogRef.current.close()}>
            İptal
          </button>
          <button type="submit" className="btn green">Değişiklikleri Kaydet</button>
        </div>
      </form>
    </dialog>
  );
}

function AlertModal({alertDialogRef}) {
  return (
    <dialog ref={alertDialogRef} className="blog-dialog alert">
      <div className="alert-contents">
        <span>❌</span>
        <h3>Yetkisiz Erişim!</h3>
        <p>Kimlik doğrulama girişi yapınız!</p>
        <p><button className="btn red" onClick={() => alertDialogRef.current.close()}>Tamam</button></p>
      </div>
    </dialog>
  );
}

function DeleteModal({ removeDialogRef, id, setBlogData }) {
  const { username, password, alertDialogRef } = useContext(Authorization);

  async function handleRemove() {
    await fetch(`https://mrdemirtas.pythonanywhere.com/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Basic ${btoa(`${username}:${password}`)}`
      },
    }).then(async (x) => {
      if (x.ok) {
        setBlogData((prev) => prev.filter((x) => x.id !== id));
      } else {
        if (x.status === 401) {
          alertDialogRef.current.showModal();
        } else {
          alert("İstek Başarısız!");
        }
      }
    });
    removeDialogRef.current.close();
  }

  return (
    <dialog ref={removeDialogRef} className="blog-dialog remove">
      <div className="alert-contents">
        <h3>Silmeyi Onayla</h3>
        <p>Bu işlem geri alınamaz!</p>
        <div className="btn-group">
          <button className="btn orange" onClick={() => removeDialogRef.current.close()}>İptal</button>
          <button className="btn red" onClick={handleRemove}>Onayla</button>
        </div>
      </div>
    </dialog>
  );
}