from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
out = root / "_site"
if out.exists():
    shutil.rmtree(out)
out.mkdir()
for name in ("style.css", "animation.js"):
    shutil.copy2(root / name, out / name)
shutil.copy2(root / "index.html", out / "animation.html")
for name in ("assets", "game"):
    shutil.copytree(root / name, out / name, ignore=shutil.ignore_patterns("*.test.cjs", "*.svg", "*.ai", "*.psd"))
(out / "index.html").write_text('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=game/"><title>纹归</title><a href="game/">进入纹归游戏</a></html>', encoding="utf-8")
(out / ".nojekyll").touch()
assert not any(p.suffix.lower() in {".svg", ".ai", ".psd"} for p in out.rglob("*"))
print("Prepared GitHub Pages: game at /game/, animation at /animation.html")
