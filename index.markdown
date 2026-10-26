---
layout: default
permalink: /
---

# 👋 Hi, I'm Adrian Goh

Current: Senior Software Engineer @ [Open Government Products (OGP)](https://www.open.gov.sg/) since 2024

Main quest: Building [Isomer](https://www.isomer.gov.sg/) and empowering government to set up better, faster and cheaper websites

Side quest: Optimise teams' DX, e.g. adopting oxlint/oxfmt, TS7, PNPM, and sped up tests and build by up to 10x

- 👴🏻 30 years old
- 👣 2018 - 2024: Co-Founder (Eng. & Product) @ [NodeFlair](https://nodeflair.com) (Series A). Scaled to >400k monthly visitors.
- 👣 2017, 2018: Data & Product @ [ShopBack](https://www.shopback.sg)
- ⚙️ Tech stacks: `.ts` `.rb` `.py` 

Other projects:
- 📁 [Telegram Sync](https://github.com/adriangohjw/telegram-sync)
- 🎮 [LinkedIn Queens Game Solver](https://linkedin-queens-game-solver.adriangohjw.com/)

<hr>

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

## What I'm learning

{% assign latest_studies = site.studies | sort: 'date' | reverse %}
<ul>
  {% for study in latest_studies %}
    {% if study.uncompleted %}
      <li>
        <a href="{{ study.url }}">{{ study.title }}</a>
      </li>
    {% endif %}
  {% endfor %}
</ul>
