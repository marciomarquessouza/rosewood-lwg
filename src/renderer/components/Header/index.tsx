export function Header() {
  return (
    <header className="p-6 flex flex-row justify-between">
      <div>
        <h1 className="font-josefin text-3xl font-bold">
          ROSEWOOD -{" "}
          <span className=" text-rosewood-accent">CONTENT MANAGER</span>
        </h1>
        <p className=" font-light text-sm">
          Learning with Ghosts ◆ Lesson Day Editor
        </p>
      </div>
      <div>
        <button className=" bg-rosewood-ink text-rosewood-bg p-2 text-sm">
          DASHBOARD ◆
        </button>
      </div>
    </header>
  );
}
