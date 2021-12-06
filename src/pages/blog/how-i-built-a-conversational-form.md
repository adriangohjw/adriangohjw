---
title:  "Conversational Form in 65 lines of code - Here's how I built it"
---

<Intro>

<Illustration src="/images/blog/how-i-built-a-conversational-form/demo.gif" />

Hey, you right there. Are you feeling lonely (not me) and wish that your form is more fun and interactive? You've come to the right place!

I came across <b>Conversational Form</b> by SPACE10, which allows one to easily turn any web form into conversations instead. From the project's webpage itself:

> It features conversational replacement of all input elements, reusable variables from previous questions and complete customization and control over the styling.

</Intro>

## TL;DR {/*tldr*/}

In this demo, I implemented the following features with just <b>65 lines of code</b>:
- Asking a question and displaying the answer back in a respond
- Asking a question with images and texts as answer options
- Conditional rendering of questions

## Using ConversationalForm {/*using-conversationalform*/}

To use the ConversationalForm library, we have to first include it in our project.

For the simplicity of this project, I will be importing it using CDN.

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/space10-community/conversational-form@1.0.1/dist/conversational-form.min.js" crossorigin></script>

```

You can also download/install the latest release by cloning the repo or installing it with npm/ yarn.

More can be found in the [source code's repository](https://github.com/space10-community/conversational-form).

## Responding with the user's answer {/*responding-with-the-users-answer*/}

<Illustration src="/images/blog/how-i-built-a-conversational-form/ss1.png" />

<APIAnatomy>

<AnatomyStep title="Declare a name for the input">

Call `name` and pass a value `input-name` into it (replace it with your own)

</AnatomyStep>

<AnatomyStep title="Insert the user's response in your message">

Do it by calling `{input-name}`

</AnatomyStep>


```html [[1, 3, "input-name"], [2, 9, "{input-name}"]]
<input
  type="text"
  name="input-name"
  cf-questions="What is your name?"
  required 
/>

<cf-robot-message
  cf-questions="Eww, what kind of name is <strong>{input-name}</strong>. Oh well, anyway...">
</cf-robot-message>
```

</APIAnatomy>

## Providing answer options with images {/*providing-answer-options-with-images*/}

<Illustration src="/images/blog/how-i-built-a-conversational-form/ss2.png" />

```html
<fieldset cf-questions="What is your favourite band?">
  <label for="fav-band-forests">Forests
    <input 
      type="radio"
      name="fav-band"
      id="fav-band-forests"
      value="Forests"
      cf-image="/assets/fav-band/forests.jpg"
    >
  </label>
  <label for="fav-band-tmp">TMP
    <input
      type="radio"
      name="fav-band"
      id="fav-band-tmp"
      value="TMP"
      cf-image="/assets/fav-band/tmp.jpg"
    >
  </label>
  <label for="fav-band-xfr">Xingfoo&Roy
    <input
      type="radio"
      name="fav-band"
      id="fav-band-xfr"
      value="Xingfoo&Roy"
      cf-image="/assets/fav-band/xfr.jpg"
    >
  </label>
</fieldset>
```

I think the code is pretty self-explanatory - you can specify the path to the images using `cf-image`.

## Conditional rendering of questions {/*conditional-rendering-of-questions*/}

In this demo, I would like to conditionally ask the user what is their favourite song(s) based on the band they have selected.

For example, if they have selected Forests as their favourite band, these will be the options.

<Illustration src="/images/blog/how-i-built-a-conversational-form/ss3a.png" />

And if they have selected TMP instead, a different set of options will be presented.

<Illustration src="/images/blog/how-i-built-a-conversational-form/ss3b.png" />

<APIAnatomy>

<AnatomyStep title="Adding a conditional tag">

This can be easily achieved by adding a `cf-conditional-INPUT-NAME` in the `select` tag. Since the previous question was using `fav-band` as the name and we only want this question to be asked if they have selected Forests previously, we will add `cf-conditional-fav-band="Forests"`.

</AnatomyStep>


```html [[1, 2, "cf-conditional-fav-band"]]
<select
  cf-conditional-fav-band="Forests"
  cf-questions="What is your favourite song by <strong>{fav-band}</strong> then?"
  name="fav-song"
  multiple
>
  <option value="Kawaii Hawaii">Kawaii Hawaii</option>
  <option value="Tamago">Tamago</option>
  <option value="Cup of Tea">Cup of Tea</option>
  <option value="This Town Needs Fun">This Town Needs Fun</option>
  <option value="Who Cares, Really?">Who Cares, Really?</option>
</select>
```

</APIAnatomy>

## Customizing the form {/*customizing-the-form*/}

You can configure the form to better suit your needs. In my case, I want to
- Change the avatar images
  - Simply add the image sources to `userImage` and `robotImage`
- Adding a callback on submitting
  - Add your code to `submitCallback`
  - In this demo, I console logged the data collected
  - In your case, you can use this to send the data to your API

```js
window.onload = function() {
  var conversationalForm = window.cf.ConversationalForm.startTheConversation({
    formEl: document.getElementById("my-form-element"),
    userImage: "/assets/userImage.jpg",
    robotImage: "/assets/robotImage.jpeg",
    submitCallback: function() { ... }
  });
};
```

<script src="https://gist.github.com/adriangohjw/331234f164b45b39ed6338fecb96115a.js?file=customizing.js"></script>

## Conclusion {/*conclusion*/}

I find the ConversationalForm library to be really easy to use and works pretty well right out of the box. 

At the time of my writing, the project is at v1.0.0, so you might want to consider it twice before using it for critical forms. 

Nevertheless, there are still some areas of improvement that I hope to see:
- More features such as sending a message that includes media (gif, video, images, files etc.)
- Integration with more 3rd-party software (currently there's GA and Mailchimp in the examples)

## Reference {/*reference*/}

- [Code](https://github.com/adriangohjw/space10-conversational-form)
- [Demo](https://conversational-form.adriangohjw.com)