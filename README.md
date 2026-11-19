# hanjiung.github.io

GitHub Pages와 Jekyll로 운영하는 데스크톱형 모의해킹 포트폴리오입니다. 홈의 폴더와 하단 메뉴에서 보안 프로젝트와 CTF·워게임 기록을 열 수 있습니다.

## 파일 구성

| 경로 | 용도 |
| --- | --- |
| `_layouts/desktop.html` | 홈과 자료 목록 창 |
| `_projects/` | 보안 프로젝트 글 |
| `_writeups/` | CTF·워게임 글 |
| `_templates/` | 프로젝트, CTF 라이트업, 워게임 학습 회고의 빈 양식 |
| `_data/sections.yml` | 메뉴 이름과 경로 |
| `assets/css/main.css` | 사이트 스타일 |

글을 추가할 때 `_templates/`의 양식을 해당 글 폴더로 복사하고 파일명과 맨 위의 `title`을 채웁니다. 프로젝트에 `featured: true`를 지정하면 홈에 최대 세 개가 표시됩니다. CTF·워게임 글은 `topic`에 적은 분야별로 묶입니다.

## 로컬에서 보기

Ruby와 Bundler가 설치된 환경에서 아래 명령을 실행하고 브라우저로 `http://localhost:4000`을 엽니다.

```sh
bundle install
bundle exec jekyll serve
```

## GitHub Pages에 올릴 때

`hanjiung.github.io` 저장소의 `main` 브랜치 최상위에 이 폴더의 파일을 넣습니다. GitHub의 **Settings → Pages → Build and deployment**에서 **Deploy from a branch**, **main**, **/(root)**를 선택합니다.
