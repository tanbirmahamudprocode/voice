const userModel = require("../module/user.module");
const { uploadOnCloudinary } = require("../config/cloudinery");
const { geminiRespont } = require("../../gamini");
const moment = require("moment");
const { response } = require("express");
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: `get current user error ${error}` });
  }
};

const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }
    const user = await userModel
      .findByIdAndUpdate(
        req.userId,
        {
          assistantName,
          assistantImage,
        },
        { new: true }
      )
      .select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "Update assistant error", error });
  }
};

const asktoassistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await userModel.findById(req.userId);
    user.history.push(command);
    await user.save();
    const username = user.name;
    const assistantName = user.assistantName;
    const result = await geminiRespont(command, assistantName, username);
    const jsonMatch = result.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(400).json({ message: "Sorry, I don't understand ." });
    }
    const gemRuselt = JSON.parse(jsonMatch[0]);
    const type = gemRuselt.type;
    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemRuselt.userInput,
          response: `Current date is ${moment().format("DD-MM-YYYY")}`,
        });
      case "get-time": {
        return res.json({
          type,
          userInput: gemRuselt.userInput,
          response: `Current time is ${moment().format("hh:mm:ss A	")}`,
        });
      }
      case "get-day": {
        return res.json({
          type,
          userInput: gemRuselt.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      }
      case "get-month": {
        return res.json({
          type,
          userInput: gemRuselt.userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });
      }
      case "google-search":

      case "youtube-search":

      case "youtube-play":

      case "general":

      case "calculator-open":

      case "instagram-open":

      case "facebook-open":

      case "weather-show":
        return res.json({
          type,
          userInput: gemRuselt.userInput,
          response: gemRuselt.response,
        });
        default:
          return res.status(400).json({
            response: "Sorry, I don't understand .",
          });
    }
    
  } catch (error) {
    return res.status(500).json({ message: "Ask to assistant error", error });
  }
};

module.exports = {
  getCurrentUser,
  updateAssistant,
  asktoassistant,
};
