import { Request, Response } from "express";
import { prisma } from "../../database/migrations/connect";
import { getToken } from "../../utils/bearerDecrypt";

class TransfersController {
  // criar uma nova transferência e vincular a uma
  // subcategoria por meio da entidade TransfersSubCategory
  async create(req: Request, res: Response) {
    // receber quantia pelo corpo da requisição
    const { amount, date, description, paymenthMethodId } = req.body;

    // receber o id da subcategoria e pelos parâmetros da requisição
    const { id, categoryId } = req.params;

    // verificar possível nulidade da quantia e da data
    if (amount == null || date == null) {
      res.status(400).json({
        status: "error",
        message: "Amount and date cannot be null",
      });
    }

    // transformar a string de data recebida para um object date
    const registerDate = new Date(date);

    // verificar possível nulidade do id da subcategoria ou da categoria
    if (id == null || categoryId == null) {
      res.status(400).json({
        status: "error",
        message: "SubCategoryId cannot be null",
      });
    }

    // verificar possível nulidade do id do método de pagamento
    if (paymenthMethodId == null) {
      res.status(400).json({
        status: "error",
        message: "PaymentMethodId cannot be null",
      });
    }

    try {
      // capturar id do usuário do token
      const decryptToken = getToken(req, res);

      if (!decryptToken) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      // parsear o id da categoria para numero
      const categoryIdNumber = parseInt(categoryId);

      // verificar se categoria selecionada pertence ao usuário logado
      const category = await prisma.category.findFirst({
        where: {
          id: categoryIdNumber,
          userId: decryptToken.id,
        },
      });

      if (!category) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      // parsear o id da subcategoria para número
      const subCategoryId = parseInt(id);

      // verificar se a subcategoria pertence a categoria selecionada
      const subCategory = await prisma.subCategory.findFirst({
        where: {
          id: subCategoryId,
          categoryId: categoryIdNumber,
        },
      });

      if (!subCategory) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      // verificar se o método de pagamento pertence ao usuário logado
      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          id: paymenthMethodId,
          userId: decryptToken.id,
        },
      });

      if (!paymentMethod) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      //  criar uma nova transferência
      const newTransfer = await prisma.transfers.create({
        data: {
          amount,
          date: registerDate,
          userId: decryptToken.id,
          description,
        },
      });

      // vincular a transferência a uma subcategoria
      const newTransfersSubCategory = await prisma.transfersSubCategory.create({
        data: {
          transfersId: newTransfer.id,
          subCategoryId,
        },
      });

      // parsear o id do método de pagamento para número
      const paymentMethodId = parseInt(paymenthMethodId);

      // vincular a transferência da subcategoria com um método de pagamento
      const newTSCP = await prisma.transfersSubCategoryPaymentMethod.create({
        data: {
          transfersSubCategoryId: newTransfersSubCategory.id,
          paymentMethodId,
        },
      });

      // retornar a transferência criada
      return res.status(201).json({
        status: "success",
        data: newTSCP,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }

  // listar todas as transferências de um usuário
  async list(req: Request, res: Response) {
    try {
      // capturar id do usuário do token
      const decryptToken = getToken(req, res);

      if (!decryptToken) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      // listar todas as transferências de um usuário
      const transfers = await prisma.transfers.findMany({
        where: {
          userId: decryptToken.id,
        },
      });

      // retornar a lista de transferências
      return res.status(200).json({
        status: "success",
        data: transfers,
      });

      // retornar um erro caso não encontre nenhuma transferência
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 51)",
      });
    }
  }

  // atualizar uma transferência
  async update(req: Request, res: Response) {
    // receber o id da transferência pelos parâmetros da requisição
    const { id } = req.params;

    // receber os dados da transferência pelo corpo da requisição
    const { amount, date, description } = req.body;

    // verificar possível nulidade da quantia e da data
    if (amount == null || date == null) {
      res.status(400).json({
        status: "error",
        message: "Amount and date cannot be null",
      });
    }

    // verificar possível nulidade do id da transferência
    if (id == null) {
      res.status(400).json({
        status: "error",
        message: "TransferId cannot be null",
      });
    }

    try {
      // capturar id do usuário do token
      const decryptToken = getToken(req, res);

      if (!decryptToken) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      // parsear o id da transferência para número
      const transferId = parseInt(id);

      // verficar se transferencia pertence ao usuário logado
      const transfer = await prisma.transfers.findFirst({
        where: {
          id: transferId,
          userId: decryptToken.id,
        },
      });

      if (!transfer) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      // atualizar uma transferência
      const updatedTransfer = await prisma.transfers.update({
        where: {
          id: transferId,
        },
        data: {
          amount,
          date,
          description,
        },
      });

      // retornar a transferência atualizada
      return res.status(200).json({
        status: "success",
        data: updatedTransfer,
      });

      // retornar um erro caso não encontre nenhuma transferência
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 52)",
      });
    }
  }

  // deletar uma transferência
  async delete(req: Request, res: Response) {
    // receber o id da transferência pelos parâmetros da requisição
    const { id } = req.params;

    // verificar possível nulidade do id da transferência
    if (id == null) {
      res.status(400).json({
        status: "error",
        message: "TransferId cannot be null",
      });
    }

    try {
      // capturar id do usuário do token
      const decryptToken = getToken(req, res);

      if (!decryptToken) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      // parsear o id da transferência para número
      const transferId = parseInt(id);

      // verificar se transferencia pertence ao usuário logado
      const transfer = await prisma.transfers.findFirst({
        where: {
          id: transferId,
          userId: decryptToken.id,
        },
      });

      if (!transfer) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      // deletar uma transferência
      const deletedTransfer = await prisma.transfers.delete({
        where: {
          id: transferId,
        },
      });

      // retornar a transferência deletada
      return res.status(200).json({
        status: "success",
        data: deletedTransfer,
      });

      // retornar um erro caso não encontre nenhuma transferência
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 53)",
      });
    }
  }
}

export default new TransfersController();
