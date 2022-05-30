import { Request, Response } from "express";
import { prisma } from "../../database/migrations/connect";

class CategoryController {
  // criar nova categoria
  async create(req: Request, res: Response) {
    const { name } = req.body;
    const category = prisma.category;
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

      const isCategory = await category.findFirst({
        where: {
          name,
        },
      });

      if (isCategory) {
        return res.status(400).json({
          status: "error",
          message: "Category already exists",
        });
      }

      const newCategory = await category.create({
        data: {
          name,
        },
      });

      return res.status(201).json({
        status: "success",
        data: newCategory,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }
  // listar todas as categorias
  async list(req: Request, res: Response) {
    const category = prisma.category;
    try {
      const categories = await category.findMany();

      return res.status(200).json({
        status: "success",
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }
  // atualizar categoria
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const numberId = Number(id);
    const { name } = req.body;
    const category = prisma.category;
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

      const isCategory = await category.findUnique({
        where: {
          id: numberId,
        },
      });

      if (!isCategory) {
        return res.status(400).json({
          status: "error",
          message: "Category not found",
        });
      }

      const updateCategory = await category.update({
        where: {
          id: numberId,
        },
        data: {
          name,
        },
      });

      return res.status(200).json({
        status: "success",
        data: updateCategory,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }
  // deletar categoria
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const numberId = Number(id);
    const category = prisma.category;
    try {
      const isCategory = await category.findUnique({
        where: {
          id: numberId,
        },
      });

      if (!isCategory) {
        return res.status(400).json({
          status: "error",
          message: "Category not found",
        });
      }

      await category.delete({
        where: {
          id: numberId,
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Category deleted",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }
}

export default new CategoryController();
