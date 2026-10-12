// Mock data for Medium clone
export const articles = [
  {
    id: 1,
    author: 'Ethan Mollick',
    avatar: 'EM',
    date: 'Jun 4',
    title: 'The AI Revolution Is Here — And Most People Are Missing It',
    subtitle: 'While everyone debates AI safety, the real transformation is happening in classrooms, hospitals, and small businesses right now.',
    tag: 'Artificial Intelligence',
    readTime: '8 min read',
    hasImage: true,
    imageUrl: 'https://picsum.photos/seed/ai1/224/224',
    responses: 142,
    isMember: true,
    content: `
      <p>Something remarkable is happening in the world of artificial intelligence, and most people are too distracted by the debates about existential risk to notice.</p>
      
      <p>While Silicon Valley argues about whether AI will destroy humanity, teachers in rural Kansas are using it to create personalized lesson plans for students who were falling behind. Doctors in Nigeria are using AI-powered diagnostic tools to catch diseases that would have been missed. Small business owners in Brazil are using it to compete with corporations that have entire marketing departments.</p>
      
      <h2>The Quiet Revolution</h2>
      
      <p>The real AI revolution isn't happening in the labs of OpenAI or Google. It's happening in the mundane, everyday applications that are transforming how ordinary people work, learn, and create.</p>
      
      <p>Consider Maria, a third-grade teacher in Wichita. Last year, she was spending 15 hours a week creating individualized learning materials for her 28 students. Now, she uses an AI tool that generates customized worksheets, reading comprehension exercises, and even creative writing prompts tailored to each student's reading level and interests.</p>
      
      <blockquote>"I was drowning in paperwork," Maria told me. "Now I actually have time to teach. The AI handles the repetitive stuff so I can focus on what matters — connecting with my students."</blockquote>
      
      <h2>The Numbers Don't Lie</h2>
      
      <p>A recent study by the Brookings Institution found that AI adoption in small businesses has increased by 340% in the past 18 months. But here's the surprising part: the biggest gains aren't in tech companies. They're in healthcare, education, agriculture, and local services.</p>
      
      <p>In healthcare, AI-powered diagnostic tools are helping doctors in underserved areas catch conditions like diabetic retinopathy and early-stage cancers that might otherwise go undetected. A study in Nature Medicine showed that AI-assisted diagnosis improved detection rates by 23% in rural clinics.</p>
      
      <h2>What This Means for You</h2>
      
      <p>If you're not paying attention to how AI is being used in your industry — not the hype, but the actual applications — you're already falling behind. The question isn't whether AI will transform your field. It's whether you'll be the one leading that transformation or scrambling to catch up.</p>
      
      <p>The good news? You don't need a PhD in computer science to benefit. The most impactful AI tools are designed for non-technical users. They're intuitive, affordable, and increasingly accessible.</p>
      
      <p>The revolution is here. It's just quieter than we expected.</p>
    `,
  },
  {
    id: 2,
    author: 'Tim Urban',
    avatar: 'TU',
    date: 'Jun 3',
    title: 'The Story of Us, Part 1: The Secret of Civilization',
    subtitle: 'How a species of chatty, anxious apes stumbled onto the most powerful trick in the universe.',
    tag: 'History',
    readTime: '22 min read',
    hasImage: true,
    imageUrl: 'https://picsum.photos/seed/history1/224/224',
    responses: 89,
    isMember: true,
    content: `
      <p>Let's start with a weird fact: humans are the only species on Earth that can cooperate flexibly in large groups.</p>
      
      <p>Ants cooperate, but only in rigid, genetically-programmed ways. Wolves cooperate, but only in small packs of 10-15 individuals. Chimpanzees can cooperate flexibly, but only in groups of about 50.</p>
      
      <p>Humans? We can cooperate flexibly with millions of strangers. We build cities, nations, corporations, and religions. We send people to the moon and split the atom. How?</p>
      
      <h2>The Power of Shared Stories</h2>
      
      <p>The answer, as Yuval Noah Harari famously argued, is our ability to believe in shared fictions. Money is a story. Nations are a story. Human rights are a story. Corporations are a story.</p>
      
      <p>These aren't lies — they're intersubjective realities. They exist because we collectively agree they exist. And that agreement allows us to coordinate at scales no other species can imagine.</p>
      
      <blockquote>"You can never convince a monkey to give you a banana by promising him limitless bananas after death in monkey heaven."</blockquote>
      
      <p>This ability to create and believe in shared stories is what allowed small bands of Homo sapiens to outcompete Neanderthals, who were bigger, stronger, and possibly smarter. We didn't win because of our individual abilities. We won because of our collective imagination.</p>
      
      <h2>The Agricultural Revolution: History's Biggest Trade</h2>
      
      <p>About 12,000 years ago, humans made a deal that would change everything. We traded our nomadic, hunter-gatherer lifestyle for settled agriculture.</p>
      
      <p>On the surface, this seems like progress. Farming produces more food per acre than foraging. But the reality was more complicated. Early farmers worked longer hours, ate a less varied diet, and suffered more diseases than their hunter-gatherer ancestors.</p>
      
      <p>So why did we do it? Because agriculture allowed us to support larger populations. And larger populations meant more complex societies, more specialized roles, and more powerful shared stories.</p>
      
      <h2>The Information Revolution</h2>
      
      <p>Fast forward to today, and we're in the middle of another revolution. The internet and AI are transforming how we create, share, and believe in stories.</p>
      
      <p>For the first time in history, a single person can reach billions of people with a story. This is both exhilarating and terrifying. It means that the stories we tell — and believe — matter more than ever.</p>
      
      <p>The secret of civilization isn't technology or intelligence. It's our ability to create shared fictions that allow us to cooperate at scale. The question for our generation is: what stories will we choose to believe?</p>
    `,
  },
  {
    id: 3,
    author: 'Lenny Rachitsky',
    avatar: 'LR',
    date: 'Jun 2',
    title: 'The Growth Framework That Actually Works',
    subtitle: 'After studying 500+ companies, here\'s what separates the ones that grow from the ones that stall.',
    tag: 'Startups',
    readTime: '11 min read',
    hasImage: false,
    responses: 67,
    isMember: false,
    content: `
      <p>After interviewing over 500 growth leaders at companies like Airbnb, Uber, Dropbox, and Slack, I've noticed a pattern. The companies that sustain growth all share one thing in common.</p>
      
      <p>It's not a secret hack. It's not a viral loop. It's not even a great product (though that helps).</p>
      
      <p>It's a growth framework.</p>
      
      <h2>The ICE Framework</h2>
      
      <p>The most successful growth teams use a simple framework to prioritize their work. They call it ICE:</p>
      
      <ul>
        <li><strong>Impact:</strong> How big could this be if it works?</li>
        <li><strong>Confidence:</strong> How sure are we that it will work?</li>
        <li><strong>Ease:</strong> How easy is it to implement?</li>
      </ul>
      
      <p>Every growth idea gets scored on these three dimensions. Then you prioritize the ones with the highest total score.</p>
      
      <p>Simple, right? But here's the thing: most companies don't do this. They either chase the shiniest idea, or they try to do everything at once.</p>
      
      <h2>The North Star Metric</h2>
      
      <p>The second thing successful growth teams have is a North Star Metric — a single number that captures the core value your product delivers to customers.</p>
      
      <p>For Airbnb, it's "nights booked." For Facebook, it's "daily active users." For Slack, it's "messages sent."</p>
      
      <p>Your North Star Metric should be:</p>
      
      <ul>
        <li>A leading indicator of revenue (not revenue itself)</li>
        <li>Something that reflects customer value</li>
        <li>Measurable and actionable</li>
      </ul>
      
      <h2>The Growth Loop</h2>
      
      <p>The final piece of the puzzle is the growth loop — a self-reinforcing cycle where growth feeds more growth.</p>
      
      <p>Airbnb's loop: More listings → More guests → More reviews → More listings.</p>
      
      <p>Dropbox's loop: More users → More shared folders → More invited users → More users.</p>
      
      <p>The key is to identify and optimize your loop, not just your funnel.</p>
      
      <h2>Putting It Together</h2>
      
      <p>Here's the framework in action:</p>
      
      <ol>
        <li>Define your North Star Metric</li>
        <li>Map your growth loop</li>
        <li>Generate ideas to improve the loop</li>
        <li>Score ideas with ICE</li>
        <li>Run experiments on the top-scoring ideas</li>
        <li>Double down on what works</li>
      </ol>
      
      <p>It's not glamorous. It's not a hack. But it works.</p>
    `,
  },
  {
    id: 4,
    author: 'Anne-Laure Le Cunff',
    avatar: 'AL',
    date: 'Jun 1',
    title: 'The Curiosity Cycle: A New Framework for Learning Anything',
    subtitle: 'Why the traditional model of goal-setting fails learners, and what to do instead.',
    tag: 'Learning',
    readTime: '7 min read',
    hasImage: true,
    imageUrl: 'https://picsum.photos/seed/learn1/224/224',
    responses: 45,
    isMember: true,
    content: `
      <p>We've all been told the same thing: set clear goals, make a plan, execute relentlessly. But what if this approach is fundamentally flawed for learning?</p>
      
      <p>The problem with goal-setting for learning is that it assumes you know what you don't know. You can't set a goal to "learn machine learning" if you don't yet understand what machine learning involves.</p>
      
      <h2>The Curiosity Cycle</h2>
      
      <p>Instead of goals, I propose a different approach: the Curiosity Cycle. It has four phases:</p>
      
      <ol>
        <li><strong>Explore:</strong> Follow your curiosity without direction. Read broadly. Watch videos. Talk to people. Cast a wide net.</li>
        <li><strong>Notice:</strong> Pay attention to what excites you. What topics make you lose track of time? What questions keep nagging at you?</li>
        <li><strong>Deepen:</strong> Once you've found something that excites you, go deep. Take a course. Read a book. Build a project.</li>
        <li><strong>Share:</strong> Teach what you've learned. Write about it. Explain it to a friend. This solidifies your understanding and attracts new opportunities.</li>
      </ol>
      
      <blockquote>"The important thing is not to stop questioning. Curiosity has its own reason for existing." — Albert Einstein</blockquote>
      
      <h2>Why This Works</h2>
      
      <p>The Curiosity Cycle works because it aligns with how our brains actually learn. Neuroscience shows that curiosity activates the brain's reward system, releasing dopamine that makes learning feel pleasurable.</p>
      
      <p>When you're curious, you're not just more motivated — you actually retain information better. A study in Neuron found that curiosity improved memory retention by 30%.</p>
      
      <h2>Practical Application</h2>
      
      <p>Here's how to apply the Curiosity Cycle in your own life:</p>
      
      <ul>
        <li>Block 30 minutes each day for "curiosity time" — no agenda, just exploration</li>
        <li>Keep a curiosity journal to track what interests you</li>
        <li>Set a minimum of one "deep dive" per month on a topic that excites you</li>
        <li>Share your learning through writing, speaking, or teaching</li>
      </ul>
      
      <p>The traditional goal-setting approach works for tasks with clear endpoints. But learning is a lifelong journey. The Curiosity Cycle is designed for the long game.</p>
    `,
  },
  {
    id: 5,
    author: 'Casey Newton',
    avatar: 'CN',
    date: 'May 31',
    title: 'The Social Media Era Is Ending. What Comes Next?',
    subtitle: 'Platform decay is accelerating. The next chapter of the internet will look very different.',
    tag: 'Technology',
    readTime: '14 min read',
    hasImage: true,
    imageUrl: 'https://picsum.photos/seed/social1/224/224',
    responses: 203,
    isMember: false,
    content: `
      <p>Something strange is happening to social media. After 15 years of explosive growth, the major platforms are all showing signs of decay.</p>
      
      <p>Twitter is hemorrhaging users and advertisers. Facebook's user base is aging. Instagram is drowning in ads. TikTok faces potential bans. Even the mighty Google is struggling to keep up with AI-powered search.</p>
      
      <p>What's going on?</p>
      
      <h2>The Platform Decay Cycle</h2>
      
      <p>I've been covering social media for over a decade, and I've noticed a pattern I call the Platform Decay Cycle:</p>
      
      <ol>
        <li><strong>Growth:</strong> A new platform launches with a novel experience. Users flock to it.</li>
        <li><strong>Monetization:</strong> The platform needs to make money. It introduces ads and algorithmic feeds.</li>
        <li><strong>Optimization:</strong> The platform optimizes for engagement, not user satisfaction. Content quality declines.</li>
        <li><strong>Decay:</strong> Users get frustrated. They spend less time on the platform or leave entirely.</li>
        <li><strong>Disruption:</strong> A new platform emerges with a better experience. The cycle begins again.</li>
      </ol>
      
      <p>We've seen this cycle play out with MySpace, Friendster, Vine, and now we're seeing it with the current generation of platforms.</p>
      
      <h2>What Comes Next?</h2>
      
      <p>The next chapter of the internet won't be about social media as we know it. It will be about something more personal, more intentional, and more human.</p>
      
      <p>I see three emerging trends:</p>
      
      <ul>
        <li><strong>Small communities:</strong> Discord servers, private Slack groups, and niche forums where people actually know each other.</li>
        <li><strong>AI-powered personalization:</strong> Instead of algorithmic feeds designed to maximize engagement, AI assistants that help you find what you actually need.</li>
        <li><strong>Creative tools:</strong> Platforms that empower creators to make things, not just consume things.</li>
      </ul>
      
      <h2>The End of the Attention Economy</h2>
      
      <p>The social media era was built on the attention economy — the idea that our attention is a resource to be harvested and sold to advertisers.</p>
      
      <p>But people are tired of being harvested. They want tools that respect their time, not exploit it. They want communities that enrich their lives, not drain them.</p>
      
      <p>The social media era is ending. What comes next will be better — if we build it right.</p>
    `,
  },
  {
    id: 6,
    author: 'Paul Graham',
    avatar: 'PG',
    date: 'May 30',
    title: 'How to Think for Yourself',
    subtitle: 'The most valuable skill in the age of AI isn\'t coding — it\'s independent thinking.',
    tag: 'Essays',
    readTime: '6 min read',
    hasImage: false,
    responses: 312,
    isMember: true,
    content: `
      <p>There's a popular question these days: "What skills will be valuable in the age of AI?" People usually answer with things like "prompt engineering" or "data science" or "creativity."</p>
      
      <p>But I think the most valuable skill is something more fundamental: the ability to think for yourself.</p>
      
      <h2>What Does It Mean to Think for Yourself?</h2>
      
      <p>Thinking for yourself doesn't mean being contrarian or rejecting conventional wisdom. It means forming your own opinions based on evidence and reason, rather than simply adopting the views of your social group.</p>
      
      <p>Most people don't think for themselves. They outsource their opinions to:
      </p>
      
      <ul>
        <li>Their political party</li>
        <li>Their social media feed</li>
        <li>Their professional community</li>
        <li>Their family and friends</li>
      </ul>
      
      <p>This is understandable. Thinking for yourself is hard. It requires effort, uncertainty, and the risk of being wrong.</p>
      
      <h2>Why It Matters More Than Ever</h2>
      
      <p>In the age of AI, the ability to think for yourself becomes more valuable because AI can do everything else.</p>
      
      <p>AI can write code, analyze data, generate creative content, and even reason about complex problems. But it can't tell you what to care about. It can't form your values. It can't decide what's worth pursuing.</p>
      
      <p>That's your job.</p>
      
      <h2>How to Develop This Skill</h2>
      
      <p>Here are some practical ways to develop independent thinking:</p>
      
      <ol>
        <li><strong>Read widely:</strong> Expose yourself to different perspectives, especially ones you disagree with.</li>
        <li><strong>Write regularly:</strong> Writing forces you to clarify your thoughts and identify gaps in your reasoning.</li>
        <li><strong>Seek out disagreement:</strong> Surround yourself with people who challenge your views, not just confirm them.</li>
        <li><strong>Update your beliefs:</strong> When you encounter new evidence, be willing to change your mind.</li>
      </ol>
      
      <blockquote>"The test of a first-rate intelligence is the ability to hold two opposed ideas in mind at the same time and still retain the ability to function." — F. Scott Fitzgerald</blockquote>
      
      <p>In a world where everyone has access to the same AI tools, the people who stand out will be the ones who can think independently about what to do with those tools.</p>
    `,
  },
  {
    id: 7,
    author: 'Nat Eliason',
    avatar: 'NE',
    date: 'May 29',
    title: 'I Moved to Japan for a Year. Here\'s What Surprised Me.',
    subtitle: 'The things no one tells you about daily life in Tokyo.',
    tag: 'Travel',
    readTime: '9 min read',
    hasImage: true,
    imageUrl: 'https://picsum.photos/seed/japan1/224/224',
    responses: 78,
    isMember: false,
    content: `
      <p>When I told friends I was moving to Tokyo for a year, the reactions were predictable: "Oh, you'll love it! The food is amazing! The trains are so efficient! Everyone is so polite!"</p>
      
      <p>They were right about all of that. But there's a lot they didn't mention.</p>
      
      <h2>The Silence</h2>
      
      <p>The first thing that surprised me about Tokyo was how quiet it is. Not in the countryside — in the city center. One of the world's largest metropolitan areas is eerily silent.</p>
      
      <p>People don't talk on their phones on the train. They don't honk horns. They don't play music out loud. Walking through Shibuya at rush hour, you'll hear footsteps, traffic signals, and not much else.</p>
      
      <p>It's not that Japanese people are suppressing their natural desire to be loud. They genuinely value quiet shared spaces. And after a few months, you start to appreciate it.</p>
      
      <h2>The Convenience Stores</h2>
      
      <p>I knew Japanese convenience stores (konbini) were good. I didn't know they were life-changing.</p>
      
      <p>At any 7-Eleven, Lawson, or FamilyMart, you can:</p>
      
      <ul>
        <li>Get a genuinely delicious meal for under $5</li>
        <li>Pay your bills</li>
        <li>Print documents</li>
        <li>Buy concert tickets</li>
        <li>Ship packages</li>
        <li>Use a clean, well-maintained bathroom</li>
      </ul>
      
      <p>They're open 24/7, and the staff is unfailingly polite. I've come to believe that convenience stores are the backbone of Japanese society.</p>
      
      <h2>The Food</h2>
      
      <p>Yes, the sushi is incredible. But what really surprised me was how good the everyday food is.</p>
      
      <p>A $3 bowl of ramen from a random train station is better than most ramen I've had in the US. A $1 rice ball (onigiri) from a convenience store is perfectly seasoned and satisfying. Even the bread at the local bakery is exceptional.</p>
      
      <p>The Japanese approach to food is simple: do one thing, and do it exceptionally well. This philosophy applies to everything from Michelin-starred restaurants to tiny standing bars.</p>
      
      <h2>What I'll Miss</h2>
      
      <p>When I leave Japan, I'll miss the obvious things: the food, the trains, the safety. But I'll also miss the less obvious things: the quiet, the convenience stores, the way strangers bow slightly when they accidentally bump into you.</p>
      
      <p>Japan isn't perfect. The work culture can be brutal. The bureaucracy is maddening. And as a foreigner, you'll always be an outsider.</p>
      
      <p>But for a year of my life, it was exactly where I needed to be.</p>
    `,
  },
  {
    id: 8,
    author: 'James Clear',
    avatar: 'JC',
    date: 'May 28',
    title: 'The 2-Minute Rule Is Just the Beginning',
    subtitle: 'Building on the foundation of tiny habits to create lasting change.',
    tag: 'Productivity',
    readTime: '5 min read',
    hasImage: false,
    responses: 156,
    isMember: true,
    content: `
      <p>You've probably heard of the 2-Minute Rule: if a task takes less than two minutes, do it now.</p>
      
      <p>It's a great rule. But I think most people misunderstand it. They think it's about getting small tasks done quickly. It's not.</p>
      
      <p>The real power of the 2-Minute Rule is that it's a gateway to building habits.</p>
      
      <h2>The Gateway Habit</h2>
      
      <p>When I talk about the 2-Minute Rule, I'm not saying "do small tasks." I'm saying "shrink your habits down to two minutes."</p>
      
      <p>Want to read more? Don't set a goal to read 30 pages a day. Start with "read one page."</p>
      
      <p>Want to exercise? Don't commit to an hour at the gym. Start with "put on your running shoes."</p>
      
      <p>Want to meditate? Don't aim for 20 minutes of mindfulness. Start with "take three deep breaths."</p>
      
      <p>The goal is not to do the thing for two minutes. The goal is to become the kind of person who does the thing. The two-minute version is just the entry point.</p>
      
      <h2>The Habit Loop</h2>
      
      <p>Every habit follows the same loop:</p>
      
      <ol>
        <li><strong>Cue:</strong> The trigger that initiates the behavior</li>
        <li><strong>Craving:</strong> The motivation or desire for the reward</li>
        <li><strong>Response:</strong> The actual behavior</li>
        <li><strong>Reward:</strong> The benefit you get from the behavior</li>
      </ol>
      
      <p>The 2-Minute Rule works because it makes the "response" step so easy that there's no friction. You're not trying to run a marathon. You're just putting on your shoes.</p>
      
      <h2>Scaling Up</h2>
      
      <p>Once you've established the habit of showing up, you can gradually increase the intensity.</p>
      
      <p>Week 1: Read one page.</p>
      <p>Week 2: Read two pages.</p>
      <p>Week 3: Read five pages.</p>
      <p>Week 4: Read ten pages.</p>
      
      <p>Within a month, you're reading 10 pages a day without feeling like you're forcing it. The habit is established. The identity is formed.</p>
      
      <blockquote>"You do not rise to the level of your goals. You fall to the level of your systems." — James Clear</blockquote>
      
      <p>The 2-Minute Rule is just the beginning. It's the foundation upon which lasting change is built.</p>
    `,
  },
];

