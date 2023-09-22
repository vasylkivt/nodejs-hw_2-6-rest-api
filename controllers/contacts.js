const Contact = require("../models/contact");
const { HttpError } = require("../utils");

const list = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner };

  if (favorite) {
    query.favorite = favorite;
  }

  try {
    const list = await Contact.find({ ...query }, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "email");

    res.json(list);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId);

    if (!contact) {
      throw new HttpError({ message: "Not found", status: 404 });
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  const { body } = req;
  const { _id: owner } = req.user;

  try {
    const newContact = await Contact.create({ ...body, owner });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });

    if (!updatedContact) {
      throw new HttpError({ message: "Not found", status: 404 });
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });

    if (!updatedContact) {
      throw new HttpError({ message: "Not found", status: 404 });
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const status = await Contact.findOneAndRemove({
      _id: contactId,
    });

    if (!status) {
      throw new HttpError({ message: "Not found", status: 404 });
    }

    res.json({ message: "Contact deleted" });
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
