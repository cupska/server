const { request, response } = require("express");
const userModel = require("../model/user.model");
const { config } = require("dotenv");
config();

const updateUser = async (req = request, res = response) => {
  const {
    params: { id },
    body: payload,
  } = req;
  try {
    const userData = await userModel.updateUser(id, payload);
    res.status(200).json({ data: userData, error });
  } catch (error) {
    res.json(error);
  }
};

const usernameCheck = async (req = request, res = response, next) => {
  const { username } = req.params;
  try {
    const isExist = await userModel.usernameCheck(username);
    res.status(200).json({ data: { username: { isExist } }, error: null });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (
  { params } = (req = request),
  res = response,
  next
) => {
  try {
    const {
      rows: [{ password, ...userData }],
    } = await userModel.getUserById(params.user.id);
    res.status(200).json({ data: userData, error: null });
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};

module.exports = { updateUser, usernameCheck, getUserById };
