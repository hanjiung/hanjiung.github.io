---
title: "Are you admin?"
description: "Flask의 요청 처리부터 Jinja 템플릿까지 입력을 따라가며, 소개 문구의 출력 방식이 관리자 화면에 미치는 영향을 분석한 드림핵 풀이입니다."
section: wargames
topic: "Dreamhack · Bronze"
---

**Dreamhack · 웹 보안 · Bronze** · [드림핵에서 문제 보기](https://dreamhack.io/wargame/challenges/1922)

소개 페이지는 이름과 소개 문구를 나란히 보여줍니다. 두 값이 같은 템플릿을 거치는데도 화면에서 다르게 해석된다는 점이 풀이의 출발점이었습니다.

## 풀이 과정

### 입력이 템플릿에 도착하기까지

먼저 `app.py`를 열었습니다. 첫 요청은 `/intro`로 이동하고, `intro()`는 쿼리에서 `name`과 `detail`을 꺼냅니다. 두 값이 화면에 어떻게 표시되는지 확인하려고 마지막 줄에 나온 `intro.html`을 열었습니다.

```python
# app.py
@app.route("/", methods=["GET"])
def index():
    return redirect("/intro")

@app.route("/intro", methods=["GET"])
def intro():
    name = request.args.get("name")
    detail = request.args.get("detail")
    return render_template("intro.html", name=name, detail=detail)
```

### 소개 문구의 두 출력 줄 비교하기

`intro.html`에서 먼저 눈에 띈 건 아래 조건입니다. 둘 중 하나라도 비어 있으면 `Introduce yourself!`가 나옵니다. 두 값을 채우면 소개 문구를 출력하는 쪽으로 들어갑니다. 아래는 원문의 템플릿 구조입니다. `…`는 사용자 값을 출력하는 식이 있는 자리입니다.

{% raw %}

```jinja
<h1>Introduction</h1>
{% if name and detail %}
    <p>Hello, my name is <strong>…</strong>.</p>
    <p>…</p>
{% else %}
    <p>Introduce yourself!</p>
{% endif %}
```

{% endraw %}

그 두 줄은 사용자 입력을 서로 다르게 다뤘습니다. 한쪽은 HTML 특수문자를 이스케이프했고, 다른 쪽은 입력에 포함된 마크업을 브라우저가 해석할 수 있었습니다. `<em>memo</em>`라는 짧은 문구로 두 경우를 비교하면 차이가 보입니다.

| 브라우저가 받은 HTML 조각 | 화면에 보이는 내용 |
| --- | --- |
| `<p>&lt;em&gt;memo&lt;/em&gt;</p>` | `<em>memo</em>` |
| `<p><em>memo</em></p>` | *memo* (기울임꼴) |

### 소개 페이지를 여는 사람의 권한

문제 코드에는 관리자가 사용자 소개 페이지를 열어 보는 흐름이 있었습니다. 이 코드를 보고 앞서 발견한 출력 차이와 연결했습니다. 사용자가 쓴 내용이 코드로 실행되면, 그 코드는 페이지를 연 사람의 권한으로 동작합니다. 관리자만 볼 수 있는 정보도 이 XSS의 영향을 받겠다는 가설을 세웠고, 문제 환경에서 플래그를 확인했습니다.

**플래그**　`[가림]`

## 로컬 검증

풀이 중 따로 메모했던 점은 URL 인코딩과 HTML 이스케이프의 차이였습니다. 아래는 그 차이를 직접 볼 수 있게 공개본에 덧붙인 예제입니다. 같은 문구를 쿼리에 넣을 때, 쿼리에서 다시 꺼낼 때, 템플릿으로 출력할 때의 값을 차례로 찍었습니다.

{% raw %}

```python
from urllib.parse import parse_qs, urlencode

from jinja2 import Environment

query = urlencode({"text": "R&D <em>memo</em>"})
text = parse_qs(query)["text"][0]
view = Environment(autoescape=True).from_string("<p>{{ text }}</p>")

print(query)
print(text)
print(view.render(text=text))
```

{% endraw %}

```text
text=R%26D+%3Cem%3Ememo%3C%2Fem%3E
R&D <em>memo</em>
<p>R&amp;D &lt;em&gt;memo&lt;/em&gt;</p>
```

첫 줄의 `%26`은 쿼리를 읽고 나면 둘째 줄에서 다시 `&`가 됩니다. 셋째 줄의 `&lt;`와 `&gt;`는 브라우저가 꺾쇠를 글자로 표시하게 합니다. 소개 페이지의 문제를 판단할 때 끝까지 따라가야 했던 부분이 바로 이 마지막 출력 단계였습니다.
