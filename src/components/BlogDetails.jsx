import { useEffect, useState } from "react";

export default function BlogDetails({ id }) {
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    async function getData() {
      const response = await fetch(`https://mrdemirtas.pythonanywhere.com/posts/${id}`).then((x) => x.json());
      setBlogData(response);
    }

    getData();
  }, []);
  
  return (
    <div className="blog-details">
      {blogData !== null && (
        <>
        <img src={blogData.imageUrl} />
        <div className="blog-details-body">
          <em>{blogData.created}</em>
          <h1>{blogData.title}</h1>
          <p>{blogData.body}</p>
        </div>
        </>
      )}
    </div>
  );
}
