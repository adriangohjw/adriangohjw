---
layout: blog
title:  "Conversational Form in 65 lines of code - Here's how I built it"
date:   2021-09-13 03:09:00 +0800
categories: blogs
---

[demo-app]:           https://conversational-form.adriangohjw.com
[github-code]:        https://github.com/adriangohjw/space10-conversational-form
[demo-app-ss-1]:      /assets/conversational-form-ss-1.png
[demo-app-ss-2]:      /assets/conversational-form-ss-2.png
[demo-app-ss-3a]:     /assets/conversational-form-ss-3a.png
[demo-app-ss-3b]:     /assets/conversational-form-ss-3b.png

<div align="center">
  <img src="/assets/conversational-form-demo.gif"/>
</div>
<br>

## <b>Overview</b>

Hey, you right there. Are you feeling lonely (not me) and wish that your form is more fun and interactive? You've come to the right place!

I came across <b>Conversational Form</b> by SPACE10, which allows one to easily turn any web form into conversations instead. From the project's webpage itself:

> It features conversational replacement of all input elements, reusable variables from previous questions and complete customization and control over the styling.

In this demo, I implemented the following features with just <b>65 lines of code</b>:
- Asking a question and displaying the answer back in a respond
- Asking a question with images and texts as answer options
- Conditional rendering of questions

## <b>Using ConversationalForm</b>

To use the ConversationalForm library, we have to first include it in our project.

For the simplicity of this project, I will be importing it using CDN.

<script src="https://gist.github.com/adriangohjw/331234f164b45b39ed6338fecb96115a.js?file=importing.html"></script>

You can also download/install the latest release by cloning the repo or installing it with npm/ yarn.

More can be found in the [source code's repository](https://github.com/space10-community/conversational-form).

## <b>Responding with the user's answer</b>

![][demo-app-ss-1]

<script src="https://gist.github.com/adriangohjw/331234f164b45b39ed6338fecb96115a.js?file=responding-with-users-answer.html"></script>

After asking the question, you can insert the user's response in your message by calling `{input-name}`. In my case, it's `{name}`.

## <b>Providing answer options with images</b>

![][demo-app-ss-2]

<script src="https://gist.github.com/adriangohjw/331234f164b45b39ed6338fecb96115a.js?file=answer-options-with-images.html"></script>

I think the code is pretty self-explanatory - you can specify the path to the images using `cf-image`.

## <b>Conditional rendering of questions</b>

In this demo, I would like to conditionally ask the user what is their favourite song(s) based on the band they have selected.

For example, if they have selected Forests as their favourite band, these will be the options.

![][demo-app-ss-3a]

And if they have selected TMP instead, a different set of options will be presented.

![][demo-app-ss-3b]

This can be easily achieved by adding a `cf-conditional-INPUT-NAME` in the `select` tag. Since the previous question was using `fav-band` as the name and we only want this question to be asked if they have selected Forests previously, we will add `cf-conditional-fav-band="Forests"`.

<script src="https://gist.github.com/adriangohjw/331234f164b45b39ed6338fecb96115a.js?file=conditional-rendering.html"></script>

## <b>Customizing the form</b>

You can configure the form to better suit your needs. In my case, I want to
- Change the avatar images
  - Simply add the image sources to `userImage` and `robotImage`
- Adding a callback on submitting
  - Add your code to `submitCallback`
  - In this demo, I console logged the data collected
  - In your case, you can use this to send the data to your API

<script src="https://gist.github.com/adriangohjw/331234f164b45b39ed6338fecb96115a.js?file=customizing.js"></script>

## <b>Conclusion</b>

I find the ConversationalForm library to be really easy to use and works pretty well right out of the box. 

At the time of my writing, the project is at v1.0.0, so you might want to consider it twice before using it for critical forms. 

Nevertheless, there are still some areas of improvement that I hope to see:
- More features such as sending a message that includes media (gif, video, images, files etc.)
- Integration with more 3rd-party software (currently there's GA and Mailchimp in the examples)

## <b>Reference</b>

- [Code][github-code]
- [Demo][demo-app]