export const staffPicks = [
  {
    id: 1,
    author: 'Ali Abdaal',
    avatar: 'AA',
    title: 'The Productivity Paradox: Why Doing Less Gets You More',
  },
  {
    id: 2,
    author: 'Maria Popova',
    avatar: 'MP',
    title: 'On the Art of Paying Attention in a Distracted World',
  },
  {
    id: 3,
    author: 'David Perell',
    avatar: 'DP',
    title: 'Writing Online Changed My Life. Here\'s How to Start.',
  },
];

export const recommendedTopics = [
  'Technology', 'Self Improvement', 'Writing', 'Relationships',
  'Machine Learning', 'Productivity', 'Politics',
];

export const whoToFollow = [
  {
    id: 1,
    name: 'Packy McCormick',
    avatar: 'PM',
    desc: 'Writer of Not Boring. Exploring the most important companies and ideas in business and tech.',
  },
  {
    id: 2,
    name: 'Sahil Lavingia',
    avatar: 'SL',
    desc: 'CEO @ Gumroad. Author of The Minimalist Entrepreneur.',
  },
  {
    id: 3,
    name: 'Shaan Puri',
    avatar: 'SP',
    desc: 'Co-host of My First Million. Serial entrepreneur and investor.',
  },
];

export const footerLinks = [
  'Help', 'Status', 'About', 'Careers',
  'Blog', 'Privacy', 'Terms', 'Text to speech',
  'Teams',
];

export const subNavItems = [
  { label: 'For you', active: true },
  { label: 'Following', active: false },
  { label: 'Technology', active: false },
  { label: 'Finance', active: false },
  { label: 'AI', active: false },
  { label: 'Productivity', active: false },
  { label: 'Self Improvement', active: false },
  { label: 'Writing', active: false },
  { label: 'Data Science', active: false },
  { label: 'Entrepreneurship', active: false },
];
