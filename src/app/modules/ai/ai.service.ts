import { prisma } from '../../../config/prisma';

const AI_TOPIC_KEYWORDS = [
  'Solar',
  'Plastic Recycling',
  'Water Conservation',
  'Urban Farming',
  'Energy Efficiency',
  'Zero Waste',
  'Sustainable Transportation',
  'Circular Economy',
  'Green Building',
  'Community Composting',
];

export const getSearchSuggestions = async (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const normalizedQuery = trimmed.toLowerCase();

  const [ideas, categories] = await Promise.all([
    prisma.idea.findMany({
      where: {
        OR: [
          { title: { contains: trimmed, mode: 'insensitive' } },
          { description: { contains: trimmed, mode: 'insensitive' } },
          { problem: { contains: trimmed, mode: 'insensitive' } },
          { solution: { contains: trimmed, mode: 'insensitive' } },
        ],
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: { select: { name: true } },
      },
    }),
    prisma.category.findMany({
      where: {
        name: { contains: trimmed, mode: 'insensitive' },
      },
      take: 5,
      orderBy: { name: 'asc' },
    }),
  ]);

  const ideaSuggestions = ideas.map((idea) => ({
    value: idea.title,
    label: `${idea.category?.name || 'General'} • idea`,
    description: idea.description,
    type: 'Idea',
    ideaId: idea.id,
  }));

  const categorySuggestions = categories.map((category) => ({
    value: category.name,
    label: `${category.name} • category`,
    type: 'Category',
  }));

  const keywordSuggestions = AI_TOPIC_KEYWORDS.filter((keyword) =>
    keyword.toLowerCase().includes(normalizedQuery)
  ).map((keyword) => ({
    value: keyword,
    label: `${keyword} • topic`,
    type: 'Topic',
  }));

  const fallbackTopics = AI_TOPIC_KEYWORDS.slice(0, 5).map((keyword) => ({
    value: keyword,
    label: `${keyword} • topic`,
    type: 'Topic',
  }));

  const suggestions = [
    ...categorySuggestions,
    ...keywordSuggestions,
    ...ideaSuggestions,
  ];

  if (suggestions.length === 0) {
    return fallbackTopics;
  }

  const seen = new Set<string>();
  return suggestions
    .filter((item) => {
      const key = `${item.type}:${item.value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
};

export const chatResponse = async (message: string) => {
  const normalized = message.trim().toLowerCase();
  const match = /help|support|suggest|search|idea/.test(normalized);

  if (match) {
    return 'Try searching by category or keyword. For example: "energy saving" or "zero waste". You can also browse active ideas and vote for the best projects.';
  }

  if (normalized.includes('vote')) {
    return 'To vote, open the idea detail page and submit an upvote. You can also filter by most voted projects on the explore page.';
  }

  return 'Welcome to EcoSpark AI support. Ask me about eco ideas, categories or how to get started with your own sustainable project.';
};