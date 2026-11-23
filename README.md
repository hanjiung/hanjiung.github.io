# hanjiung.app

GitHub Pages와 Jekyll로 운영하는 한지웅의 모의해킹 포트폴리오입니다. 하단 메뉴에서 About, Skills, Projects, Activity 창을 열 수 있습니다. Blog는 티스토리 [우당탕탕 보안일기](https://jiung02.tistory.com/)로, GitHub는 [한지웅의 공개 프로필](https://github.com/hanjiung)로 연결됩니다.

## 파일 구성

| 경로 | 용도 |
| --- | --- |
| `_layouts/desktop.html` | 소개와 앱별 창 |
| `_projects/` | 보안 프로젝트 글 |
| `_templates/project.md` | 프로젝트 글 양식 |
| `_config.yml` | 사이트 정보와 티스토리 주소(`blog_url`) |
| `_data/sections.yml` | 메뉴 이름과 경로 |
| `_data/skills.yml` | Skills 창의 기술 이름, 아이콘, 공식 자료 링크 |
| `_data/activities.yml` | 날짜순 활동·교육 기록 |
| `assets/css/main.css` | 사이트 스타일 |

프로젝트를 추가할 때 `_templates/project.md`를 `_projects/`에 복사하고 파일명과 제목을 정합니다. 모든 프로젝트 글에는 **내가 한 것**, **느낀 점**, **개선할 점**을 작성합니다. `featured: true`인 글은 Projects.app의 ‘대표 프로젝트’에 표시됩니다.

카드에는 `card_title`, 한 문장 설명(`description`), 역할(`role`)이 표시됩니다. 상세 글 첫 화면에는 팀과 기간(`context`), 사용 기술 목록(`technologies`), 대표 결과(`result`)를 담습니다. 카드에서 본문 사례로 바로 연결하려면 `example_anchor`에 해당 소제목의 ID를, `example_label`에 링크 이름을 적습니다.

Activity에는 교육·스터디·발표·팀 활동을 기록합니다. `_data/activities.yml`에 활동한 달과 이름을 적고, 맡은 역할이나 완성한 결과를 한 문장으로 덧붙입니다. 발표 자료나 팀 역할표처럼 그 활동을 확인할 수 있는 링크가 있으면 함께 넣습니다. 화면에는 최신 활동부터 표시됩니다.

CTF와 워게임 풀이는 티스토리에 작성합니다. 예전에 공유한 포트폴리오의 풀이 주소도 블로그로 연결됩니다.

## 로컬에서 보기

Ruby와 Bundler가 설치된 환경에서 아래 명령을 실행하고 브라우저로 `http://localhost:4000`을 엽니다.

```sh
bundle install
bundle exec jekyll serve
```

## GitHub Pages에 올릴 때

`hanjiung.github.io` 저장소의 `main` 브랜치 최상위에 이 폴더의 파일을 넣습니다. GitHub의 **Settings → Pages → Build and deployment**에서 **Deploy from a branch**, **main**, **/(root)**를 선택합니다.
