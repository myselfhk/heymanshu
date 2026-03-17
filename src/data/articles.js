export const ARTICLES = [
  {
    slug: 'startup-ux-fails',
    num: '01',
    tag: 'Product Design',
    title: 'Why most startup UX fails before the first wireframe',
    excerpt: "The problem isn't bad design. It's that design started too late in the conversation.",
    readTime: '4 min',
    date: 'November 2024',
    sections: [
      {
        heading: null,
        paragraphs: [
          "There's a pattern I've seen across every early-stage company I've worked with. The product gets built. The engineering team ships. The design team produces screens. And then — somewhere around the first user test or the first investor demo — someone says: \"this doesn't quite feel right.\"",
          "At that point, the conversation turns to design. What colour is the button? Is the font right? Should the nav be on the left or the top?",
          "But the problem isn't the button. The problem is that design was never part of the conversation about what to build.",
        ],
      },
      {
        heading: 'The symptom vs. the cause',
        paragraphs: [
          "Most startup UX failures look like design failures. They present as bad screens, confusing flows, ugly interfaces. So the natural response is to hire a designer. Or rebrand. Or do a UX audit.",
          "Those things can help. But they're treating the symptom.",
          "The cause is almost always earlier: a product decision was made — what to build, for whom, in what context — without design thinking in the room. By the time a designer sees the problem, the architecture is already set. The constraints are already baked in. The designer is being asked to make something feel good that was never designed to feel good.",
        ],
        pullQuote: "By the time a designer sees the problem, the architecture is already set.",
      },
      {
        heading: 'What happens when design is in the room earlier',
        paragraphs: [
          "I don't mean earlier in the project timeline, though that's part of it. I mean earlier in the decision-making chain.",
          "When a designer is in the room when the team is deciding what problem to solve, something shifts. The questions change. Instead of \"how do we build this feature?\" you start asking \"why would someone need this? What were they doing before this existed? What do they feel the first time they use it?\"",
          "Those are design questions. But they're also product questions. They're business questions. They're the questions that determine whether what you build will be used.",
        ],
      },
      {
        heading: 'The practical implication',
        paragraphs: [
          "If you're a founder and you're not yet at the stage where you can hire a full-time designer: find someone you can talk to before you build, not after. Even one conversation about the user's experience before a sprint begins will change the output.",
          "If you're a designer working at a startup: your most important contribution isn't the screens. It's being present when the team decides what problem to work on next.",
          "The wireframes come later. The thinking that determines whether the wireframes will work — that has to come first.",
        ],
      },
    ],
  },
  {
    slug: 'design-system-shared-language',
    num: '02',
    tag: 'Design Systems',
    title: "A design system isn't a Figma file. It's a shared language.",
    excerpt: "One button existed in 34 variations across the app. Here's how that happens — and how you stop it.",
    readTime: '6 min',
    date: 'January 2025',
    sections: [
      {
        heading: null,
        paragraphs: [
          "When I joined the design team at Paytm, I did what I always do first: I went through the product as a user. Not to audit it, not to document it — just to feel it.",
          "Something felt uneven. Not broken — uneven. Like a road that's been repaired in patches over years: functionally passable, but you can feel every seam.",
          "It took a few weeks of digging to find out why. There were 34 different versions of the primary button.",
        ],
      },
      {
        heading: 'How 34 buttons happen',
        paragraphs: [
          "Nobody made a decision to have 34 buttons. That's the first thing to understand.",
          "Each variation was made by someone trying to solve a real problem. A team needed a button that fit a slightly different layout. Another team thought rounded corners felt friendlier for their user segment. A third team inherited a button from a contractor engagement and never replaced it.",
          "None of these were bad decisions in isolation. They were locally rational choices that globally added up to fragmentation.",
          "That's design debt. It's not bad taste. It's the absence of a shared standard — which means every team makes their own.",
        ],
        pullQuote: "Design debt is not bad taste. It's the absence of a shared standard.",
      },
      {
        heading: 'Why most design systems fail',
        paragraphs: [
          "Most design systems are built top-down. A designer (or a design team) builds a library of components, writes documentation, and hands it to the rest of the organisation as a set of rules.",
          "Rules built without the input of the people who have to follow them get worked around. Not maliciously — practically. When the component doesn't quite fit the use case, the team modifies it. Then they have a modified component. Then the modification becomes the de facto standard on that team. Then you have 34 buttons.",
          "The systems that stick are built differently. They start with the questions: what does each team actually build? Where do they currently go off-system? What's the thing in the existing library that doesn't quite work?",
          "The answers to those questions are the system. The designer's job is to codify what the organisation already knows, not to hand down a set of rules from above.",
        ],
      },
      {
        heading: 'What a shared language means in practice',
        paragraphs: [
          "When the Paytm design system was rebuilt with this approach, the shift wasn't just visual. The way teams talked about design problems changed.",
          "Before: \"we need a new button for this flow.\" After: \"the primary action button won't work here because of X — should we use the secondary or propose a new variant?\"",
          "That second conversation is happening in the vocabulary of the system. The team has a shared language for design decisions. That language is what makes the system stick — not the Figma file, not the documentation, not the component library.",
          "The Figma file is just where the language lives.",
        ],
      },
    ],
  },
  {
    slug: 'building-trust-digital-payments',
    num: '03',
    tag: 'Fintech',
    title: 'Building trust in digital payments: lessons from Woo',
    excerpt: "Users in Nigeria had real reasons not to trust digital money. Design had to earn that trust, not assume it.",
    readTime: '5 min',
    date: 'March 2025',
    sections: [
      {
        heading: null,
        paragraphs: [
          "When I started working on the Woo payments product, the most useful question I asked was not a design question.",
          "It was: why do people trust Ade at the market more than they trust an app?",
          "Ade is the mobile money agent. He's a person. You know where to find him. When you give him money and he gives you a receipt, there's a face attached to that transaction. If something goes wrong, you know who to talk to.",
          "An app doesn't have a face. It has a UI.",
        ],
      },
      {
        heading: 'The informal economy has better UX than most fintechs',
        paragraphs: [
          "That's a provocative way to put it, but it's essentially true. The informal agent network had solved the trust problem with a simple mechanism: receipts, faces, physical presence.",
          "Digital payments had solved the speed problem and the accessibility problem. They hadn't solved the trust problem. They assumed it was solved — that users would trust the technology because the technology worked.",
          "But technology working and technology feeling trustworthy are not the same thing. And in contexts where people have direct experience with digital products failing them — where a transfer goes through but the money doesn't arrive, where the app says success and the recipient says they didn't receive anything — trust has to be earned, not assumed.",
        ],
        pullQuote: "Technology working and technology feeling trustworthy are not the same thing.",
      },
      {
        heading: 'What we actually redesigned',
        paragraphs: [
          "We didn't redesign the Woo product. We redesigned five moments inside it.",
          "The confirmation screen. The failure state. The balance display. The transaction history. The receive notification.",
          "These were the moments where trust was won or lost. The product worked before we touched it — every transaction succeeded. What we changed was the evidence of success. The receipt. The record. The proof.",
        ],
      },
      {
        heading: 'The lesson that generalises',
        paragraphs: [
          "Fintech UX in emerging markets is often designed by teams who don't live in those markets. There's a tendency to think about the user as someone who needs to be educated into using digital money.",
          "That's exactly wrong. The users aren't uncertain about money — they're uncertain about the product. They have decades of mental models about how financial transactions work. What they need is a product that respects those mental models.",
          "In Nigeria, a transaction without a receipt doesn't feel complete. That's not a cultural quirk — it's a reasonable response to an environment where accountability for financial transactions has historically been low.",
          "Design that ignores this and ships a two-second success screen isn't bad design. It's design that didn't ask the right questions first.",
        ],
      },
    ],
  },
]
