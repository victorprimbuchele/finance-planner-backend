import { prisma } from "../../database/migrations/connect";

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
