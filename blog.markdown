---
layout: default
title: Blog
permalink: /blog
---

<div class="home">
  {%- if page.title -%}
    <h1 class="page-heading">{{ page.title }}</h1>
  {%- endif -%}


  {% if site.paginate %}
    {% assign blogs = paginator.blogs | sort: 'path' | reverse %}
  {% else %}
    {% assign blogs = site.blogs | sort: 'path' | reverse %}
  {% endif %}


  {%- if blogs.size > 0 -%}
    {%- if page.list_title -%}
      <h2 class="post-list-heading">{{ page.list_title }}</h2>
    {%- endif -%}
    <ul class="post-list">
      {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
      {%- for blog in blogs -%}
      <li>
        <span class="post-meta">{{ blog.date | date: date_format }}</span>
        <h3>
          <a class="post-link" href="{{ blog.url | relative_url }}">
            {{ blog.title | escape }}
          </a>
        </h3>
        {%- if site.show_excerpts -%}
          {{ blog.excerpt }}
        {%- endif -%}
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