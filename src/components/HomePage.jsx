export default function HomePage() {
  return (
    <main>
      <div className="blog-contents">
        <BlogItem />
      </div>
    </main>
  );
}

function BlogItem() {
  return (
    <div className="blog-item">
      <figure>
        <img src="./image.jpg" />
      </figure>
      <div className="blog-data">
        <h3>İlk Blog</h3>
        <p>İlk blog yazım</p>
      </div>
    </div>
  );
}
