---
title: "SHIELD_DOC · 문서 반출 전 민감정보 탐지와 마스킹"
description: "TXT·PDF·DOCX에서 개인정보와 인증정보를 찾아 가리고, 실제 부서명과 시상 분류를 문맥으로 구분했습니다."
repository_url: "https://github.com/jaeyong3126/SHIELD_DOC"
featured: true
---

**SK쉴더스 루키즈 1차 모듈 프로젝트** · 7인 팀 · 2026년 8월 기여

SHIELD_DOC은 사내 문서를 외부로 보내기 전에 정보 유출 위험과 반출 정책 위반 여부를 점검하는 서비스입니다. 저는 문서에서 텍스트를 추출하고, 후속 분석에 전달할 사본에서 개인정보와 인증정보를 가리는 기능을 구현했습니다. [팀 저장소와 역할 분담](https://github.com/jaeyong3126/SHIELD_DOC#팀-구성)

<figure>
  <a href="https://github.com/user-attachments/assets/b75b1afd-11c8-46fd-939e-a7fe60f4d068">
    <img src="https://github.com/user-attachments/assets/b75b1afd-11c8-46fd-939e-a7fe60f4d068" width="990" height="398" alt="팀 서비스의 개인정보 탐지 결과. 휴대폰 번호, 업무 이메일, 이름, 부서별로 탐지 건수와 위험 등급, 마스킹 여부가 표시된다.">
  </a>
  <figcaption>제가 맡은 탐지 모듈의 출력을 팀 서비스에서 확인하는 화면입니다. <a href="https://github.com/jaeyong3126/SHIELD_DOC/blob/eee06070d7ce3222384c85d4781135c083090682/README.md#L45">팀 README의 실행 결과</a></figcaption>
</figure>

## 문서 형식에 따라 달라지는 입력

PDF에서 이메일 하나를 추출해도 `contact @ example . org`처럼 공백이 끼면 주소를 통째로 찾기 어렵습니다. PDF 파서에서 이를 `contact@example.org`로 복원한 뒤 탐지기에 넘기도록 했습니다. DOCX는 본문과 표 안의 텍스트를 함께 읽고, 한글 TXT는 UTF-8과 CP949 인코딩을 처리하도록 구현했습니다. [문서 파서 코드](https://github.com/jaeyong3126/SHIELD_DOC/blob/eee06070d7ce3222384c85d4781135c083090682/tools/parser.py) · [초기 구현 PR #2](https://github.com/jaeyong3126/SHIELD_DOC/pull/2)

## 민감한 값을 찾고 가리는 과정

전화번호와 이메일처럼 형태가 일정한 값은 정규식으로 먼저 마스킹했습니다. 남은 문장에는 한국어 개체명 인식(NER)을 적용해 사람 이름을 찾았습니다. 모델이 조직명으로 인식한 구간은 부서 후보를 판단할 때 근거로 활용했습니다. API 키, 비밀번호, 접근 토큰은 별도 탐지 단계에서 찾아 값을 가리고 위험 등급을 기록했습니다. [개체명 인식 연동 PR #12](https://github.com/jaeyong3126/SHIELD_DOC/pull/12) · [인증정보 마스킹 구현](https://github.com/jaeyong3126/SHIELD_DOC/commit/e5221a6c4724f727fc0cc5ecc12ce1f5c56cb2d9)

## ‘모범팀’까지 가려졌던 이유

초기 규칙은 시상 공지에 적힌 ‘모범팀’을 부서명으로 판정해 가렸습니다. 실제 부서인 ‘정보보안팀’도 ‘팀’으로 끝나므로 두 표현을 구분할 근거를 문맥에서 찾았습니다. 추천·시상 문구가 앞에 있는지, 주변에 업무를 나타내는 표현이나 사람·조직명이 있는지를 부서 판정에 함께 반영했습니다. [부서명 오탐 개선 PR #15](https://github.com/jaeyong3126/SHIELD_DOC/pull/15)

아래는 수정 전후의 부서 판정·마스킹 규칙에 같은 문장을 입력한 결과입니다. 굵게 표시한 단어가 어떻게 출력되는지 비교했습니다.

| 입력 문장 | 수정 전 | 수정 후 |
| --- | --- | --- |
| 추천 부문: 우수사원, **모범팀**, 혁신아이디어 | `***` | `모범팀` |
| **정보보안팀**에서 문서를 검토했다. | `*****` | `*****` |
