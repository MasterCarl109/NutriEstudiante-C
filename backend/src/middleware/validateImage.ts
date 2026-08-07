import type { Request, Response, NextFunction } from "express";

const IMAGE_PATH_RE = /^\/uploads\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp|gif)$/;

export function validateImage(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { image } = req.body;

  if (image === undefined || image === null || image === "") {
    req.body.image = "";
    next();
    return;
  }

  if (typeof image !== "string" || !IMAGE_PATH_RE.test(image)) {
    res.status(400).json({
      error:
        "Imagen inválida. Usa una ruta /uploads/archivo.jpg (jpg, jpeg, png, webp o gif)",
    });
    return;
  }

  req.body.image = image;
  next();
}
