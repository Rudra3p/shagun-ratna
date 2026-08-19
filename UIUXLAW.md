# The 21 Laws of UX

In psychology, heuristics are mental shortcuts that we use to make decisions and solve problems quickly and efficiently. These mental shortcuts allow us to make sense of the world around us without stopping to process and analyse every single piece of information we receive.

The following UX laws are steeped in heuristics, Gestalt psychology, and cognitive bias, and they impact how we navigate and perceive different products and experiences. Each law below includes the original definition, its takeaway, and one real, named example of it in practice — use these as a working reference when making design decisions for textevs.

## Table of Contents

**Heuristics**
1. Aesthetic-Usability Effect
2. Fitts's Law
3. Goal-Gradient Effect
4. Hick's Law
5. Jakob's Law
6. Miller's Law
7. Parkinson's Law

**Gestalt Principles**
8. Law of Common Region
9. Law of Proximity
10. Law of Prägnanz
11. Law of Similarity
12. Law of Uniform Connectedness

**Cognitive Bias**
13. Peak-End Rule
14. Serial Position Effect
15. Von Restorff Effect
16. Zeigarnik Effect

**Additional Principles**
17. Doherty Threshold
18. Occam's Razor
19. Pareto Principle
20. Postel's Law
21. Tesler's Law

---

## The Laws of UX: Heuristics

### 1. Aesthetic-Usability Effect
The Aesthetic-Usability Effect states that users tend to perceive aesthetically pleasing designs as more usable.

So, even if there are usability issues within your design, they may go unnoticed — or be more easily forgiven — if the design looks great.

That doesn't mean that you should prioritise aesthetics over usability, but it does emphasise that UX and UI design go hand-in-hand: they both play a crucial role in creating delightful user experiences.

**The takeaway:** Ensure that your designs are both flawlessly functional and aesthetically pleasing.

**Real-world example:** Stripe's marketing and documentation site is often cited by developers as feeling more trustworthy and "correct" than competitors with equivalent functionality — the restrained typography, precise spacing, and polished motion create a halo effect that makes people assume the product underneath is equally well-engineered, before they've tested a single API call.

### 2. Fitts's Law
Fitts's Law considers how quickly and easily a user can reach a particular target (for example, a button) in order to interact with it.

Named after psychologist Paul Fitts, this UX law describes the relationship between the size and distance of a target (e.g. a button) and the time it takes the user to reach the target.

It's expressed using an equation which calculates the "Index of Difficulty" (ID) — that is, how difficult it is for the user to get from a particular starting point to the desired target.

In simple terms, bigger and closer touch targets are quicker and easier to access.

**The takeaway:** Consider Fitts's Law when determining the size and position of important interactive elements. Make sure that touch targets (such as buttons and menu items) are large enough for users to select them with ease, and that they're positioned in a convenient, easily accessible location on the screen.

