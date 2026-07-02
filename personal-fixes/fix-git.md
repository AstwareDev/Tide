Claude Code Fix Git Repository connection with folder prompt

```xml
My local folder's git history has diverged from its GitHub remote, so Cursor doesn't recognize it as the existing repo and tries to create a new branch/repo instead. Fix it: cd into the folder, run git fetch origin, compare git log --oneline -5 (local) vs git log --oneline origin/main -5 (remote). If local main has no shared history with origin/main (or only throwaway commits), confirm with me then run git reset --hard origin/main && git branch --set-upstream-to=origin/main main. Verify with git status and git log --oneline -5. If local has real uncommitted work worth keeping, don't reset — ask me and merge instead. If origin isn't set up yet, git init + git remote add origin <repo-url> first.

Folder: <FOLDER_PATH>
Repo: <org>/<repo>
```