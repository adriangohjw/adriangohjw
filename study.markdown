---
layout: default
title: Study
permalink: /study
---

<div class="home">
  {%- if page.title -%}
    <h1 class="page-heading">{{ page.title }}</h1>
  {%- endif -%}

  {% if site.paginate %}
    {% assign studies = paginator.studies | sort: 'path' | reverse %}
  {% else %}
    {% assign studies = site.studies | sort: 'path' | reverse %}
  {% endif %}

  {%- if studies.size > 0 -%}
    <ul class="post-list">
      {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
      {%- for study in studies -%}
      <li>
        <span class="post-meta">{{ study.date | date: date_format }}</span>
        <h2>
          <a class="post-link" href="{{ study.url | relative_url }}">
            {{ study.title | escape }}
          </a>
        </h2>
        {%- if site.show_excerpts -%}
          {{ study.excerpt }}
        {%- endif -%}
        {% for tag in study.tags %}
          <code>{{ tag }}</code>
        {% endfor %}
      </li>
      {%- endfor -%}
    </ul>

    {% if site.paginate %}
      <div class="pager">
        <ul class="pagination">
        {%- if paginator.previous_page %}
          <li><a href="{{ paginator.previous_page_path | relative_url }}" class="previous-page">{{ paginator.previous_page }}</a></li>
        {%- else %}
          <li><div class="pager-edge">•</div></li>
        {%- endif %}
          <li><div class="current-page">{{ paginator.page }}</div></li>
        {%- if paginator.next_page %}
          <li><a href="{{ paginator.next_page_path | relative_url }}" class="next-page">{{ paginator.next_page }}</a></li>
        {%- else %}
          <li><div class="pager-edge">•</div></li>
        {%- endif %}
        </ul>
      </div>
    {%- endif %}

  {%- endif -%}

</div>