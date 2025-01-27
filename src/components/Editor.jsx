import { createContext, useContext, useEffect, useRef, useState } from "react";

const Authorization = createContext(null);

export default function Editor() {
  const dialogRef = useRef(null);
  const [blogData, setBlogData] = useState([]);
  const [username, setUsername] = useState(localStorage.username ? localStorage.username : "");
  const [password, setPassword] = useState(localStorage.password ? localStorage.password : "");

  useEffect(() => {
    async function getData() {
      const response = await fetch("https://mrdemirtas.pythonanywhere.com/posts").then((x) => x.json());
      setBlogData(response);
    }

    getData();
    
    if (username.trim() === "" || password.trim() === "") {
      getAuthData();
    }
  }, []);

  function getAuthData() {
    const promptUsername = prompt("Username");
    localStorage.username = promptUsername;
    const promptPassword = prompt("Password");
    localStorage.password = promptPassword;
    
    setUsername(promptUsername);
    setPassword(promptPassword);
  }

  return (
    <div className="editor-main">
      <Authorization.Provider value={{username, password, getAuthData}}>
        <NewBlogModal dialogRef={dialogRef} setBlogData={setBlogData} />
        <h1>Editör</h1>
        <button className="btn green" onClick={() => dialogRef.current.showModal()}>+ Yeni Blog Ekle</button>
        <Blogs blogData={blogData} setBlogData={setBlogData} />
      </Authorization.Provider>
    </div>
  );
}

function NewBlogModal({ dialogRef, setBlogData }) {
  const { username, password, getAuthData } = useContext(Authorization);
  
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
          alert("Yetkisiz Erişim!");
          getAuthData();
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
        <input required type="text" name="title" placeholder="Başlık" />
        <input required type="text" name="summary" placeholder="Alt Başlık" />
        <input required type="text" name="imageUrl" placeholder="Resim URL" />
        <textarea required name="body" placeholder="Metin" rows={10}></textarea>
        <button type="button" className="btn red" onClick={() => dialogRef.current.close()}>
          İptal
        </button>
        <button type="submit" className="btn green">Blog Ekle</button>
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
  const { username, password, getAuthData } = useContext(Authorization);
  const dialogRef = useRef(null);

  async function handleRemove() {
    if (confirm("Emin misin?")) {
      await fetch(`https://mrdemirtas.pythonanywhere.com/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Basic ${btoa(`${username}:${password}`)}`
        },
      }).then(async (x) => {
        if (x.ok) {
          setBlogData((prev) => prev.filter((x) => x.id !== id));
          alert("Blog Silindi!")
        } else {
          if (x.status === 401) {
            alert("Yetkisiz Erişim!");
            getAuthData();
          } else {
            alert("İstek Başarısız!");
          }
        }
      });
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
            <button className="btn orange" onClick={() => dialogRef.current.showModal()}>🖊️ Düzenle</button>
            <button className="btn red" onClick={handleRemove}>🗑️ Sil</button>
          </div>
        </div>
      </div>
    </>
  );
}

function EditBlogModal({ dialogRef, id, title, summary, imageUrl, setBlogData }) {
  const { username, password, getAuthData } = useContext(Authorization);

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
          alert("Yetkisiz Erişim!");
          getAuthData();
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
        <input required type="text" name="title" defaultValue={title} placeholder="Başlık" />
        <input required type="text" name="summary" defaultValue={summary} placeholder="Alt Başlık" />
        <input required type="text" name="imageUrl" defaultValue={imageUrl} placeholder="Resim URL" />
        <button type="button" className="btn red" onClick={() => dialogRef.current.close()}>
          İptal
        </button>
        <button type="submit" className="btn green">Değişiklikleri Kaydet</button>
      </form>
    </dialog>
  );
}
