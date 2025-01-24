export default function Header({ setEditorPage }) {
  return (
    <header>
      <h2>Furkan Demirtaş Blog</h2>
      <ul>
        <li>
          <a href="#" onClick={() => setEditorPage(false)}>
            Ana Sayfa
          </a>
        </li>
        <li>
          <a href="#" onClick={() => setEditorPage(true)}>
            Editör
          </a>
        </li>
      </ul>
    </header>
  );
}
