---
title:  "'The Cold Start Problem: How to Start and Scale Network Effects' by Andrew Chen"
date:   2021-12-20 01:24:00 +0800
---

<Intro>

<Illustration src="/images/blog/the-cold-start-problem/book-banner.png" />

Building a company with network effects is hella hard.
Andrew Chen (investor at a16z, ex-Uber) wrote an actionable playbook after interviewing founding teams of LinkedIn, Twitch, Zoom, Dropbox, Tinder, Uber, Airbnb and Pinterest.

</Intro>

## Launching New Tech Products Today Is Incredibly Challenging {/*launching-new-tech-products-today-is-incredibily-challenging*/}

> <i>When something works, others can follow - and fast.</i>

Today, it's much easier for startups to build and market their products
- Access to open source software, instead of buying proprietary software at a high price
- Off-the-shelf SaaS tools, instead of building them from scratch
- Cloud services, instead of operating one's own data center
- Affordable pay-per-click advertising, instead of traditional channels like TV ads

While this means lower technical risk (won't fail because the teams can't execute on the engineering aspect), it also means lower defensibility.

## Cold Start Theory {/*cold-start-theory*/}

<Illustration src="/images/blog/the-cold-start-problem/cold-start-theory.png" />

## Cold Start {/*cold-start*/}

- Most important stage --> Most networks collapse before they even start
- Need both users and content on the SAME network at the SAME time during launch
- Anti-Network Effects: Small, sub-scale networks naturally want to self-destruct

> <b>Uber</b><br></br>
<i>Get ETAs down under 3 min on average as quickly as possible while covering the whole city.</i>

> <b>Airbnb</b><br></br>
<i>Cofounder Nate Blecharczyk is highly quantitative and had determined that 300 listings, with 100 reviewed listings, was the magic number to see growth take off in a market</i>

### Atomic Network {/*atomic-network*/}

- It is the smallest network needed that can stand on its own
- Density matters: 10 Slack users across the company is worse than 10 Slack users in one team
- "DO WHATEVER IT TAKES" even if it's unscalable or unprofitable

> <b>Bank of America</b><br></br>
<i>On September 18, the bank mailed 60,000 Fresno residents a BankAmericard. There was no application process.</i>

### The Hard Side {/*the-hard-side*/}

- Small percentage of people end up doing most of the work within the community
- Acquiring them is hard, but it is important in standing up an atomic network
- Thus, important to cater the product to them and understand their motivation
- Social Content App's 1/10/100 rule: 1% will initiate, 10% will contribute, 100% will consume

### Others {/*cold-start-others*/}

- Network Products love to be free, so it's easier for the network to grow. They are then monetized by ad-supported, premium features or microtransactions.
- Opposite of Magic Moments is Zeroes - moments where the network has broken down. It is useful to track the percentage of consumers that are seeing zeroes.

> <b>Uber</b><br></br>
<i>... when a rider opens the Uber app with the intent to pick an address and pick up a ride—but there aren’t any drivers in the area! This is a zero.</i>

## Tipping Point {/*tipping-point*/}

### Invite-only {/*invite-only*/}

- Beside generating FOMO, it also curates access to users who will be the most active at launch --> Better experience for subsequent new users (they have at least 1 friend they know)
- Also important to have "import contacts" feature for it
- Robinhood's have mechanims to shift user up the queue if they share on social media

### Come for the Tool, Stay for the Network {/*come-for-the-tool-stay-for-the-network*/}

- For Instagram, despite having social features from the start, people were mainly using it for photo editing for the first 6 months.

### Paying Up for Launch {/*paying-up-for-launch*/}

> <b>Van Camp's Milk</b><br></br>
<i>In a page ad, I inserted a coupon good at any store for a ten-cent can. ... We sent copies of these ads to all grocers, and told them that every customer of theirs would receive one of these coupons. It was evident that they must have Van Camp's Milk. Every coupon meant a ten-cent sale which, if they missed it, would go to a competitor.</i>

> <b>Uber</b><br></br>
<i>$30/hour guaranteed payment, regardless of how many trips they did</i>

### Flintstoning {/*flintstoning*/}

> <b>Reddit</b><br></br>
<i>All of these dummy accounts looked and acted like real users, but it was Steve and Alexis controlling them... "I wrote some code that would scrape news websites and post them with made-up usernames"</i>

> <b>DoorDash, Postmates</b><br></br>
<i>... showing a large selection of restaurants, regardless of whether those restaurants had actually signed up. When customers ordered, the apps would send couriers to pick up the food, unbeknownst to the small, local businesses!</i>

> <b>PayPal</b><br></br>
<i>PayPal built bots that would automatically buy and sell items on eBay, but insist on transacting only with PayPal -- it became a way to convince eBay sellers to sign up for the service.</i>

