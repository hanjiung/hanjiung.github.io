---
layout: default
title: 전체 풀이
section: writeups
---
<article class="window reader" aria-labelledby="archive-title">
  <header class="titlebar reader-bar">
    <a href="{{ '/' | relative_url }}"><span aria-hidden="true">←</span> 소개</a>
  </header>
  <div class="reader-body">
    <h1 id="archive-title">전체 풀이</h1>
    <nav class="about-links" aria-label="풀이 종류">
      <a href="{{ '/ctf/' | relative_url }}">CTF 풀이</a>
      <a href="{{ '/wargames/' | relative_url }}">워게임 노트</a>
    </nav>
    {% assign entries = site.writeups | sort: 'title' %}
    {% if entries.size > 0 %}
      {% include writeup-groups.html entries=entries %}
    {% else %}
      <p>아직 공개한 풀이가 없습니다.</p>
    {% endif %}
  </div>
</article>
