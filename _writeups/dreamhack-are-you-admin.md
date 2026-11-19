---
title: "Are you admin?"
description: "코드를 읽으며 찾은 취약점과 가설을 정리해 보도록 하겠다."
section: wargames
topic: "Dreamhack · Bronze"
---

## 코드 분석

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

- `/` 엔드포인트
  - `/intro` 엔드포인트로 리다이렉트함.
- `/intro` 엔드포인트
  - get 방식으로 name과 detail 파라미터를 받고 `intro.html`을 랜더링

{% raw %}

```jinja
<!-- intro.html body 부분 -->
<body>
    <div class="container">
        <h1>Introduction</h1>
        {% if name and detail %}
            <p>Hello, my name is <strong>[가림]</strong>.</p>
            <p>{{ detail }}</p>
        {% else %}
            <p>Introduce yourself!</p>
        {% endif %}
    </div>
</body>
```

- [가림]
  - [가림] 옵션은 html 특수문자를 이스케이프 하지 않고 출력함, 즉 html을 해석함
- `{{ detail }}`
  - html 특수문자를 이스케이프함, 즉 단순 문자열로 출력함

{% endraw %}

```python
# app.py
# [가림]
    if request.method == "POST":
        path = request.form.get("path")
        if not path:
            return render_template("[가림]", msg="fail")

        else:
            parsed_path = urlparse(path)
            params = parse_qs(parsed_path.query)
            name = params.get("name", [None])[0]
            detail = params.get("detail", [None])[0]

            # [가림]
    else:
        return render_template("[가림]")

# [가림]
    try:
        # [가림]
        service = Service(executable_path="/chromedriver-linux64/chromedriver")
        options = webdriver.ChromeOptions()
        for _ in [
            "headless",
            "window-size=1920x1080",
            "disable-gpu",
            # [가림]
            "disable-dev-shm-usage",
        ]:
            options.add_argument(_)
        driver = webdriver.Chrome(service=service, options=options)
        driver.implicitly_wait(3)
        driver.set_page_load_timeout(3)
        # [가림]
    except Exception as e:
        print(e, flush=True)
        driver.quit()
        return False
    driver.quit()
    return True
```

- [가림] 엔드포인트
  - POST 방식으로 path를 받고 path에서 name과 detail 변수를 추출
  - [가림]

```python
# app.py
# [가림]
    else:
        message = "You are guest"
        return render_template('[가림]',id=id, message=message)
```

- [가림]엔드포인트
  - [가림] admin계정과 일치하다면 FLAG를 포함한 HTML을 반환, 아니라면 guest 반환

---

## 공격 벡터 분석

코드를 읽으며 찾은 취약점과 가설을 정리해 보도록 하겠다.

1. [가림] 헤더를 가진 사용자에게만 FLAG를 반환해 출력해줌
2. [가림] →<mark> XSS를 유도하는 거 같음</mark>
3. `intro.html`을 보면 [가림] 해당 옵션은 html을 그대로 실행해줌 → [가림]
4. [가림]

---

## 익스플로잇

### &lt;script&gt; 작성

1. [가림]
2. fetch()는 비동기 작업이기에 promise 반환→ .then() 을 사용해 response를 가져옴
3. 위에서 사용할 response.text() 또한 비동기 작업이기에 .then()을 사용해 response.text()의 값을 html에 저장
4. [가림]
5. 여기서 html을 그대로 url에 포함시킬 시 특수문자로 인해 제대로 전달이 되지 않기에 [가림]

아래는 위의 단계를 정리한 코드이다.

> [공격 코드 가림]

### payload 작성

[가림] 특수문자들로 인해 제대로 전달이 되지 않음

→ 문제에서 사용한 `quote` 사용

→ `quote`함수에서 safe 옵션이 존재하는데 기본값이 `safe=’/’` 라서 ‘/’를 인코딩하지 않음

→ [가림]

```python
from urllib.parse import quote
import requests

# [가림]

try:
    ...  # [가림]
except Exception as e:
    print('요청 실패')
```

<figure>
  <img src="{{ '/assets/writeups/are-you-admin/webhook-result.png' | relative_url }}" width="1134" height="730" alt="웹훅에 기록된 HTML 응답. 식별 정보와 플래그는 가림." loading="lazy">
  <figcaption>웹훅 결과</figcaption>
</figure>

문제를 풀고 나서 알게된 사실은 [가림] 바로 플래그를 확인할 수 있었다..
