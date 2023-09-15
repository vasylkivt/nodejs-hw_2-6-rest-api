const models = require("../models/contact");

const list = async (req, res, next) => {
  try {
    const list = await models.Contact.find();

    res.json(list);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await models.Contact.findById(req.params.contactId);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
      return;
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const newContact = await models.Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedContact = await models.Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      res.status(404).json({ message: "Not found" });
      return;
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const updatedContact = await models.Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const status = await models.Contact.findOneAndRemove({
      _id: req.params.contactId,
    });
    if (!status) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  getById,
  add,
  update,
  updateFavorite,
  remove,
};
