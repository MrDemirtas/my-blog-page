import { useEffect, useState } from "react";

export default function HomePage() {
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await fetch("https://mrdemirtas.pythonanywhere.com/posts").then((x) => x.json());
      setBlogData(response);
    }

    getData();
  }, []);

  return (
    <main>
      <div className="welcome-contents">
        <h1>Blog Sayfama Hoş Geldiniz!</h1>
        <p>Ben Furkan Demirtaş. Bu web uygulamasını React ile geliştirdim.</p>
        <p>Bu web uygulamasında oluşturulan blogları görüntülenebiliyor ve üzerine tıklandığında da blog içeriğine ulaşılabiliyor, admin panel üzerinden ise yeni blog eklenebiliyor, düzenlenebiliyor veya silinebiliyor.</p>
        <strong>Bu web uygulamasında yetkisiz erişimin önüne geçmek için admin panel sayfasında kimlik doğrulama sistemi var!</strong>
      </div>
      <div className="blog-contents">
        {blogData.map((item) => (
          <BlogItem key={item.id} {...item} />
        ))}
      </div>
    </main>
  );
}

function BlogItem({ id, title, summary, imageUrl, created, setDetailsPage }) {
  return (
    <div className="blog-item">
      <img src={imageUrl} />
      <div className="blog-data">
        <em>{created}</em>
        <div className="blog-data-titles">
          <h3>{title}</h3>
          <p>{summary}</p>
        </div>
        <button onClick={() => location.href = `#/blog-detail/${id}`}>Şiiri oku</button>
      </div>
    </div>
  );
}
