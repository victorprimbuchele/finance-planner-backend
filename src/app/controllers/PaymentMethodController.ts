import { Request, Response } from "express";
import { prisma } from "../../database/migrations/connect";
import { getToken } from "../../utils/bearerDecrypt";

// controlador de métodos de pagamento com crud
class PaymentMethodController {
  // criar novo método de pagamento
  async create(req: Request, res: Response) {
    const { name } = req.body;

    const decryptToken = getToken(req, res);

    if (!decryptToken) {
      return null;
    }

    try {
      if (name == null) {
        return res.status(400).json({
          status: "error",
          message: "Name cannot be null",
        });
      }

      if (name.length < 3) {
        return res.status(400).json({
          status: "error",
          message: "Name must be at least 3 characters",
        });
      }

      const newPaymentMethod = await prisma.paymentMethod.create({
        data: {
          name,
          userId: decryptToken.id,
        },
      });

      return res.status(201).json({
        status: "success",
        data: newPaymentMethod,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }

  // listar todos os métodos de pagamento
  async list(req: Request, res: Response) {
    try {
      const decryptToken = getToken(req, res);

      if (!decryptToken) {
        return null;
      }

      const paymentMethod = prisma.paymentMethod;

      const allPaymentMethods = await paymentMethod.findMany({
        where: {
          userId: decryptToken.id,
        },
      });

      return res.status(200).json({
        status: "success",
        data: allPaymentMethods,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }

  // atualizar método de pagamento
  async update(req: Request, res: Response) {
    const { name } = req.body;
    const { id } = req.params;

    try {
      if (name == null) {
        return res.status(400).json({
          status: "error",
          message: "Name cannot be null",
        });
      }

      if (name.length < 3) {
        return res.status(400).json({
          status: "error",
          message: "Name must be at least 3 characters",
        });
      }

      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "Id cannot be null",
        });
      }

      // capturar informações do token do usuário logado
      const decryptToken = getToken(req, res);

      if (!decryptToken) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      // verificar se o método de pagamento pertencer ao usuário logado
      const paymentMethodUser = await prisma.paymentMethod.findFirst({
        where: {
          id: Number(id),
          userId: decryptToken.id,
        },
      });

      if (!paymentMethodUser) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      const newPaymentMethod = await prisma.paymentMethod.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
        },
      });

      return res.status(200).json({
        status: "success",
        data: newPaymentMethod,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }

  // deletar método de pagamento
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "Id cannot be null",
        });
      }

      const numberId = Number(id);

      const paymentMethod = prisma.paymentMethod;

      const isPaymentMethod = await paymentMethod.findUnique({
        where: {
          id: numberId,
        },
      });

      if (!isPaymentMethod) {
        return res.status(400).json({
          status: "error",
          message: "Payment method not found",
        });
      }

      const deletePaymentMethod = await paymentMethod.delete({
        where: {
          id: numberId,
        },
      });

      return res.status(200).json({
        status: "success",
        data: deletePaymentMethod,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }
}

export default new PaymentMethodController();
