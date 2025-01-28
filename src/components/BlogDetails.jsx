import { useEffect, useState } from "react";

import { marked } from "marked";

export default function BlogDetails() {
  const id = location.hash.split("/").at(-1);
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
            <p dangerouslySetInnerHTML={{ __html: marked.parse(blogData.body)}} />
          </div>
        </>
      )}
    </div>
  );
}
