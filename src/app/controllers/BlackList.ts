import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class BlackListController {
  async stopThisToken(token: string): Promise<void> {
    const blackList = prisma.blackList;

    await blackList.create({
      data: {
        token,
      },
    });
  }
}

export default new BlackListController();