**Real-world example:** macOS pins its menu bar to the very top edge of the screen rather than floating it in a window. Because the screen edge acts as an infinitely tall target (the cursor can't overshoot past it), those menu items become the fastest-to-hit targets on the entire display — a textbook application of Fitts's Law that's remained unchanged since the original Macintosh.

### 3. Goal-Gradient Effect
The Goal-Gradient Effect states that the closer a user gets to completing a task, the more motivated they are — and the faster they work — to complete it.

This is a UX law that many of us can relate to. If a goal feels like it's within reach — if we feel close to the finish line — we're more inclined to just get on and get it done. Our perceived proximity to the end goal makes it feel more achievable and less overwhelming.

The same goes for digital products and experiences. Imagine the task of filling out a survey. If you've been answering questions for what feels like an eternity, with no indication as to when the survey might end, you'll probably feel like giving up at some point.

But, if the survey platform keeps you updated on your progress and lets you know that you're nearing the end, you'll be more inclined to see it through.

**The takeaway:** Provide users with clear progress or task status visibility to keep them motivated — such as a progress bar or some well-placed microcopy. For example: "You're almost there! Just three more questions to go."

**Real-world example:** Starbucks Rewards shows members a visual progress bar toward their next free reward every time they order. The original research behind this law (Nunes & Drèze's coffee card study) found that people who started with a 2-stamp head start on a 10-stamp card finished faster than people starting a blank 8-stamp card — Starbucks' digital rewards bar applies the same principle at scale.

### 4. Hick's Law
According to Hick's Law, the more options a user is presented with, and the more complex those options are, the harder it is to make a decision.

It's like eating out at a restaurant. When you've got a menu comprising five different types of cuisine and thirty options for each, choosing what you want feels practically impossible!

The same goes for design. If you want to create an experience that feels intuitive, make it easy for the user to decide what action to take. Don't give them too many options — and, if a particular process is inherently long and complex, break it down into smaller, more manageable steps.

**The takeaway:** Fewer options will make it quicker and easier for users to make decisions and complete their desired tasks. Where possible, keep options to a minimum. You can also guide users in their decision-making by highlighting recommended options.

**Real-world example:** Google's homepage has stayed essentially a search box and two buttons ("Google Search" and "I'm Feeling Lucky") for over two decades, despite Google having thousands of products it could surface there. That restraint is Hick's Law in action — one obvious action, near-zero decision time.

### 5. Jakob's Law
Jakob's Law is all about familiarity. Users expect websites (and other digital products) to be designed in a way that's consistent with others they've used in the past.

Even when using an app or visiting a website for the very first time, you usually have some ingrained knowledge of how it'll work. For example, we just know that the house icon will take us to the homepage — or, when using dating apps, that swiping left will "pass" on a profile while swiping right is a virtual "thumbs up".

Now imagine the chaos that would ensue if designers went against these expectations. Imagine signing up for a new dating app and swiping left and right, only to realise that left now actually means "like" and right now means "pass". Very confusing and counter-intuitive!

Jakob's Law says that we should design in a way that aligns with people's existing mental models — a user's set of assumptions, beliefs, and expectations regarding how certain things work. This ensures an intuitive, smooth, and user-friendly experience.

**The takeaway:** Don't try to reinvent the wheel. Leverage users' existing mental models to inform your designs — for example, place menus at the top of the page or to the left-hand side, use familiar icons, and implement familiar interactions such as swiping left/right on a photo gallery or scrolling to move down the page.

**Real-world example:** Nearly every e-commerce site — Amazon, Shopify stores, Etsy — places the cart icon in the top-right corner of the header. A store that moved it to the bottom-left "just to be different" would measurably hurt conversion, because it breaks a convention shoppers have built years of muscle memory around.

### 6. Miller's Law
Miller's Law states that the average person can only hold 7 items in their working memory, plus or minus 2.

In UX and UI design, you want to avoid overloading the user's working memory. In other words, minimise the cognitive load — or the mental effort — required for the user to interact with your product.

Present information in meaningful, manageable chunks. If you're building an ecommerce website, you might limit the number of products shown at one time. If you're designing a blog, you might present articles in horizontal blocks of three.

**The takeaway:** Aim for clear, concise, and clutter-free designs and you'll automatically reduce the cognitive load placed on the user. Break content down into manageable chunks, prioritising the most important information first.

**Real-world example:** Phone numbers are never displayed as one 10-digit string — every carrier and every form field chunks them as `(xxx) xxx-xxxx`. That chunking pattern, directly derived from Miller's original research, is why credit card fields (`xxxx xxxx xxxx xxxx`) and confirmation codes are grouped the same way instead of shown as a raw digit string.

### 7. Parkinson's Law
According to Parkinson's Law, a task will expand to fill the time allotted for its completion.

In other words, if you set aside a certain amount of time to complete a particular task, you'll usually use up all of that time — even if you don't really need it. If you're allotted one hour to complete a five-minute job, Parkinson's Law says that you'll still use the whole hour.

Designers can use Parkinson's Law to their advantage by making certain tasks even quicker and more efficient than the user expects. For example, if the user expects to spend one minute creating a new account, anything you can do to speed that process up will enhance the user experience.

**The takeaway:** Design tasks and processes so that they're even quicker than the user expects. Simplify forms, use features like autofill, and give the user an estimate for how long a particular process should take.

**Real-world example:** Amazon's 1-Click ordering collapsed a multi-step checkout (cart review, shipping form, payment form, confirmation) into a single click for returning customers. It became one of the most copied checkout patterns in e-commerce precisely because it beat users' expectation of how long buying something "should" take.

---

## The Laws of UX: Gestalt Principles

The Gestalt principles are a set of psychological principles that consider how humans tend to perceive and make sense of visual information. In UX and UI, we can use the Gestalt principles to design and arrange different elements according to how we want the user to group and interpret them.

### 8. Law of Common Region
The Law of Common Region states that, when elements are positioned together in the same area — i.e. when they share a common region within a boundary — the user perceives those elements as belonging together.

Designers can use borders, spacing, and colour to create common regions and group elements together, making it easier for the user to understand the relationship between different elements on the page. This, in turn, facilitates navigation and usability.

**The takeaway:** Group elements together logically and emphasise these groupings according to the Law of Common Region. Use borders, spacing, colour, and shading to define different regions on the page.

**Real-world example:** Every Trello card is a bordered rectangle containing a title, labels, due date, and member avatars. Even with dozens of cards on a board, users instantly know which label belongs to which card because each set of elements shares a visually bounded region — no card ever needs an explanatory line connecting its parts.

### 9. Law of Proximity
According to the Law of Proximity, items or elements that are positioned close together are perceived as belonging to the same group.

This is similar to the Law of Common Region. When we see visual elements in close proximity to one another, we assume they have something in common — that they belong to a particular group of elements or that they all function in a similar way.

The Law of Proximity enables the user to quickly deduce the relationship between different elements and groups, making it easier to navigate the interface.

**The takeaway:** Use the Law of Proximity to signal which elements belong together. For example, if you're designing a form, place form labels and their corresponding input fields close together so the user knows exactly what information to enter where.

**Real-world example:** Stripe Checkout places each field label directly above its input with tight vertical spacing, then leaves a much larger gap before the next field group. Users never have to consciously check which label matches which box — proximity does that work for them.

### 10. Law of Prägnanz
The Law of Prägnanz states that when we perceive complex or ambiguous imagery, we automatically interpret it in the simplest way possible.

It's as if the brain carries out an automatic conversion, turning a complex image into something much simpler and therefore easier to comprehend. This is the brain's way of reducing the cognitive effort required to interpret the image.

If you want to design products and experiences that are easy and efficient for the user, you ideally want to reduce the amount of cognitive effort required. One way you can do that is by favouring simple, straightforward shapes like squares, circles, and rectangles.

**The takeaway:** Bear in mind that more complex, ambiguous images require more effort to comprehend. Opt for simpler shapes and imagery, especially for important elements such as call-to-action buttons.

**Real-world example:** Slack's 2019 rebrand replaced its original 11-color, hard-to-reproduce-at-small-sizes hashtag logo with a flattened, simplified pound-sign mark using just 4 colors. The new mark reads instantly at favicon size specifically because it was redesigned around the Law of Prägnanz — the eye resolves it as one simple shape instead of parsing 11 separate ribbon segments.

### 11. Law of Similarity
According to the Law of Similarity, elements that look similar will naturally be perceived as a related group.

This speaks to the power of consistency throughout a product or user interface. A classic example is the styling of hyperlinked text — this builds a connection in the reader's mind that all similarly-styled text has something in common.

Another example is the distinction between header text and body text. If you're styling the text on a website, you'll probably use a large, bold font for header text — and maybe even a different colour — compared to smaller, lighter body text.

**The takeaway:** Use colour, shape, and size to differentiate between different elements and build meaningful connections between similar elements. For example, links should all be styled the same to signal that they share the same functionality.

**Real-world example:** Wikipedia styles every internal link the same shade of blue across millions of articles. Readers never need to be told "blue underlined text is clickable" — the Law of Similarity means that convention, learned once, transfers instantly to every new page.

### 12. Law of Uniform Connectedness
The Law of Uniform Connectedness states that when elements appear to be connected in terms of their visual appearance, we perceive them as being part of a related group — unlike visually dissimilar elements that appear to have no connection.

Designers can play into the Law of Uniform Connectedness to help users understand and navigate an interface. Elements can be connected by colour, lines, frames, or even arrows. These visual cues tell the user that those elements have something in common and belong to the same group.

**The takeaway:** Use colour, borders, shapes, or visual connectors such as arrows to visually group different elements and help your users to understand the interface.

**Real-world example:** Spotify's "Now Playing" bar houses the album art, track title, artist name, and playback controls inside one continuous dark bar fixed to the bottom of the screen. Even though those four elements are functionally different (an image, two text labels, a set of buttons), the shared background container tells users at a glance that they're all describing the same currently-playing track.

---

## The Laws of UX: Cognitive Bias

Some UX laws are based on cognitive bias — our natural human tendency to interpret information and make assumptions based on previous experiences and preferences. If we understand the cognitive biases at play, we can design products that meet the users' expectations and feel more intuitive.

### 13. Peak-End Rule
The Peak-End Rule suggests that people don't judge an experience based on all the different moments along the way — rather, they judge it primarily based on how they felt at the peak of the experience and at the end.

While every step in the user's journey should be smooth and hiccup-free, designers can enhance the user's overall perception of the experience by paying special attention to the peak and the end.

The peak is a particularly key or defining moment in the journey — for example, the user completing a task or achieving a goal. The end is the final step or interaction they have.

You can enhance these moments with memorable microcopy, a delightful animation, or some kind of unexpected surprise.

**The takeaway:** Identify key moments within the user journey and ensure that they're particularly positive and memorable.

**Real-world example:** Mailchimp's mascot Freddie the chimp appears to give the user a literal high-five animation the moment an email campaign is sent. It became one of the most shared "delightful UX" moments in SaaS — proof that a single well-placed peak moment can define how someone remembers using the entire product, independent of everything that came before it.

### 14. Serial Position Effect
According to the Serial Position Effect, users are most likely to remember the first and last items in a sequence.

Whether left to right or top to bottom, think about the order in which people will perceive your designs. With the Serial Position Effect in mind, place the most important elements where they'll be encountered first and last — for example, to the far left and to the far right of the navigation menu, or at the top and the bottom of the page.

This applies to both visual and written content — anything the user encounters when interacting with a product or completing a particular task.

**The takeaway:** Keep this UX law in mind when defining your product's information architecture and visual hierarchy. The most important elements should appear first and last in the sequence, with less critical information in the middle.

**Real-world example:** Basecamp's marketing nav keeps its logo/Home at the far left and a high-contrast "Sign in" / "Get started" pairing at the far right, with lower-priority links (Pricing, Customers, Blog) buried in the middle. The two things Basecamp most wants remembered — who they are, and what to do next — sit in the two positions the Serial Position Effect says people actually retain.

### 15. Von Restorff Effect
The Von Restorff Effect states that when we're presented with multiple similar elements, we're most likely to remember the element that differs even slightly from the rest.

This UX law is also known as the Isolation Effect, and it describes our tendency to be drawn to things that stand out.

You can apply this principle to draw the user's attention to important elements such as CTA buttons or headings. This, in turn, guides them towards particular actions or influences how they perceive the content on the page.

**The takeaway:** Use shapes, negative space, colour, and typography to help important elements stand out.

**Real-world example:** Notion's pricing page renders three or four plan cards nearly identically, except the recommended plan gets a distinct border color, a subtle background tint, and a "Most Popular" badge. Every SaaS pricing page that uses this pattern (Dropbox, Figma, and dozens more) is leaning on the Von Restorff Effect to steer choice without removing any options.

### 16. Zeigarnik Effect
According to the Zeigarnik Effect, uncompleted or interrupted tasks stick in people's memories more than completed tasks.

This UX law is named after psychologist and psychiatrist Bluma Wulfovna Zeigarnik, who discovered that starting a particular task creates cognitive tension in the user.

When cognitive tension is present, the user is able to recall specific information related to that task. But, once the task is complete, the cognitive tension dissipates — as does the person's ability to recall task-related information.

In UX terms, the Zeigarnik Effect can be used to create task-related cognitive tension which can help to keep users engaged and encourage them to return to a particular task.

**The takeaway:** Provide the user with visual indicators of incomplete tasks. This will build task-related tension and encourage them to return to, and engage with, the task at hand.

**Real-world example:** Duolingo's skill tree shows each lesson as a circle that's visibly unfilled or cracked until completed, and the daily streak counter resets to zero if you break it. Both are deliberate, unresolved-tension devices — the incomplete circle and the at-risk streak are why people open the app on days they'd otherwise skip.

---

## The Laws of UX: Additional Principles

### 17. Doherty Threshold
According to the Doherty Threshold, users expect an instant response when interacting with a computer — instant being 400 milliseconds or less.

If you're interacting with a website, you expect feedback on your actions. For example, if you're shopping online and you click "Add to basket", you want clear confirmation that the action was successful — and you want it fast.

The Doherty Threshold states that users should receive feedback within 400 milliseconds if they are to perceive the experience as smooth and productive.

**The takeaway:** Reward every user action or interaction with clear and instant feedback. Even if the process itself takes longer, provide the user with a progress bar or a timer so they know that something's in motion.

**Real-world example:** Google's search box has shown live autocomplete suggestions on every keystroke for years, well under the 400ms threshold — search feels productive before the user has even finished typing or pressed enter, which is precisely the perception the Doherty Threshold predicts.

### 18. Occam's Razor
Occam's Razor is a problem-solving principle that suggests that the simplest solution is often the best solution.

As a rule of thumb, every element in your design should serve a purpose. If it doesn't add any specific value for the user or help to enhance the user experience in some way, remove it.

Occam's Razor helps UX designers to prioritise usability, functionality, and clarity, removing unnecessary clutter and complexity. It's similar to the KISS principle which reminds us to "Keep it simple, stupid!"

**The takeaway:** Consider your design complete when there's nothing more you could possibly remove without compromising functionality.

**Real-world example:** Basecamp has built its entire product philosophy — publicly documented for years by founder Jason Fried — around shipping the fewest features that solve the real problem, rather than matching competitors feature-for-feature. Their marketing site and product UI both reflect that: plain language, few screens, no feature bloat.

### 19. Pareto Principle
The Pareto Principle is an 80/20 rule that says that around 80% of the effects come from 20% of the causes.

Although the Pareto Principle derives from economics, it's also useful for UX design. Because not all features or design elements will hold equal weight in shaping the user experience, the Pareto Principle encourages designers to focus their efforts on the areas that will have the biggest impact.

If you're looking to improve your website, for example, you don't need to redesign it from top to bottom. Rather, you can focus on one or two aspects (the 20%) that will make the most difference (80%).

**The takeaway:** Conduct research and testing to identify the features and elements that have the biggest impact on the user experience — and focus most of your efforts there.

**Real-world example:** Amazon is famous for running enormous numbers of A/B tests on its checkout and product-page "buy box" specifically, while leaving most other pages comparatively static — because that small slice of the site drives the overwhelming majority of revenue. For textevs, the equivalent 20% is the hero and the contact/CTA path, not the demos page.

### 20. Postel's Law
Postel's Law states that you should be flexible in terms of what you accept from your users while limiting what you ask of them.

The easiest way to explain Postel's Law is with the example of a form. When designing a form, you want to make it as straightforward as possible for the user to fill out. One way to do that is to be liberal in terms of what answers and input you'll accept.

This flexible approach makes the experience hassle-free for the user. At the same time, you want to limit what you ask of them — so, when designing your form, you'll only include questions that are really and truly necessary.

**The takeaway:** Anticipate the different inputs your users might provide or the actions they might take within a given scenario, and design to accommodate them.

**Real-world example:** Stripe's card number field accepts digits typed with or without spaces, and auto-formats them either way; its expiry field accepts `MM/YY`, `MM YY`, or `MMYY` without erroring. The form asks for the minimum necessary fields but is deliberately loose about how those fields get filled in.

### 21. Tesler's Law
According to Tesler's Law, every system has a certain degree of complexity that cannot be reduced.

UX design is all about creating smooth, intuitive, hassle-free experiences. Often, this favours ease, simplicity, and clarity. However, Tesler's Law reminds us that simplification has its limits. Every system has a degree of intrinsic complexity that can only be boiled down to a certain point.

Oversimplification beyond that point compromises the system or product's functionality — which results in a bad user experience. Ultimately, not all complications or complexities can be designed away.

**The takeaway:** Aim for utmost simplicity in the user experience, but don't seek to simplify the system itself to the detriment of functionality.

**Real-world example:** Booking a ride in Uber looks like one button tap, but that tap triggers driver matching, live routing, dynamic pricing, and payment processing — genuinely complex problems that didn't disappear, they were just moved off the user's screen and onto Uber's backend. Tesler's Law is why that complexity had to go *somewhere*, not vanish.

---

## How to Use the Laws of UX

That's a mighty long list of UX laws — but don't get too hung up on remembering all of them, all of the time. As design decisions get made on textevs, most of these 21 laws boil down to three recurring questions:

- **Prioritise simplicity and clarity** — could this element be removed or simplified without losing function? (Occam's Razor, Tesler's Law, Hick's Law, Miller's Law)
- **Match users' mental models** — is this behaving the way similar sites already taught people to expect? (Jakob's Law, Law of Similarity, Law of Common Region)
- **Limit cognitive and motivational friction** — is progress visible, is feedback instant, and is the highest-value 20% of the page getting 80% of the design attention? (Goal-Gradient Effect, Doherty Threshold, Pareto Principle, Zeigarnik Effect)