> <b>Microsoft Xbox</b><br></br>
<i>buying a large number of studios and bringing them in-house... owns nearly a dozen video game studios, including Mojang, the maker of Minecraft, which they bought for $2.5 billion in 2014.</i>

### Always Be Hustlin' {/*always-be-hustling*/}

- Product can solve problems, but it's slow - Ops can do it fast
- Tap on larger communitiy and local events

### Others {/*tipping-point-others*/}

- Same product can have different demographics at different market for launch. For example, for Tinder, it is schools in US and factory workers in some other part of the world.

## Escape Velocity {/*escape-velocity*/}

### The Engagement Effect {/*engagement-effect*/}

- Cohort analysis to segment users
- Levers used to increase engagement of infrequent users are different than deepening engagement for a power user.
  - Infrequent users: Need more connections etc.
  - Power users: Discover advanced features like creating groups
- Find Engagement Loops and accelerate each step of every stage. For example, how do create listings easier, how to increase views by potential buyers?
- Network products have the unique capability to reactivate "dead" users through active users
  - What kind of notifications will get them back?
  - It could be a simple weekly digest e.g. "Your friend X just joined"

### The Acquisition Effect {/*acquisition-effect*/}

- Product-driven growth is cheaper than traditional paid marketing
- Acquisition cannot exist without Engagement. Otherwise, it is not sustainable, just like Ponzi scheme.
- Works better than Big Bang Launches, which are great at landing but fail at expanding.

### The Economic Effect {/*economic-effect*/}

- Ability to bettter understand the value and costs of a cuustomer as a network gets larger
- Efficiency over subsidy
  - Instead of standardized incentives, they can be personalized to optimize the effect of the subsidies
- Higher conversion rates as the network grows
  - E.g. Dropbox High-Value Active Users found to upgrade when they had collaborative use cases
  - E.g. As more coworkers are on Slack, the more useful features like searchable message history are
  - E.g. More reason to use Tinder's "Super Like" when the network of potential suitors is larger
- Impact
  - Leading network often has a better business model, e.g. Google ads can charge a premium
  - Price Shopping becomes a smaller issue for market leader, as it is harder for competitors to win even if they are same price / cheaper

## The Ceiling {/*the-ceiling*/}

> <b>Facebook</b><br></br>
<i>"Growth had plateaued around 90 million people," Zuckerberg recalls. "I remember people saying it’s not clear if it was ever going to get past 100 million at that time. We basically hit a wall and we needed to focus on that."</i>
<br></br><br></br>
Facebook then built its first Growth team, get user profiles indexed by Google via SEO, create friends recommendation etc.

### Network Saturation {/*network-saturation*/}

- As network matures, returns diminishes at larger numbers (10th and 1000th friend is different)
- Adjacent Networks
  - Each set of adjacent network is like adding a new layer 
  - Rather than focus on core network of Power Users, instead figure out the adjacent ser of users whose experience was subpar
  - E.g. Support for low-end Android devices with low data connections
  - Cheat code for large companies is simply to buy startups that have hit Escape Velocity and integrate them into a preexisting network
- New Formats
  - E.g. eBay's "Buy It Now" is slightly different from the original bidding system
- New Geographies
  - Far harder, as usually requires the team to start their network from zero once again
  - E.g. Uber in Thailand: Uber Moto + Payment in cash + Low budget Android phone support

> <b>Instagram</b><br></br>
<i>While Instagram had product-market fit for 400+ million people, we discovered new groups of billions of users who didn’t quite understand Instagram and how it fit into their lives.</i>

### Law of Shitty Clickthroughs {/*law-of-shitty-clickthroughts*/}

- Every marketing channel degrades over time
- Applies to virality too - every 100 will invite 75, then those in turn invite 56, then 42 and so on.
- Refer to The Acquisition Effect above

### When the Network Revolts {/*when-the-network-revolts*/}

> <b>Uber</b><br></br>
<i>... power drivers represented the top 15% of drivers but constitured over 40% of our trips</i>

> <b>Slack</b><br></br>
<i>less than 1% of Slack’s total customers accounted for 40% of the revenue</i>

Solution: Encourage successful players to get even bigger
  - It helps scale the hard side --> Important since sheer numbers begin to slow down
  - New product tiers (e.g. pro, enterprise)
  - Set them up for success so they don't churn
  - E.g. Uber's car leasing - financing vehicles to provide cars to potential drivers

### Eternal September {/*eternal-september*/}

#### Context collapse
- Too many networks simultaneouslly brought together and they collapse into one
- Content you posted are also seen by non-intended users --> Hard side forced to participate less

Solution: Networks of Networks
- Users able to group themselves e.g. Facebook Groups, Slack's channels, IG secondary accounts
- Make users aware when they are interacting across different contexts e.g. Slack channel warns you that your recipients are in another time zone
- Permissions and privacy features: Google Docs sharing settings

