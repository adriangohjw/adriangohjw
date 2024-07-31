---
layout: default
title: Resume
permalink: /resume
---

<i>Last updated: 1 August 2024</i><br>
[Download Resume as PDF](assets/resumes/resume.pdf){:target="_blank" download="Adrian Goh Jun Wei - Resume.pdf"}

<div class="resume-images">
  <img class="resume-image" src="/assets/resumes/image-1.jpg">
  <img class="resume-image" src="/assets/resumes/image-2.jpg">
</div>

<style>
    .resume-images {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .resume-image {
      border: 1px solid black;
      border-radius: 8px;
    }

    @media (max-width: 600px) {
        .pdf-container {
            display: none;
        }
        .error-text {
            display: block;
        }
    }

    @media (min-width: 599px) {
        .pdf-container {
            display: block;
        }
        .error-text {
            display: none;
        }
    }
</style>