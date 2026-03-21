import type { Request, Response } from "express";
import RegisterUser from "../services/user/RegisterUser.js";
import LoginUser from "../services/user/LoginUser.js";

export const register = async (req: Request, res: Response) => {
  const {
    email,
    password,
    firstname,
    lastname,
    accountType,
    university,
    program,
    yearLevel,
  } = req.body;

  if (!email || !password || !firstname || !lastname || !accountType) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: email, password, firstname, lastname, and accountType are mandatory.",
    });
  }

  const allowedDomains = ["@ncf.edu.ph", "@gbox.ncf.edu.ph"];
  const isInstitutionalEmail = allowedDomains.some((domain) => email.endsWith(domain));
  const isVerified = isInstitutionalEmail;

  const result = await RegisterUser({ ...req.body, isVerified });

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const result = await LoginUser(email, password);

  if (!result.success) {
    return res.status(401).json(result);
  }

  res.status(200).json(result);
};