#### Bad actors
- Fake dating profiles, fake ICOs, fraud, bots etc.

Solution: Power of Downvotes
- Give users ability to report spam, flag malicious accounts, block bad content
- Not only creates ways for users to customize their own experience, but also provides the data that can be used to moderate in other ways

> <b>Reddit</b><br></br>
<i>... use a governance model akin to our own democracy—where everyone follows a set of rules, has the ability to vote and self-organize, and ultimately shares some responsibility for how the platform works. ... The downvote is where community culture is made, through rejecting transgressive behavior or low-quality content</i>

### Overcrowding {/*overcrowding*/}

- Too much content: Too many comments, threads, emails, followed too many people etc.

> <b>Youtube</b><br></br>
<i>Once we got a lot more videos, we had to redesign YouTube to make it easier to discover the best videos. At first, we had a page on YouTube to see just the top 100 videos overall, sorted by day, week, or month. Eventually it was broken out by country.</i>

Solutions:
- Algorimithic methods
- Segmentation (e.g. by country)
- Editorial judgement e.g. Apple's Apps of the Year --> inspires developers to invest in design and quality
- Allow users to curate content themselves e.g. Amazon's wish 

The Rich Get Richer
- How does a new member of the network break in? E.g. new account v.s. one with millions of followers
- New member (New money) look for alternate networks

> <b>LinkedIn</b><br></br>
<i>People You May Know was a key part of LinkedIn’s success, generating billions of connections within the network. ... Later, we incorporated implicit signals—maybe Alice just updated her profile to say she works at your same company. Maybe she’s viewed your profile multiple times over several days.</i>

Algorithms aren't a silver bullet
- Optimizing for engagement will prioritize click-bait content, while optimizing for revenue will prioritize high-price low-relevance items

## The Moat {/*the-moat*/}

- Rarely in network-effects-driven categories does a product win based on features -- instead, it's a combination of harnessing network effects and building a product experience that reinforces those advantages
- It's also not about whose network is bigger, a counterpoint to jargon like <i>"first mover advantage"</i>

### Cherry Picking {/*cherry-picking*/}

- Craigslist was getting "unbundled" by an emerging crop of startups -- Indeed for Jobs, StubHub for tickets, Etsy for arts and crafts etc.
- Every dominant network might seem invincible, but some parts of the network are weaker than others
  - They cannot keep the network discoverable, or maintain quality 

Switching over Entire Networks
- Airbnb added functionality that allow users to publish it to Craigslist that drive them to Airbnb
- Danger of platform dependence: 
  - Platform can control your distribution
  - Platform can duplicate the features
  - Platform can disable the API that allow any integration

### Big Fang Failures {/*big-bang-failures*/}

- It is built on broadcast cannels --> users are more likely to churn
- Takes time to have the right features
- Present distracting, confusing aggregate information without viral growth also improving
- Bottom-up networks are more likely to be densely interconnected, thus being more engaged
- Comes in other forms too: <i>"Why are you aiming for 5 customers instead of 500?"</i>

### Competing over the Hard Side {/*competiting-over-the-hard-side*/}

> <b>Sidecar</b><br></br>
<i>Near the end, Uber had us in a corner. Sidecar got to the point where we had expanded to too many markets and couldn’t hold on to our riders and drivers in the way we had been before. We made the hard choice to stop giving out the kind of rider and driver bonuses that Uber was doing. The markets would need to stand on their own. Once we stopped the bonuses, within 6 weeks, the markets had all gone to zero.</i>

#### Finding the Competitive Levers

> <b>Uber</b><br></br>
<i>There was a sophisticated effort to tag drivers as dual appers... Once tagged, the dual-apping drivers in the city could be sent a myriad of
offers to compel them to change their behavior.</i>

#### Competitive Intelligence

> <b>Uber</b><br></br>
<i>One important source was large panels of anonymous credit card analytics resold and repackaged by the major card companies. Another source came from email analytics companies that had access to the emails... For a while, there was even a team called Counterintelligence (COIN), which reverse-engineered and scraped the APIs of rivals</i>

### Bundling {/*bundling*/}

- It might work, but only when the product is great
- Engagement and monetization will only kick in when there's a real critical mass e.g. Google+

#### Leverage a larger network across multiple touchpoints

E.g. Facebook and Instagram
- IG tap into FB network to make it easier to share
- Sign up to IG using FB
- IG tapping into FB social graph

#### Locking in the Hard Side

> <b>Microsoft</b><br></br>
<i>Even to this day, application code that is twenty or thirty years old can still be run on the latest version of Windows. This meant each new version of an OS would only increase the total number of applications available to run on it, and never decrease it</i>
