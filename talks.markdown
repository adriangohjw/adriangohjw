---
layout: default
title: Talks
permalink: /talks
---

<div class="home">
  {%- if page.title -%}
    <h1 class="page-heading">{{ page.title }}</h1>
  {%- endif -%}


  {% if site.paginate %}
    {% assign talks = paginator.talks | sort: 'path' | reverse %}
  {% else %}
    {% assign talks = site.talks | sort: 'path' | reverse %}
  {% endif %}


  {%- if talks.size > 0 -%}
    <ul class="post-list">
      {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
      {%- for talk in talks -%}
      <li>
        <span class="post-meta">{{ talk.date | date: date_format }}</span>
        <h2>
          <a class="post-link" href="{{ talk.url | relative_url }}">
            {{ talk.title | escape }}
          </a>
        </h2>
        {%- if site.show_excerpts -%}
          {{ talk.excerpt }}
        {%- endif -%}
        {% for tag in talk.tags %}
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