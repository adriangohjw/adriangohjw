---
title:  "Engineering Productivity for Everyone (including co-workers)"
date:   2021-08-05 11:07:00 +0800
---

[nodeflair-website]:              https://www.nodeflair.com
[nodeflair-salaries]:             https://www.nodeflair.com/salaries
[developer-1-minute]:             /assets/developer_1_minute.gif
[nf-salaries-addsalary]:          /assets/nf_salaries_addsalary.png

<Intro>

<Illustration src="/images/blog/engineering-productivity-for-everyone-including-co-workers/silicon-valley-intense-coding.gif" />

Productivity is very important to me. This is especially so, given my current position as the co-founder of [NodeFlair][nodeflair-website]. As the co-founder, beyond the usual engineering work, I also have non-engineering involvements such as OKR meetings with the respective department heads, interviewing and hiring of key roles, investor relations, finance and the list goes on.

Over time, I started reflecting on how my time is spent and looking into ways to improve my productivity. In this post, I will be breaking things down into 3 main sections:
- How to improve your productivity
- How managers can improve the team productivity
- How non-engineering co-workers can help

</Intro>

---

## Personal productivity - O(n) to O(logn) {/*personal-productivity-o(n)-to-o(logn)*/}

### 15 mins + 15 mins != 30 mins {/*15mins-plus-15mins-not-equal-to-30mins*/}

<b>TL;DR: Block off your calendar + Leave awkward calendar gap for admin tasks</b>

- Context switching is expensive - it takes time and mental energy to switch from one thing to another
- When we are working on an issue, it comes in 4 stages: Understanding, Thinking, Implementing and Testing. If at any time, this cycle and train of thoughts are broken off before it is completed, there's a high chance that progress will be wasted and you likely have to start over.
- Thus, I will block off my calendar in advance - think of it as "me time" but for engineering work, usually in blocks of minimally 30 minutes.
- Nevertheless, you will still find awkward gaps in your calendar e.g. 15 minutes between 2 meetings. For this, I will usually use it for non-engineering tasks such as checking my emails, reviewing smaller PRs, clarifying some product requirements. Or even simply catching a break!

<Illustration src="/images/blog/engineering-productivity-for-everyone-including-co-workers/developer-1-minute.gif" />

### Say NO to meetings {/*say-no-to-meetings*/}

<b>TL;DR: Reject meetings w/o clear agendas + Leave meeting when you are no longer needed</b>

- How often have you attended meetings without a clear agenda, and the meetings ended up dragging longer than they should have been?
- Or be stuck in a 30-mins meeting, when your presence is only required for the first 5 minutes?

As Elon Musk mentioned in [his email](https://electrek.co/2018/04/17/tesla-model-3-production-goal-6000-units-per-week/) to his company
> <i>"Walk out of a meeting or drop off a call as soon as it is obvious you aren’t adding value. It is not rude to leave, it is rude to make someone stay and waste their time."</i>

By rejecting and excusing yourself from these meetings, you are doing both parties a favour - meetings are often more fruitful and actionable, and the meeting organizer has a more proactive meeting when those who are zoning out has been asked to leave.

---

## Team productivity - how managers can help {/*team-productivity-how-managers-can-help*/}

### You don't always need pair programming {/*you-dont-always-need-pair-programming*/}

<b>TL;DR: Only do pair-programming for challenging tickets</b>

I agree with what Martin Fowler shared about the benefits of pair programming in this [post](https://martinfowler.com/bliki/PairProgrammingMisconceptions.html)
> <i>This is due to the continuous discussion and review that pairing introduces. You come up with better designs, make less mistakes, and make more people familiar with the code. All of these things offset having less people typing.</i>

However, what I realized is it depends on the task at hand. In my opinion:
- Pair programming is great for more complex tasks
- However, it is counterproductive when the task is straightforward
- Furthermore, with remote work becoming more of the norm, pair programming has become more draining due to "Zoom fatigue", which is not great for personal wellness and productivity.

For example, for one of the products we are building, [NodeFlair Salaries][nodeflair-salaries], users can anonymously contribute their salary details via a simple POST form. The requirements are straightforward, and there's nothing complex about building it (someone who picks up web programming a week back probably can do it). In such cases, I would recommend against pair programming.

<img src="/images/blog/engineering-productivity-for-everyone-including-co-workers/nf-salaries-addsalary.png"></img>

### That extra headcount might not be useful {/*that-extra-headcount-might-not-be-useful*/}

<b>TL;DR: Re-evaluate your current team structure and processes</b>

Engineering managers probably know that adding manpower to a software project doesn't necessarily increase the development speed. This is because increasing headcount also increases the complexity and the amount of communication required. 

However, there are times where it seems like adding headcounts will speed things up. Even so, to maximise the impact of the new hire, we should first look into understanding the bottleneck in your team's productivity.

<b>Team spending too much time in meetings?</b><br></br>
✅ Remove large meetings + Make sure all meetings have clear agendas
<br></br><br></br>

<b>Too much to-and-fro communication to clarify tickets?</b><br></br>
✅ Ensure tickets are detailed enough (follows a proper structure)
<br></br><br></br>

<b>The team constantly interrupted by non-engineering teammates?</b><br></br>
✅ Make sure non-engineering teammates don't approach your team directly - Have them file tickets instead, or reach out to you in the case of an emergency instead
<br></br><br></br>

<b>Too much time spent on fixing bugs?</b><br></br>
✅ Spend more time writing tests and have a more thorough code review process
<br></br><br></br>

<b>High attrition and turnover?</b> <br></br>
✅ Do proper exit interviews to understand the root causes and fix them
<br></br><br></br>

Also, some tasks are simply not manpower-elastic. You need to put down your management hat and wear your engineering hat, to determine if adding more manpower really improves the development speed.

However, the tough part about it is standing firm in your decision and communicating them to people without an engineering background. At NodeFlair, I am glad that the team trust me in making the decision of NOT hiring, even when things are moving fast and we want to move faster.

---

## For non-engineering co-workers - this is how you can help {/*for-non-engineering-co-workers-this-is-how-you-can-help*/}

### Be mindful - don't disrupt unnecessarily {/*be-mindful-dont-disrupt-unnecessarily*/}

<b>TL;DR: Ping first instead of interrupting them abruptly unless absolutely urgent</b>

- Getting back into the zone takes more time, than you getting back into the next sales call
- Thus, don't interrupt engineers - don't tap them (in office) or call them (remote work)
- Give them a ping on Slack first (or whatever messaging tool) - engineers will get back to you once they are done with their current task on hand
- Of course, unless if the issue is urgent (server is down?), then of course, please do! But even so, perhaps we can approach the EM/PM first and not the engineers directly

---

## Conclusion {/*conclusion*/}

If you are an engineer and has different thoughts or more tips, do let me know! More than happy to hear from everyone.

Cheers, and see you later alligator~
