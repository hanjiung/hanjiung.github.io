---
title: "SHIELD_DOC · 문서 반출 전 민감정보 탐지와 마스킹"
card_title: "SHIELD_DOC"
description: "사내 문서를 반출하기 전 개인정보와 인증정보를 찾아 후속 분석용 사본에서 가립니다."
context: "SK쉴더스 루키즈 1차 모듈 · 7인 팀 · 2026년 8월 기여"
role: "문서 파싱 · 민감정보 탐지·마스킹"
technologies: [Python, 정규표현식, 한국어 NER]
icon: python
result: "시상 분류인 ‘모범팀’은 읽을 수 있게 두고, 실제 부서인 ‘정보보안팀’은 마스킹했습니다."
repository_url: "https://github.com/jaeyong3126/SHIELD_DOC"
example_anchor: masking-result
example_label: "오탐 개선 전후"
featured: true
---

{% include project-toc.html %}

## 내가 한 것

팀 서비스는 사내 문서의 유출 위험과 반출 정책 위반 여부를 점검합니다. 저는 TXT·PDF·DOCX를 텍스트로 읽고, 후속 분석에 쓸 사본에서 민감한 값을 가리는 부분을 맡았습니다. [팀 저장소의 역할 분담](https://github.com/jaeyong3126/SHIELD_DOC#팀-구성)

### 문서 형식에 따라 달라지는 입력

PDF에서 `contact @ example . org`처럼 공백이 끼어 추출되는 이메일을 `contact@example.org`로 복원해 탐지기에 넘겼습니다. DOCX는 본문과 표 안의 텍스트를 함께 읽고, 한글 TXT는 UTF-8과 CP949 인코딩을 처리하도록 구현했습니다. [문서 파서 코드](https://github.com/jaeyong3126/SHIELD_DOC/blob/eee06070d7ce3222384c85d4781135c083090682/tools/parser.py) · [초기 구현 PR](https://github.com/jaeyong3126/SHIELD_DOC/pull/2)

### 민감한 값을 찾고 가리는 과정

전화번호와 이메일은 정규식으로 먼저 가렸습니다. 남은 문장에서는 한국어 개체명 인식(NER)으로 이름을 찾고, 조직명으로 인식된 구간을 부서 판정에 활용했습니다. API 키, 비밀번호, 접근 토큰은 별도로 탐지해 값을 가리고 위험 등급을 기록했습니다. [개체명 인식 연동 PR](https://github.com/jaeyong3126/SHIELD_DOC/pull/12) · [인증정보 마스킹 코드](https://github.com/jaeyong3126/SHIELD_DOC/commit/e5221a6c4724f727fc0cc5ecc12ce1f5c56cb2d9)

### ‘모범팀’까지 가려졌던 이유

초기 규칙은 ‘팀’으로 끝나는 표현을 넓게 잡아 시상 공지의 ‘모범팀’까지 가렸습니다. 추천·시상 문구가 앞에 있는지, 주변에 업무를 나타내는 표현이나 사람·조직명이 있는지 함께 살피도록 부서 판정 조건을 바꿨습니다. [부서명 오탐 개선 PR](https://github.com/jaeyong3126/SHIELD_DOC/pull/15)

## 오탐 개선 전후
{: #masking-result }

같은 두 문장을 수정 전후의 규칙에 넣어 비교했습니다.

| 입력 문장 | 수정 전 | 수정 후 |
| --- | --- | --- |
| 추천 부문: 우수사원, **모범팀**, 혁신아이디어 | `***` | `모범팀` |
| **정보보안팀**에서 문서를 검토했다. | `*****` | `*****` |

<figure>
  <a href="https://github.com/user-attachments/assets/b75b1afd-11c8-46fd-939e-a7fe60f4d068">
    <img src="https://github.com/user-attachments/assets/b75b1afd-11c8-46fd-939e-a7fe60f4d068" width="990" height="398" loading="lazy" alt="팀 서비스의 탐지 결과. 휴대폰 번호, 업무 이메일, 이름, 부서별로 건수와 위험 등급, 마스킹 여부가 표시된다.">
  </a>
  <figcaption>팀 서비스에서 확인한 민감정보 유형별 탐지 결과. <a href="https://github.com/jaeyong3126/SHIELD_DOC/blob/eee06070d7ce3222384c85d4781135c083090682/README.md#L45">실행 화면 출처</a></figcaption>
</figure>

## 느낀 점

시상 공지의 ‘모범팀’이 가려진 문장을 읽어 보니 어떤 부문을 추천하라는 건지 알기 어려웠습니다. 반출 문서의 마스킹 품질을 보려면 **꼭 가려야 할 문장과 읽을 수 있어야 할 문장**을 함께 검토해야 한다는 점을 배웠습니다.

## 개선할 점

다음에는 같은 표현을 시상 공지, 인사 발령, 업무 메일에 각각 넣어 문맥별 회귀 테스트로 남기고 싶습니다. 줄바꿈이 있는 PDF와 표 안에 이메일이 있는 DOCX도 함께 검사해, 값이 누락되면 텍스트 추출과 탐지 중 어느 단계에서 달라졌는지 확인하고 싶습니다.
