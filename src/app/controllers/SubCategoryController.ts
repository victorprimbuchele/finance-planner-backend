import { Request, Response } from "express";
import { prisma } from "../../database/migrations/connect";
import { getToken } from "../../utils/bearerDecrypt";

class SubCategoryController {
  // criar nova subcategoria
  async create(req: Request, res: Response) {
    // capturar o nome da subcategoria e o id da categoria do corpo da requisição
    const { name } = req.body;

    const { categoryId } = req.params;

    // verificar possível nulidade do name ou do id da categoria
    if (name == null || categoryId == null) {
      return res.status(400).json({
        status: "error",
        message: "Name or categoryId cannot be null",
      });
    }

    try {
      // verificar se o nome da subcategoria é menor que 3 caracteres
      if (name.length < 3) {
        return res.status(400).json({
          status: "error",
          message: "Name must be at least 3 characters",
        });
      }

      // verificar se categoria informada pertence ao usuário logado
      const decryptToken = getToken(req, res);

      if (!decryptToken) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      const categoryUser = await prisma.category.findFirst({
        where: {
          id: parseInt(categoryId),
          userId: decryptToken.id,
        },
      });

      if (!categoryUser) {
        return res.status(403).json({
          status: "error",
          message: "You must be logged in to perform this action",
        });
      }

      // criar uma subcategoria
      const newSubCategory = await prisma.subCategory.create({
        data: {
          name,
          categoryId: Number(categoryId),
        },
      });

      // retornar a subcategoria criada
      return res.status(201).json({
        status: "success",
        data: newSubCategory,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }

  // listar todas as subcategorias
  async list(req: Request, res: Response) {
    // capturar o id da categoria do corpo da requisição
    const { categoryId } = req.params;

    // verificar possível nulidade do id da categoria
    if (categoryId == null) {
      return res.status(400).json({
        status: "error",
        message: "CategoryId cannot be null",
      });
    }

    // capturar id do usuário do token
    const decryptToken = getToken(req, res);

    if (!decryptToken) {
      return res.status(403).json({
        status: "error",
        message: "You must be logged in to perform this action",
      });
    }

    const categoryUser = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
        userId: decryptToken.id,
      },
    });

    if (!categoryUser) {
      return res.status(403).json({
        status: "error",
        message: "You must be logged in to perform this action",
      });
    }

    try {
      // listar todas as subcategorias de uma categoria
      const subCategories = await prisma.subCategory.findMany({
        where: {
          categoryId: Number(categoryId),
        },
      });

      // retornar todas as subcategorias de uma categoria
      return res.status(200).json({
        status: "success",
        data: subCategories,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }

  // atualizar uma subcategoria
  async update(req: Request, res: Response) {
    // capturar o id da subcategoria e o nome da subcategoria do corpo da requisição
    const { name } = req.body;

    const { id, categoryId } = req.params;

    // verificar possível nulidade do id da subcategoria ou do nome da subcategoria
    if (id == null || name == null) {
      return res.status(400).json({
        status: "error",
        message: "Id or name cannot be null",
      });
    }

    // verificar se categoria informada pertence ao usuário logado
    const decryptToken = getToken(req, res);

    if (!decryptToken) {
      return res.status(403).json({
        status: "error",
        message: "You must be logged in to perform this action",
      });
    }

    const categoryUser = await prisma.category.findFirst({
      where: {
        id: parseInt(categoryId),
        userId: decryptToken.id,
      },
    });

    if (!categoryUser) {
      return res.status(403).json({
        status: "error",
        message: "You must be logged in to perform this action",
      });
    }

    try {
      // verificar se o nome da subcategoria é menor que 3 caracteres
      if (name.length < 3) {
        return res.status(400).json({
          status: "error",
          message: "Name must be at least 3 characters",
        });
      }

      console.log("cheguei até aqui");

      // atualizar uma subcategoria
      const updatedSubCategory = await prisma.subCategory.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
        },
      });

      // retornar a subcategoria atualizada
      return res.status(200).json({
        status: "success",
        data: updatedSubCategory,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }

  // deletar uma subcategoria
  async delete(req: Request, res: Response) {
    // capturar o id da subcategoria dos parametros da requisição
    const { id } = req.params;

    // verificar possível nulidade do id da subcategoria
    if (id == null) {
      return res.status(400).json({
        status: "error",
        message: "Id cannot be null",
      });
    }

    console.log({ id });

    try {
      // deletar uma subcategoria
      const deletedSubCategory = await prisma.subCategory.delete({
        where: {
          id: parseInt(id),
        },
      });

      // retornar a subcategoria deletada
      return res.status(200).json({
        status: "success",
        data: deletedSubCategory,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error. (Error code: 50)",
      });
    }
  }
}

export default new SubCategoryController();
