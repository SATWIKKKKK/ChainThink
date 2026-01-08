import { prisma } from './prisma';

// Conversation queries
export async function getUserConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      model: true,
      updatedAt: true,
      messages: {
        take: 1,
        orderBy: { createdAt: 'asc' },
        select: { content: true },
      },
    },
  });
}

export async function getConversation(conversationId: string, userId: string) {
  return prisma.conversation.findFirst({
    where: { id: conversationId, userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

export async function createConversation(userId: string, model: string) {
  return prisma.conversation.create({
    data: {
      userId,
      model,
      title: 'New Chat',
    },
  });
}

export async function updateConversationTitle(conversationId: string, title: string) {
  return prisma.conversation.update({
    where: { id: conversationId },
    data: { title },
  });
}

export async function updateConversationModel(conversationId: string, model: string) {
  return prisma.conversation.update({
    where: { id: conversationId },
    data: { model },
  });
}

export async function deleteConversation(conversationId: string, userId: string) {
  // Verify ownership first
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });
  
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return prisma.conversation.delete({
    where: { id: conversationId },
  });
}

// Message queries
export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
) {
  // Update conversation timestamp and add message
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
}

export async function getMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
}

// Generate title from first message
export async function generateConversationTitle(firstMessage: string): Promise<string> {
  // Take first 50 characters or first sentence
  const cleaned = firstMessage.trim();
  const firstSentence = cleaned.split(/[.!?]/)[0];
  const title = firstSentence.length > 50 
    ? firstSentence.substring(0, 47) + '...'
    : firstSentence;
  return title || 'New Chat';
}
