import userService from "../services/user.service.js";
import billingInfoService from "../services/billingInfo.service.js";

class UserController {
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const token = await userService.login(email, password);
      // res.cookie("token", token);
      res.status(200).send({ success: true, message: null, body: { token } });
    } catch (error) {
      res.status(401).send({ success: false, message: error.message, body: null });
    }
  };

  getAllModels = async (req, res) => {
    try {
      const models = await userService.getAllModels();
      res.status(200).send({ success: true, message: null, body: models });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message, body: null });
    }
  }

  getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const { user: { id: currentUserId } } = req;
      let userInfo;

      if (id == currentUserId) {
        userInfo = await userService.getUserInfo(id);
      } else {
        userInfo = await userService.getUserById(id);
      }

      res.status(200).send({ success: true, message: null, body: userInfo });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message, body: null });
    }
  };

  createUser = async (req, res) => {
    try {
      const { email, password, confirmPassword, role } = req.body;
      const user = await userService.createUser(email, password, confirmPassword, role);
      res.status(201).send({ success: true, message: null, body: user });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message, body: null });
    }
  };

  updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { password, confirmPassword } = req.body;
      const user = await userService.updateUser(id, password, confirmPassword);
      res.status(200).send({ success: true, message: null, body: user });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message, body: null });
    }
  };

  addBillingInfo = async (req, res) => {
    try {
      const { user: { id: userId } } = req;
      const {
        paymentMethod,
        bankName,
        swiftCode,
        accountNumber,
        ownerFullName,
        ownerEmail,
        ownerAddress,
        postalCode,
        city,
        bankCountry
      } = req.body;


      const bInfo = await billingInfoService.addBillingInfo({
        paymentMethod,
        bankName,
        swiftCode,
        accountNumber,
        ownerFullName,
        ownerEmail,
        ownerAddress,
        postalCode,
        city,
        bankCountry,
        userId
      });
      res.status(200).send({ success: true, message: null, body: bInfo });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message, body: null });
    }
  };

  updateBillingInfo = async (req, res) => {
    try {
      const { user: { id: userId } } = req;
      const {
        paymentMethod,
        bankName,
        swiftCode,
        accountNumber,
        ownerFullName,
        ownerEmail,
        ownerAddress,
        postalCode,
        city,
        bankCountry
      } = req.body;
      const bInfo = await billingInfoService.updateBillingInfo({
        userId,
        billingInfo: {
          paymentMethod, bankName, swiftCode, accountNumber, ownerFullName, ownerEmail, ownerAddress, postalCode, city, bankCountry
        }
      });
      res.status(200).send({ success: true, message: null, body: bInfo });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message, body: null });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.status(200).send({ success: true, message: null, body: null });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message, body: null });
    }
  };

  me = async (req, res) => {
    try {
      const { user: { id } } = req;
      const userInfo = await userService.getUserInfo(id);
      res.status(200).send({ success: true, message: null, body: userInfo });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message, body: null });
    }
  };
}

export default new UserController();
