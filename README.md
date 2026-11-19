# hanjiung.app

GitHub Pages와 Jekyll로 운영하는 한지웅의 모의해킹 포트폴리오입니다. 하단 독에서 소개, 기술 스택, 프로젝트, CTF, 워게임, 활동 창을 엽니다.

## 파일 구성

| 경로 | 용도 |
| --- | --- |
| `_layouts/desktop.html` | 소개와 앱별 창 |
| `_projects/` | 보안 프로젝트 글 |
| `_writeups/` | CTF·워게임 글 |
| `_templates/` | 프로젝트, CTF 라이트업, 워게임 학습 회고의 빈 양식 |
| `_data/sections.yml` | 메뉴 이름과 경로 |
| `_data/skills.yml` | Skills 창의 기술 이름, 아이콘, 공식 자료 링크 |
| `_data/activities.yml` | 날짜순 활동·교육 기록 |
| `assets/css/main.css` | 사이트 스타일 |

프로젝트를 추가할 때 `_templates/project.md`를 `_projects/`에 복사하고 파일명과 제목을 정합니다. `featured: true`인 글은 Projects.app의 ‘대표 프로젝트’에 표시됩니다.

CTF와 워게임 양식에는 각각 `section: ctf`와 `section: wargames`가 지정되어 있습니다. `_writeups/`에 저장한 글은 해당 창에서 `topic`별로 묶입니다. `/writeups/`에서는 분류가 없는 기존 글까지 모두 볼 수 있습니다.

## 로컬에서 보기

Ruby와 Bundler가 설치된 환경에서 아래 명령을 실행하고 브라우저로 `http://localhost:4000`을 엽니다.

```sh
bundle install
bundle exec jekyll serve
```

## GitHub Pages에 올릴 때

`hanjiung.github.io` 저장소의 `main` 브랜치 최상위에 이 폴더의 파일을 넣습니다. GitHub의 **Settings → Pages → Build and deployment**에서 **Deploy from a branch**, **main**, **/(root)**를 선택합니다.
