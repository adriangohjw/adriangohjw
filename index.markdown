---
layout: default
permalink: /
---

# 👋 Hi, I'm Adrian Goh

I previously co-founded [NodeFlair](https://nodeflair.com/) (Series A) and single-handedly scaled it to >400k monthly visitors.

I write my [technical learnings and opinions](/blog) and gave [talks](/talks) at meetups and conferences.

- 📋 28 years old + Male
- 🏢 [NodeFlair](https://nodeflair.com), [ShopBack](https://www.shopback.sg)
- 🛠️ Building [bebetter.engineer](https://bebetter.engineer) (WIP)
- ⚙️ Tech stacks: `.rb` `.ts` `.js` `.py` 

Other projects:
- 🎨 [Image Text Overlay Generator](https://text-over-image.adriangohjw.com/)
- 💎 [autogitc](https://github.com/adriangohjw/autogitc) (use LLM to write git commit messages)
- 🎮 [LinkedIn Queens Game Solver](https://linkedin-queens-game-solver.adriangohjw.com/)

<hr>

## What I'm learning

{% assign latest_studies = site.studies | sort: 'date' | reverse %}
<ul>
  {% for study in latest_studies limit: 1 %}
    <li>
      <a href="{{ study.url }}">{{ study.title }}</a>
    </li>
  {% endfor %}
</ul>

## Some latest blog posts

{% assign latest_blogs = site.blogs | sort: 'date' | reverse %}
<ul>
  {% for blog in latest_blogs limit: 5 %}
    <li>
      <a href="{{ blog.url }}">{{ blog.title }}</a>
    </li>
  {% endfor %}
</ul>

## Some latest talks

{% assign latest_talks = site.talks | sort: 'date' | reverse %}
<ul>
  {% for talk in latest_talks limit: 3 %}
    <li>
      <a href="{{ talk.url }}">{{ talk.title }}</a>
    </li>
  {% endfor %}
</ul>
