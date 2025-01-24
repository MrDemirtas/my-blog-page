import { useEffect, useState } from "react";

export default function HomePage({ setDetailsPage }) {
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
      <div className="blog-contents">
        {blogData.map((item) => (
          <BlogItem key={item.id} {...item} setDetailsPage={setDetailsPage} />
        ))}
      </div>
    </main>
  );
}

function BlogItem({ id, title, summary, imageUrl, created, setDetailsPage }) {
  return (
    <div className="blog-item" onClick={() => setDetailsPage(id)}>
      <figure>
        <img src={imageUrl} />
      </figure>
      <div className="blog-data">
        <div className="blog-data-titles">
          <h3>{title}</h3>
          <p>{summary}</p>
        </div>
        <em>{created} tarihinde oluşturuldu.</em>
      </div>
    </div>
  );
}
