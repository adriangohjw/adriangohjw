---
layout: default
permalink: /
---

# 👋 Hi, I'm Adrian Goh

I am a Software Engineer @ [Open Government Products (OGP)](https://www.open.gov.sg/) working on [Isomer](https://www.isomer.gov.sg/) and empowering government to set up better websites - faster and cheaper.

I write my [technical learnings and opinions](/blog) and gave [talks](/talks) at meetups and conferences.

- 📋 29 years old
- 🏢 2018 to 2024: Technical Co-Founder @ [NodeFlair](https://nodeflair.com) (Series A) & single-handledly scaled it to >400k monthly visitors.
- 🏢 2017, 2018: Product @ [ShopBack](https://www.shopback.sg)
- ⚙️ Tech stacks: `.rb` `.ts` `.js` `.py` 

Other projects:
- 🎨 [Image Overlay Generator](https://image-overlay-generator.adriangohjw.com/)
- 😎 [Alt Text Generator API](https://alt-text-generator.adriangohjw.com/)
- 💎 [autogitc](https://github.com/adriangohjw/autogitc) (use LLM to write git commit messages)
- 🎮 [LinkedIn Queens Game Solver](https://linkedin-queens-game-solver.adriangohjw.com/)
- 🛠️ Building [bebetter.engineer](https://bebetter.engineer) (WIP)

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
