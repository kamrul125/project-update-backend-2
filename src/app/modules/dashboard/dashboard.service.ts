import { prisma } from '../../../config/prisma';

export const getOverviewStats = async () => {
  const [totalUsers, totalIdeas, totalVotes] = await Promise.all([
    prisma.user.count(),
    prisma.idea.count(),
    prisma.vote.count(),
  ]);

  return {
    totalUsers,
    totalIdeas,
    totalVotes,
  };
};

export const getChartData = async () => {
  const ideasByCategory = await prisma.idea.groupBy({
    by: ['categoryId'],
    _count: { id: true },
  });

  const categories = await prisma.category.findMany({
    where: { id: { in: ideasByCategory.map((item) => item.categoryId) } },
    select: { id: true, name: true },
  });

  const categoryChart = ideasByCategory.map((item) => ({
    categoryId: item.categoryId,
    categoryName: categories.find((cat) => cat.id === item.categoryId)?.name || 'Unknown',
    ideaCount: item._count.id,
  }));

  const recentIdeas = await prisma.idea.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const activityByDate = recentIdeas.reduce((acc: Record<string, number>, idea) => {
    const date = idea.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const activityChart = Object.entries(activityByDate).map(([date, count]) => ({
    date,
    ideasCreated: count,
  }));

  return {
    categoryChart,
    activityChart,
  };
};

export const getUserMetrics = async (page = 1, limit = 10, role?: string) => {
  const where: any = {};
  if (role) where.role = role;

  const total = await prisma.user.count({ where });
  const currentPage = page;
  const totalPages = Math.ceil(total / limit);

  const users = await prisma.user.findMany({
    where,
    skip: (currentPage - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    users,
    total,
    totalPages,
    currentPage,
  };
};